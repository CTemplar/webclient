import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { finalize, take } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as parseEmail from 'email-addresses';

import { ComposeMailDialogComponent } from '../../mail/mail-sidebar/compose-mail-dialog/compose-mail-dialog.component';
import {
  AppState,
  ComposeMailState,
  Draft,
  DraftState,
  GlobalPublicKey,
  PGP_MIME_DEFAULT_ATTACHMENT_FILE_NAME,
  PGPEncryptionType,
  PublicKey,
  SecureContent,
  UserState,
} from '../datatypes';
import { ClearDraft, CreateMail, SendMail, SnackPush, UploadAttachment } from '../actions';
import { Attachment } from '../models';

import { MailService } from './mail.service';
import { OpenPgpService } from './openpgp.service';
import { MessageBuilderService } from './message.builder.service';

@Injectable()
export class ComposeMailService {
  private drafts: DraftState;

  private composeMailContainer: ViewContainerRef;

  private componentRefList: Array<ComponentRef<ComposeMailDialogComponent>> = [];

  private userState: UserState;

  minimizedWidth = 192;

  originWidth = 640;

  windowWidth: number;

  maxComposeCount = 5;

  composesWidth: number;

  countCommonCompose: number;

  constructor(
    private store: Store<AppState>,
    private openPgpService: OpenPgpService,
    private mailService: MailService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private messageBuilderService: MessageBuilderService,
  ) {
    this.store
      .select((state: AppState) => state.composeMail)
      .subscribe((response: ComposeMailState) => {
        Object.keys(response.drafts).forEach((key: any) => {
          const draftMail: Draft = response.drafts[key];
          const { usersKeys } = response;
          if (draftMail.draft) {
            if (
              draftMail.shouldSave &&
              this.drafts[key] &&
              this.drafts[key].isPGPInProgress &&
              !draftMail.isPGPInProgress
            ) {
              this.setEncryptedContent(draftMail);
              this.store.dispatch(new CreateMail({ ...draftMail }));
            } else if (draftMail.shouldSend && this.drafts[key]) {
              if (
                (this.drafts[key].isPGPInProgress &&
                  !draftMail.isPGPInProgress &&
                  !draftMail.isProcessingAttachments) ||
                (this.drafts[key].isProcessingAttachments &&
                  !draftMail.isProcessingAttachments &&
                  !draftMail.isPGPInProgress)
              ) {
                // PGP Encryption has been finished, don't need to set encryption data, if it is PGP/MIME message
                if (!draftMail.isPGPMimeMessage) {
                  this.setEncryptedContent(draftMail);
                }
                if (!draftMail.isSaving) {
                  if (draftMail.draft && draftMail.draft.encryption && draftMail.draft.encryption.password) {
                    draftMail.draft.encryption.password = '';
                  }
                  this.store.dispatch(new SendMail({ ...draftMail }));
                } else {
                  this.store.dispatch(
                    new SnackPush({
                      message: 'Failed to send email, please try again. Email has been saved in draft.',
                    }),
                  );
                }
              } else if (this.drafts[key].isPGPMimeInProgress && !draftMail.isPGPMimeInProgress) {
                // Finished to encrypt PGP/MIME message context
                if (draftMail.pgpMimeContent) {
                  this.processPGPMimeMessage(draftMail);
                } else {
                  this.store.dispatch(
                    new SnackPush({
                      message: 'Failed to send email, please try again. Email has been saved in draft.',
                    }),
                  );
                }
              } else if (this.drafts[key].getUserKeyInProgress && !draftMail.getUserKeyInProgress) {
                // Finished to get the user keys
                let publicKeys: any[] = [];
                if (this.getShouldBeEncrypted(draftMail, usersKeys)) {
                  draftMail.draft.is_encrypted = true;
                  publicKeys = this.getPublicKeys(draftMail, usersKeys).map(item => item.public_key);
                }
                const encryptionTypeForExternal = this.getEncryptionTypeForExternal(draftMail, usersKeys);
                if (encryptionTypeForExternal !== null && publicKeys.length > 0) {
                  draftMail.draft.is_encrypted = false;
                  draftMail.draft.is_subject_encrypted = false;
                  draftMail.draft.is_autocrypt_encrypted = true;
                  if (encryptionTypeForExternal === PGPEncryptionType.PGP_INLINE) {
                    draftMail.draft.encryption_type = PGPEncryptionType.PGP_INLINE;
                  }
                }
                if (draftMail.draft && draftMail.draft.encryption && draftMail.draft.encryption.password) {
                  draftMail.attachments.forEach(attachment => {
                    this.openPgpService.encryptAttachmentWithOnlyPassword(
                      attachment,
                      draftMail.draft.encryption.password,
                    );
                  });
                  this.openPgpService.encryptWithOnlyPassword(
                    draftMail.id,
                    new SecureContent(draftMail.draft),
                    draftMail.draft.encryption.password,
                  );
                } else if (publicKeys.length > 0) {
                  if (encryptionTypeForExternal === PGPEncryptionType.PGP_MIME) {
                    this.buildPGPMimeMessageAndEncrypt(draftMail.id, publicKeys);
                  } else {
                    draftMail.attachments.forEach(attachment => {
                      this.openPgpService.encryptAttachment(draftMail.draft.mailbox, attachment, publicKeys);
                    });
                    this.openPgpService.encrypt(
                      draftMail.draft.mailbox,
                      draftMail.id,
                      new SecureContent(draftMail.draft),
                      publicKeys,
                      encryptionTypeForExternal,
                    );
                  }
                } else if (!draftMail.isSaving) {
                  const encryptedAttachments = draftMail.attachments.filter(attachment => !!attachment.is_encrypted);
                  if (encryptedAttachments.length > 0) {
                    forkJoin(
                      ...encryptedAttachments.map(attachment => {
                        attachment.is_encrypted = false;
                        attachment.document = attachment.decryptedDocument;
                        return Observable.create((observer: any) => {
                          this.mailService
                            .uploadFile(attachment)
                            .pipe(finalize(() => observer.complete()))
                            .subscribe(
                              event => {
                                if (event instanceof HttpResponse) {
                                  observer.next(event.body);
                                }
                              },
                              error => observer.error(error),
                            );
                        });
                      }),
                    )
                      .pipe(take(1))
                      .subscribe(
                        responses => {
                          if (publicKeys.length === 0) {
                            this.store.dispatch(new SendMail({ ...draftMail }));
                          } else {
                            this.openPgpService.encrypt(
                              draftMail.draft.mailbox,
                              draftMail.id,
                              new SecureContent(draftMail.draft),
                              publicKeys,
                            );
                          }
                        },
                        error =>
                          this.store.dispatch(
                            new SnackPush({
                              message: 'Failed to send email, please try again. Email has been saved in draft.',
                            }),
                          ),
                      );
                  } else if (publicKeys.length === 0) {
                    this.store.dispatch(new SendMail({ ...draftMail }));
                  } else {
                    this.openPgpService.encrypt(
                      draftMail.draft.mailbox,
                      draftMail.id,
                      new SecureContent(draftMail.draft),
                      publicKeys,
                      encryptionTypeForExternal,
                    );
                  }
                } else {
                  this.store.dispatch(
                    new SnackPush({
                      message: 'Failed to send email, please try again. Email has been saved in draft.',
                    }),
                  );
                }
                // }
              }
            }
          }
          if (draftMail.isClosed && !draftMail.shouldSend && !draftMail.shouldSave && !draftMail.inProgress) {
            this.store.dispatch(new ClearDraft(draftMail));
          }
        });

        this.drafts = { ...response.drafts };
      });

    this.store
      .select((state: AppState) => state.user)
      .subscribe((user: UserState) => {
        this.userState = user;
      });
  }

