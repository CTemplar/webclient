import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppState, MailBoxesState, MailState, Settings, UserState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { CreateFolderComponent } from '../dialogs/create-folder/create-folder.component';
import { ComposeMailDialogComponent } from './compose-mail-dialog/compose-mail-dialog.component';
import { Mail, MailFolderType } from '../../store/models/mail.model';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-sidebar',
  templateUrl: './mail-sidebar.component.html',
  styleUrls: ['./mail-sidebar.component.scss']
})
export class MailSidebarComponent implements OnInit, OnDestroy {

  @ViewChild('composeMailContainer', { read: ViewContainerRef }) composeMailContainer: ViewContainerRef;

  LIMIT = 2;

  readonly destroyed$: Observable<boolean>;

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;
  public settings: Settings;

  mailBoxesState: MailBoxesState;

  private componentRefList: Array<ComponentRef<ComposeMailDialogComponent>> = [];

  draftCount: number = 0;
  inboxUnreadCount: number = 0;

  constructor(private store: Store<AppState>,
              private modalService: NgbModal,
              config: NgbDropdownConfig,
              private componentFactoryResolver: ComponentFactoryResolver) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = 'outside';
  }

  ngOnInit() {
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.settings = user.settings;
      });

    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailboxes: MailBoxesState) => {
        this.mailBoxesState = mailboxes;
      });

      this.store.select(state => state.mail).takeUntil(this.destroyed$)
      .subscribe((mailState: MailState) => {

        // Draft items count
        const drafts = mailState.folders.get(MailFolderType.DRAFT);
        if (drafts) {
          this.draftCount = drafts.length;
        }

        // Inbox unread items count
        const inbox = mailState.folders.get(MailFolderType.INBOX);
        if (inbox) {
          this.inboxUnreadCount = inbox.filter((mail: Mail) => !mail.read).length;
        }

      });
  }

  // == Open NgbModal
  open() {
    this.modalService.open(CreateFolderComponent, { centered: true, windowClass: 'modal-sm mailbox-modal' });
  }

  // == Show mail compose modal
  // == Setup click event to toggle mobile menu
  showMailComposeModal() { // click handler
    this.componentRefList.forEach(componentRef => {
      componentRef.instance.isMinimized = true;
    });
    const factory = this.componentFactoryResolver.resolveComponentFactory(ComposeMailDialogComponent);
    const newComponentRef: ComponentRef<ComposeMailDialogComponent> = this.composeMailContainer.createComponent(factory);
    this.componentRefList.push(newComponentRef);
    const index = this.componentRefList.length - 1;
    newComponentRef.instance.hide.subscribe(event => {
      this.destroyComponent(newComponentRef, index);
    });
  }

  toggleDisplayLimit(totalItems) {
    if (this.LIMIT === totalItems) {
      this.LIMIT = 2;
    } else {
      this.LIMIT = totalItems;
    }
  }

  ngOnDestroy(): void {
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
