import { HttpResponse } from '@angular/common/http';
import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { forkJoin, Observable } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { ComposeMailDialogComponent } from '../../mail/mail-sidebar/compose-mail-dialog/compose-mail-dialog.component';
import { ClearDraft, CreateMail, SendMail, SnackPush } from '../actions';
import { AppState, ComposeMailState, Draft, DraftState, SecureContent, UserState } from '../datatypes';
import { MailService } from './mail.service';
import { OpenPgpService } from './openpgp.service';

@Injectable()
export class ComposeMailService {
  private drafts: DraftState;
  private composeMailContainer: ViewContainerRef;
  private componentRefList: Array<ComponentRef<ComposeMailDialogComponent>> = [];

  private userState: UserState;

  constructor(private store: Store<AppState>,
              private openPgpService: OpenPgpService,
              private mailService: MailService,
              private componentFactoryResolver: ComponentFactoryResolver) {
    this.store.select((state: AppState) => state.composeMail)
      .subscribe((response: ComposeMailState) => {
        Object.keys(response.drafts).forEach((key) => {
          const draftMail: Draft = response.drafts[key];
          if (draftMail.draft) {
            if (draftMail.shouldSave && this.drafts[key] && this.drafts[key].isPGPInProgress && !draftMail.isPGPInProgress) {
              draftMail.draft.content = draftMail.encryptedContent.content;
              if (this.userState.settings && this.userState.settings.is_subject_encrypted) {
                draftMail.draft.subject = draftMail.encryptedContent.subject;
              }
              this.store.dispatch(new CreateMail({ ...draftMail }));
            } else if (draftMail.shouldSend && this.drafts[key]) {
              if ((this.drafts[key].isPGPInProgress && !draftMail.isPGPInProgress && !draftMail.isProcessingAttachments) ||
                (this.drafts[key].isProcessingAttachments && !draftMail.isProcessingAttachments && !draftMail.isPGPInProgress)) {
                draftMail.draft.content = draftMail.encryptedContent.content;
                if (this.userState.settings && this.userState.settings.is_subject_encrypted) {
                  draftMail.draft.subject = draftMail.encryptedContent.subject;
                }
                if (!draftMail.isSshInProgress) {
                  if (!draftMail.isSaving) {
                    this.store.dispatch(new SendMail({ ...draftMail }));
                  } else {
                    this.store.dispatch(new SnackPush(
                      { message: 'Failed to send email, please try again. Email has been saved in draft.' }));
                  }
                }
              } else if (this.drafts[key].isSshInProgress && !draftMail.isSshInProgress) {
                if (!draftMail.getUserKeyInProgress) {
                  let keys = [];
                  if (draftMail.usersKeys) {
                    keys = draftMail.usersKeys.keys.filter(item => item.is_enabled).map(item => item.public_key);
                  }
                  keys.push(draftMail.draft.encryption.public_key);
                  draftMail.attachments.forEach(attachment => {
                    this.openPgpService.encryptAttachment(draftMail.draft.mailbox, attachment.decryptedDocument, attachment, keys);
                  });
                  this.openPgpService.encrypt(draftMail.draft.mailbox, draftMail.id, new SecureContent(draftMail.draft), keys);
                }
              } else if (this.drafts[key].getUserKeyInProgress && !draftMail.getUserKeyInProgress) {
                if (!draftMail.isSshInProgress) {
                  let keys = [];
                  let hasSshEncryption = false;
                  if (draftMail.draft.encryption && draftMail.draft.encryption.public_key) {
                    hasSshEncryption = true;
                    keys.push(draftMail.draft.encryption.public_key);
                  }
                  if (draftMail.usersKeys.encrypt || hasSshEncryption) {
                    draftMail.draft.is_encrypted = true;
                    keys = [...keys, ...draftMail.usersKeys.keys.filter(item => item.is_enabled).map(item => item.public_key)];
                  }
                  if (keys.length > 0 && this.userState.settings.is_attachments_encrypted) {
                    draftMail.attachments.forEach(attachment => {
                      this.openPgpService.encryptAttachment(draftMail.draft.mailbox, attachment.decryptedDocument, attachment, keys);
                    });
                    this.openPgpService.encrypt(draftMail.draft.mailbox, draftMail.id, new SecureContent(draftMail.draft), keys);
                  } else {
                    if (!draftMail.isSaving) {
                      const encryptedAttachments = draftMail.attachments.filter(attachment => !!attachment.is_encrypted);
                      if (encryptedAttachments.length > 0) {
                        forkJoin(
                          ...encryptedAttachments.map(attachment => {
                            attachment.is_encrypted = false;
                            attachment.document = attachment.decryptedDocument;
                            return Observable.create(observer => {
                              this.mailService.uploadFile(attachment)
                                .pipe(finalize(() => observer.complete()))
                                .subscribe(event => {
                                    if (event instanceof HttpResponse) {
                                      observer.next(event.body);
                                    }
                                  },
                                  error => observer.error(error));
                            });
                          })
                        )
                          .pipe(take(1))
                          .subscribe(responses => {
                              this.store.dispatch(new SendMail({ ...draftMail }));
                            },
                            error => this.store.dispatch(new SnackPush(
                              { message: 'Failed to send email, please try again. Email has been saved in draft.' })));
                      } else {
                        this.store.dispatch(new SendMail({ ...draftMail }));
                      }
                    } else {
                      this.store.dispatch(new SnackPush(
                        { message: 'Failed to send email, please try again. Email has been saved in draft.' }));
                    }
                  }
                }
              }
            }
          }
          if (draftMail.isClosed && !draftMail.shouldSend && !draftMail.shouldSave && !draftMail.inProgress) {
            this.store.dispatch(new ClearDraft(draftMail));
          }
        });

        this.drafts = { ...response.drafts };
      });

    this.store.select((state: AppState) => state.user)
      .subscribe((user: UserState) => {
        this.userState = user;
      });

  }