  private getShouldBeEncrypted(draftMail: Draft, usersKeys: Map<string, GlobalPublicKey>): boolean {
    if (draftMail.draft) {
      const keys = this.getPublicKeys(draftMail, usersKeys);
      return keys.every(key => key.public_key);
    }
    return false;
  }

  private getPublicKeys(draftMail: Draft, usersKeys: Map<string, GlobalPublicKey>): Array<PublicKey> {
    if (draftMail.draft) {
      const receivers: string[] = [
        ...draftMail.draft.receiver.map(receiver => receiver),
        ...draftMail.draft.cc.map(cc => cc),
        ...draftMail.draft.bcc.map(bcc => bcc),
      ];
      let keys: any[] = [];
      receivers.forEach(receiver => {
        const parsedEmail = parseEmail.parseOneAddress(receiver) as parseEmail.ParsedMailbox;
        keys = [...keys, ...usersKeys.get(parsedEmail.address).key];
      });
      return keys;
    }
    return [];
  }

  private getEncryptionTypeForExternal(draftMail: Draft, usersKeys: Map<string, GlobalPublicKey>): PGPEncryptionType {
    if (draftMail.draft) {
      const receivers: string[] = [
        ...draftMail.draft.receiver.map(receiver => receiver),
        ...draftMail.draft.cc.map(cc => cc),
        ...draftMail.draft.bcc.map(bcc => bcc),
      ];
      const isPGPInline = receivers.every(receiver => {
        const parsedEmail = parseEmail.parseOneAddress(receiver) as parseEmail.ParsedMailbox;
        if (usersKeys.has(parsedEmail.address)) {
          return usersKeys.get(parsedEmail.address).pgpEncryptionType === PGPEncryptionType.PGP_INLINE;
        }
        return false;
      });
      if (isPGPInline) {
        return PGPEncryptionType.PGP_INLINE;
      }
      const isPGPMime = receivers.every(receiver => {
        const parsedEmail = parseEmail.parseOneAddress(receiver) as parseEmail.ParsedMailbox;
        if (usersKeys.has(parsedEmail.address)) {
          return usersKeys.get(parsedEmail.address).pgpEncryptionType === PGPEncryptionType.PGP_MIME;
        }
        return false;
      });
      if (isPGPMime) {
        return PGPEncryptionType.PGP_MIME;
      }
      return null;
    }
    return null;
  }

