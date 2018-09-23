import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef, Inject } from '@angular/core';
import { NgbDropdownConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppState, MailBoxesState, MailState, UserState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { ComposeMailService } from '../../store/services/compose-mail.service';
import { CreateFolderComponent } from '../dialogs/create-folder/create-folder.component';
import { Folder, Mail, Mailbox, MailFolderType } from '../../store/models/mail.model';
import { MoveMail, CreateFolder, DeleteFolder } from '../../store/actions/mail.actions';
import { ComposeMailDialogComponent } from './compose-mail-dialog/compose-mail-dialog.component';
import { DOCUMENT } from '@angular/platform-browser';
import { BreakpointsService } from '../../store/services/breakpoint.service';
import { NotificationService } from '../../store/services/notification.service';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-sidebar',
  templateUrl: './mail-sidebar.component.html',
  styleUrls: ['./mail-sidebar.component.scss']
})
export class MailSidebarComponent implements OnInit, OnDestroy {

  LIMIT = 2;

  readonly destroyed$: Observable<boolean>;

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;
  public userState: UserState;
  @ViewChild('confirmationModal') confirmationModal;
  confirmModalRef: NgbModalRef;

  mailBoxesState: MailBoxesState;
  mailState: MailState;
  selectedFolder: Folder;

  draftCount: number = 0;
  inboxUnreadCount: number = 0;
  isMenuOpened: boolean;
  customFolders: Folder[] = [];
  currentMailbox: Mailbox;

  constructor(private store: Store<AppState>,
              private modalService: NgbModal,
              config: NgbDropdownConfig,
              private breakpointsService: BreakpointsService,
              private composeMailService: ComposeMailService,
              private notificationService: NotificationService,
              @Inject(DOCUMENT) private document: Document) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = 'outside';
  }

  ngOnInit() {
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.userState = user;
      });

    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailboxes: MailBoxesState) => {
        this.mailBoxesState = mailboxes;
        this.currentMailbox = mailboxes.currentMailbox;
        if (mailboxes.currentMailbox) {
          this.customFolders = this.currentMailbox.customFolders;
        }
      });

    this.store.select(state => state.mail).takeUntil(this.destroyed$)
      .subscribe((mailState: MailState) => {

        this.mailState = mailState;

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

  /**
   * @description
   * Prime Users - Can create as many folders as they want
   * Free Users - Only allow a maximum of 3 folders per account
   */
  // == Open NgbModal
  open() {
    if (this.userState.isPrime) {
      this.modalService.open(CreateFolderComponent, { centered: true, windowClass: 'modal-sm mailbox-modal' });
    } else if (this.mailBoxesState.currentMailbox.customFolders === null || this.mailBoxesState.currentMailbox.customFolders.length < 3) {
      this.modalService.open(CreateFolderComponent, { centered: true, windowClass: 'modal-sm mailbox-modal' });
    } else {
      this.notificationService.showSnackBar('Free users can only create a maximum of 3 folders.');
    }
  }

  // == Show mail compose modal
  openComposeMailDialog() {
    this.composeMailService.openComposeMailDialog();
  }

  showConfirmationModal(folder) {
    this.confirmModalRef = this.modalService.open(this.confirmationModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
    this.selectedFolder = folder;
  }

  toggleDisplayLimit(totalItems) {
    if (this.LIMIT === totalItems) {
      this.LIMIT = 2;
    } else {
      this.LIMIT = totalItems;
    }
  }

  deleteFolder() {
    this.store.dispatch(new DeleteFolder(this.selectedFolder));
    this.confirmModalRef.dismiss();
  }

  toggleMenu() { // click handler
    if (this.breakpointsService.isSM() || this.breakpointsService.isXS()) {
      if (this.isMenuOpened) {
        this.document.body.classList.remove('menu-open');
        this.isMenuOpened = false;
      }
      if (this.document.body.classList.contains('menu-open')) {
        this.isMenuOpened = true;
      }
    }
  }


  ngOnDestroy(): void {
  }
}
