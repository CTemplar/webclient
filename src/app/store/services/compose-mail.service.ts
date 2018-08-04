import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { ComposeMailDialogComponent } from '../../mail/mail-sidebar/compose-mail-dialog/compose-mail-dialog.component';
import { ClearDraft, CreateMail, SendMail } from '../actions';
import { AppState, ComposeMailState, Draft, DraftState, UserState } from '../datatypes';
import { OpenPgpService } from './openpgp.service';

@Injectable()
export class ComposeMailService {
  private drafts: DraftState;
  private composeMailContainer: ViewContainerRef;
  private componentRefList: Array<ComponentRef<ComposeMailDialogComponent>> = [];

  private userState: UserState;

  constructor(private store: Store<AppState>,
              private openPgpService: OpenPgpService,
              private componentFactoryResolver: ComponentFactoryResolver) {
    this.store.select((state: AppState) => state.composeMail)
      .subscribe((response: ComposeMailState) => {
        Object.keys(response.drafts).forEach((key) => {
          const draftMail: Draft = response.drafts[key];
          if (draftMail.draft) {
            if (draftMail.shouldSave && this.drafts[key] && this.drafts[key].isPGPInProgress && !draftMail.isPGPInProgress) {
              draftMail.draft.content = draftMail.encryptedContent;
              this.store.dispatch(new CreateMail({ ...draftMail }));
            } else if (draftMail.shouldSend && this.drafts[key] && this.drafts[key].isPGPInProgress && !draftMail.isPGPInProgress) {
              draftMail.draft.content = draftMail.encryptedContent;
              this.store.dispatch(new SendMail({ ...draftMail }));
            } else if (draftMail.shouldSend && this.drafts[key].getUserKeyInProgress && !draftMail.getUserKeyInProgress) {
              this.openPgpService.encrypt(draftMail.id, draftMail.draft.content, draftMail.usersKeys.map(item => item.public_key));
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
    if (this.componentRefList.length < 3) {
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
          });
          newComponentRef.instance.isMinimized = false;
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