  private setEncryptedContent(draftMail: Draft) {
    draftMail.draft.content = draftMail.encryptedContent.content;
    if (this.userState.settings) {
      draftMail.draft.subject = draftMail.encryptedContent.subject;
    }
    if (draftMail.draft.encryption && draftMail.draft.encryption.password) {
      draftMail.draft.is_subject_encrypted = true;
      draftMail.draft.is_encrypted = true;
    }
  }

  /**
   * Force Making `encrypted.asc` file with `draftMail.encryptedContent`
   * @param draftMail
   * @private
   */
  private processPGPMimeMessage(draftMail: Draft) {
    const { pgpMimeContent } = draftMail;
    const newDocument = new File([pgpMimeContent], PGP_MIME_DEFAULT_ATTACHMENT_FILE_NAME, {
      type: '',
    });
    const attachmentToUpload: Attachment = {
      document: newDocument,
      draftId: draftMail.id,
      inProgress: false,
      is_inline: false,
      is_encrypted: false,
      message: draftMail.draft.id,
      name: PGP_MIME_DEFAULT_ATTACHMENT_FILE_NAME,
      size: newDocument.size.toString(),
      actual_size: newDocument.size,
      is_pgp_mime: true,
    };
    this.store.dispatch(new UploadAttachment({ ...attachmentToUpload, isPGPMimeMessage: true }));
  }

  /**
   * Build PGP/MIME message with the standard format
   * @param draftMailId
   * @param publicKeys
   */
  buildPGPMimeMessageAndEncrypt(draftMailId: number, publicKeys: Array<any>) {
    const draftMail: Draft = this.drafts[draftMailId];
    if (draftMail?.draft?.id) {
      this.messageBuilderService
        .getMimeData(
          new SecureContent(draftMail.draft),
          draftMail.attachments,
          true,
          true,
          true,
          PGPEncryptionType.PGP_MIME,
        )
        .then(mimeData => {
          this.openPgpService.encryptForPGPMime(mimeData, draftMail.draft.mailbox, draftMail.id, publicKeys);
        })
        .catch(error => {
          this.store.dispatch(
            new SnackPush({
              message: 'Failed to send email, please try again. Email has been saved in draft.',
            }),
          );
        });
    } else {
      setTimeout(() => {
        this.buildPGPMimeMessageAndEncrypt(draftMailId, publicKeys);
      }, 500);
    }
  }

  initComposeMailContainer(container: ViewContainerRef) {
    this.composeMailContainer = container;
    this.componentRefList = [];
  }

  getWindowWidth(width: any = {}) {
    // get current window's width
    this.windowWidth = width > 768 && width < 999 ? width - 68 : width;
    if (this.windowWidth > this.originWidth) {
      this.countCommonCompose =
        Math.trunc((this.windowWidth - this.originWidth) / this.minimizedWidth) + 1 > this.maxComposeCount
          ? this.maxComposeCount
          : Math.trunc((this.windowWidth - this.originWidth) / this.minimizedWidth) + 1;
    } else {
      this.countCommonCompose = 0;
    }
    let composesWidth = 0;
    if (this.componentRefList.length > 0) {
      for (let i = this.componentRefList.length - 1; i > -1; i--) {
        composesWidth += this.componentRefList[i].instance.isMinimized ? this.minimizedWidth : this.originWidth;
        if (composesWidth > this.windowWidth) {
          if (!this.componentRefList[i].instance.isMinimized) {
            this.componentRefList[i].instance.isComposeVisible = true;
            this.componentRefList[i + 1].instance.isComposeVisible = false;
          } else {
            this.componentRefList[i].instance.isComposeVisible = false;
          }
          break;
        } else {
          this.componentRefList[i].instance.isComposeVisible = true;
        }
      }
    }
  }

