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
  PublicKey,
  SecureContent,
  UserState,
} from '../datatypes';
import { ClearDraft, CreateMail, SendMail, SnackPush } from '../actions';

import { MailService } from './mail.service';
import { OpenPgpService } from './openpgp.service';

@Injectable({
  providedIn: 'root',
})
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
  ) {
    this.store
      .select((state: AppState) => state.composeMail)
      .subscribe((response: ComposeMailState) => {
        Object.keys(response.drafts).forEach((key: any) => {
          const draftMail: Draft = response.drafts[key];
          const usersKeys = response.usersKeys;
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
                this.setEncryptedContent(draftMail);
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
              } else if (this.drafts[key].getUserKeyInProgress && !draftMail.getUserKeyInProgress) {
                let publicKeys: any[] = [];

                if (this.getShouldBeEncrypted(draftMail, usersKeys) /* || hasSshEncryption*/) {
                  draftMail.draft.is_encrypted = true;
                  publicKeys = this.getPublicKeys(draftMail, usersKeys)
                    .filter(item => item.is_enabled)
                    .map(item => item.public_key);
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
                } else if (publicKeys.length > 0 && this.userState.settings.is_attachments_encrypted) {
                  draftMail.attachments.forEach(attachment => {
                    this.openPgpService.encryptAttachment(draftMail.draft.mailbox, attachment, publicKeys);
                  });
                  this.openPgpService.encrypt(
                    draftMail.draft.mailbox,
                    draftMail.id,
                    new SecureContent(draftMail.draft),
                    publicKeys,
                  );
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
        keys.push(usersKeys.get(parsedEmail.address).key);
      });
      return keys;
    }
    return [];
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
