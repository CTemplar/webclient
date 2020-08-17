// Angular
import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

// Components
import { ComposeMailDialogComponent } from '../../mail/mail-sidebar/compose-mail-dialog/compose-mail-dialog.component';

// Services
import { AppState, ComposeMailState, Draft, DraftState, SecureContent, UserState } from '../datatypes';
import { ClearDraft, CreateMail, SendMail, SnackPush } from '../actions';
import { MailService } from './mail.service';
import { OpenPgpService } from './openpgp.service';

// Third-party
import { finalize, take } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable()
export class ComposeMailService {
  private drafts: DraftState;
  private composeMailContainer: ViewContainerRef;
  private componentRefList: Array<ComponentRef<ComposeMailDialogComponent>> = [];

  private userState: UserState;
  minimizedWidth: number = 192;
  originWidth: number = 640;
  windowWidth: number;
  composesWidth: number;
  countCommonCompose: number;

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
              this.setEncryptedContent(draftMail);
              this.store.dispatch(new CreateMail({ ...draftMail }));

            } else if (draftMail.shouldSend && this.drafts[key]) {
              if ((this.drafts[key].isPGPInProgress && !draftMail.isPGPInProgress && !draftMail.isProcessingAttachments) ||
                (this.drafts[key].isProcessingAttachments && !draftMail.isProcessingAttachments && !draftMail.isPGPInProgress)) {
                this.setEncryptedContent(draftMail);
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
                  let publicKeys = [];
                  let hasSshEncryption = false;

                  if (draftMail.draft.encryption && draftMail.draft.encryption.public_key) {
                    hasSshEncryption = true;
                    publicKeys.push(draftMail.draft.encryption.public_key);
                  }

                  if (draftMail.usersKeys.encrypt || hasSshEncryption) {
                    draftMail.draft.is_encrypted = true;
                    publicKeys = [...publicKeys, ...draftMail.usersKeys.keys.filter(item => item.is_enabled).map(item => item.public_key)];
                  }

                  if (publicKeys.length > 0) {
                    draftMail.attachments.forEach(attachment => {
                      this.openPgpService.encryptAttachment(draftMail.draft.mailbox, attachment.decryptedDocument, attachment, publicKeys);
                    });
                    this.openPgpService.encrypt(draftMail.draft.mailbox, draftMail.id, new SecureContent(draftMail.draft), publicKeys);

                  } else {
                    if (!draftMail.isSaving) {
                      let encryptedAttachments = draftMail.attachments.filter(attachment => !!attachment.is_encrypted);
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
                            if (publicKeys.length === 0) {
                              this.store.dispatch(new SendMail({ ...draftMail }));
                            } else {
                              this.openPgpService.encrypt(draftMail.draft.mailbox, draftMail.id,
                                new SecureContent(draftMail.draft), publicKeys);
                            }
                          },
                            error => this.store.dispatch(new SnackPush(
                              { message: 'Failed to send email, please try again. Email has been saved in draft.' })));

                      } else {
                        if (publicKeys.length === 0) {
                          this.store.dispatch(new SendMail({ ...draftMail }));
                        } else {
                          this.openPgpService.encrypt(draftMail.draft.mailbox, draftMail.id,
                            new SecureContent(draftMail.draft), publicKeys);
                        }
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

  private setEncryptedContent(draftMail: Draft) {
    draftMail.draft.content = draftMail.encryptedContent.content;
    if (this.userState.settings && this.userState.settings.is_subject_encrypted) {
      draftMail.draft.subject = draftMail.encryptedContent.subject;
    }
    if (draftMail.draft.encryption && draftMail.draft.encryption.public_key) {
      draftMail.draft.is_subject_encrypted = this.userState.settings.is_subject_encrypted;
      draftMail.draft.is_encrypted = true;
    }
  }

  initComposeMailContainer(container: ViewContainerRef) {
    this.composeMailContainer = container;
    this.componentRefList = [];
  }

  getWindowWidth(width: any = {}) {
    this.windowWidth = (width > 768 && width < 999) ? width - 68 : width;
    if (this.windowWidth > this.originWidth) {
      this.countCommonCompose =
        Math.trunc((this.windowWidth - this.originWidth) / this.minimizedWidth) + 1 > 5
          ? 5
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
            this.componentRefList[i+1].instance.isComposeVisible = false;
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
    let tempWidth = 0;
    this.componentRefList.forEach(componentRef => {
      if (componentRef.instance.isComposeVisible) {
        tempWidth += componentRef.instance.isMinimized  ? this.minimizedWidth : this.originWidth;
      }
    });
    this.composesWidth = tempWidth;
  }

  openComposeMailDialog(inputData: any = {}) {
    if (this.userState && this.componentRefList.length < 5) {
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
      newComponentRef.instance.isMinimized = false;
      this.getComposesWidth();
      if (this.windowWidth < this.composesWidth) {
        for (const i in this.componentRefList) {
          if (this.componentRefList[i].instance.isComposeVisible) {
            this.componentRefList[i].instance.isComposeVisible = false;
            break;
          }
        }
      }
      newComponentRef.instance.hide.subscribe(event => {
        const index = this.componentRefList.indexOf(newComponentRef);
        this.destroyComponent(newComponentRef, index);
      });
      newComponentRef.instance.minimize.subscribe(isMinimized => { 
        if (!isMinimized) { // when Compose window is maximized
          this.componentRefList.forEach(componentRef => {
            componentRef.instance.isMinimized = true;
            componentRef.instance.isFullScreen = false;
            componentRef.instance.isComposeVisible = true;
          });
          newComponentRef.instance.isMinimized = false;
          if (this.windowWidth < (this.minimizedWidth * (this.componentRefList.length - 1) + this.originWidth)) {
            let tempCount = 0;
            for (let i = 0; i < (this.componentRefList.length); i++) {
              if (tempCount === (this.componentRefList.length-this.countCommonCompose)) break;
              if ( this.componentRefList[i].instance.isMinimized ) {
                tempCount += 1;
                this.componentRefList[i].instance.isComposeVisible = false;}
            }
          }
        } else { // when Compose window is minimized
          this.componentRefList.forEach(componentRef => {
            componentRef.instance.isMinimized = true;
            componentRef.instance.isComposeVisible = false;
          });
          let count = Math.trunc(this.windowWidth/this.minimizedWidth);
          if (this.componentRefList.length < count) { count = this.componentRefList.length; }
          for (let i = (this.componentRefList.length - 1); i > (this.componentRefList.length - count); i--) {
            this.componentRefList[i].instance.isComposeVisible = true;
          }
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
    this.getComposesWidth();
    let countNewCompose = (this.windowWidth - this.composesWidth) / this.minimizedWidth;
    for (let i = this.componentRefList.length; i > 0; i--) {
      if (!this.componentRefList[i-1].instance.isComposeVisible && countNewCompose >= 1) {
        countNewCompose -= 1;
        this.componentRefList[i-1].instance.isComposeVisible = true;
      }
    }
  }

}