  getComposesWidth() {
    // get entire width of opened Compose windows
    let temporaryWidth = 0;
    this.componentRefList.forEach(componentReference => {
      if (componentReference.instance.isComposeVisible) {
        temporaryWidth += componentReference.instance.isMinimized ? this.minimizedWidth : this.originWidth;
      }
    });
    this.composesWidth = temporaryWidth;
  }

  openComposeMailDialog(inputData: any = {}) {
    if (this.userState && this.componentRefList.length < this.maxComposeCount) {
      this.componentRefList.forEach(componentReference => {
        componentReference.instance.isMinimized = true;
      });

      if (inputData.draft) {
        const oldComponentReference = this.componentRefList.find(componentReference => {
          return (
            componentReference.instance.composeMail.draftMail &&
            componentReference.instance.composeMail.draftMail.id === inputData.draft.id
          );
        });
        if (oldComponentReference) {
          oldComponentReference.instance.isMinimized = false;
          return;
        }
      }
      const factory = this.componentFactoryResolver.resolveComponentFactory(ComposeMailDialogComponent);
      const newComponentReference: ComponentRef<ComposeMailDialogComponent> = this.composeMailContainer.createComponent(
        factory,
      );
      this.componentRefList.push(newComponentReference);
      Object.keys(inputData).forEach(key => {
        (newComponentReference as any).instance[key] = inputData[key];
      });
      newComponentReference.instance.isComposeVisible = true;
      newComponentReference.instance.isMinimized = false;
      this.getComposesWidth();
      newComponentReference.instance.hide.subscribe(() => {
        const index = this.componentRefList.indexOf(newComponentReference);
        this.destroyComponent(newComponentReference, index);
      });
      newComponentReference.instance.minimize.subscribe((isMinimized: boolean) => {
        if (!isMinimized) {
          // when Compose window is maximized
          this.componentRefList.forEach(componentReference => {
            componentReference.instance.isMinimized = true;
            componentReference.instance.isFullScreen = false;
            componentReference.instance.isComposeVisible = true;
          });
          newComponentReference.instance.isMinimized = false;
          if (this.windowWidth < this.minimizedWidth * (this.componentRefList.length - 1) + this.originWidth) {
            let temporaryCount = 0;
            for (let i = 0; i < this.componentRefList.length; i++) {
              if (temporaryCount === this.componentRefList.length - this.countCommonCompose) {
                break;
              }
              if (this.componentRefList[i].instance.isMinimized) {
                temporaryCount += 1;
                this.componentRefList[i].instance.isComposeVisible = false;
              }
            }
          }
        } else {
          // when Compose window is minimized
          this.componentRefList.forEach(componentReference => {
            componentReference.instance.isMinimized = true;
            componentReference.instance.isComposeVisible = false;
          });
          let count = Math.trunc(this.windowWidth / this.minimizedWidth);
          if (this.componentRefList.length < count) {
            count = this.componentRefList.length;
          }
          for (let i = this.componentRefList.length - 1; i >= this.componentRefList.length - count; i--) {
            this.componentRefList[i].instance.isComposeVisible = true;
          }
        }
      });
      newComponentReference.instance.fullScreen.subscribe((isFullScreen: boolean) => {
        if (isFullScreen) {
          this.componentRefList.forEach(componentReference => {
            componentReference.instance.isFullScreen = false;
            componentReference.instance.isMinimized = true;
          });
          newComponentReference.instance.isFullScreen = true;
        }
      });
    } else {
      // display error message when user open more than 5 composer
      this.store.dispatch(new SnackPush({ message: 'Maximum composer reached.', duration: 5000 }));
    }
  }

  destroyAllComposeMailDialogs(): void {
    this.componentRefList.forEach(componentReference => {
      componentReference.destroy();
    });
    this.componentRefList = [];
  }

  private destroyComponent(newComponentReference: ComponentRef<ComposeMailDialogComponent>, index: number) {
    newComponentReference.destroy();
    this.componentRefList.splice(index, 1);
    this.getComposesWidth();
    let countNewCompose = (this.windowWidth - this.composesWidth) / this.minimizedWidth;
    for (let i = this.componentRefList.length; i > 0; i--) {
      if (!this.componentRefList[i - 1].instance.isComposeVisible && countNewCompose >= 1) {
        countNewCompose -= 1;
        this.componentRefList[i - 1].instance.isComposeVisible = true;
      }
    }
  }
}