  initComposeMailContainer(container: ViewContainerRef) {
    this.composeMailContainer = container;
    this.componentRefList = [];
  }

  openComposeMailDialog(inputData: any = {}) {
    if (this.userState &&
      ((this.userState.isPrime && this.componentRefList.length < 3) || (!this.userState.isPrime && this.componentRefList.length === 0))) {
      this.componentRefList.forEach(componentRef => {
        componentRef.instance.isMinimized = true;
      });

      if (inputData.draft) {
        const oldComponentRef = this.componentRefList.find(componentRef => {
          return componentRef.instance.composeMail.draftMail && componentRef.instance.composeMail.draftMail.id === inputData.draft.id;
        });
        if (oldComponentRef) {
          oldComponentRef.instance.isMinimized = false;
          return;
        }
      }
      const factory = this.componentFactoryResolver.resolveComponentFactory(ComposeMailDialogComponent);
      const newComponentRef: ComponentRef<ComposeMailDialogComponent> = this.composeMailContainer.createComponent(factory);
      this.componentRefList.push(newComponentRef);
      Object.keys(inputData).forEach(key => {
        newComponentRef.instance[key] = inputData[key];
      });
      newComponentRef.instance.isComposeVisible = true;
      const index = this.componentRefList.length - 1;
      newComponentRef.instance.hide.subscribe(event => {
        this.destroyComponent(newComponentRef, index);
      });
      newComponentRef.instance.minimize.subscribe(isMinimized => {
        if (!isMinimized) {
          this.componentRefList.forEach(componentRef => {
            componentRef.instance.isMinimized = true;
            componentRef.instance.isFullScreen = false;
          });
          newComponentRef.instance.isMinimized = false;
        }
      });
      newComponentRef.instance.fullScreen.subscribe(isFullScreen => {
        if (isFullScreen) {
          this.componentRefList.forEach(componentRef => {
            componentRef.instance.isFullScreen = false;
            componentRef.instance.isMinimized = true;
          });
          newComponentRef.instance.isFullScreen = true;
        }
      });
    }

  }

  destroyAllComposeMailDialogs(): void {
    this.componentRefList.forEach(componentRef => {
      componentRef.destroy();
    });
    this.componentRefList = [];
  }

  private destroyComponent(newComponentRef: ComponentRef<ComposeMailDialogComponent>, index: number) {
    newComponentRef.destroy();
    this.componentRefList.splice(index, 1);
  }

}
