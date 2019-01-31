import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { AppState, Contact, UserState } from '../../store/datatypes';
import { ContactDelete, ContactImport, SnackErrorPush } from '../../store';
// Store
import { Store } from '@ngrx/store';
import { NgbDropdownConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import 'rxjs/add/operator/takeUntil';
import { BreakpointsService } from '../../store/services/breakpoint.service';
import { ComposeMailService } from '../../store/services/compose-mail.service';

export enum ContactsProviderType {
  GOOGLE = <any>'GOOGLE',
  YAHOO = <any>'YAHOO',
  OUTLOOK = <any>'OUTLOOK',
  OTHER = <any>'OTHER'
}

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-contact',
  templateUrl: './mail-contact.component.html',
  styleUrls: ['./mail-contact.component.scss']
})
export class MailContactComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  @ViewChild('importContactsModal') importContactsModal;

  contactsProviderType = ContactsProviderType;
  public userState: UserState;
  public isNewContact: boolean;
  public selectedContact: Contact;
  public inProgress: boolean;
  public selectAll: boolean;
  public selectedContacts: Contact[] = [];
  selectedContactsProvider: ContactsProviderType;
  importContactsError: any;
  isLayoutSplitted: boolean = false;
  isMenuOpened: boolean;

  private contactsCount: number;
  private confirmModalRef: NgbModalRef;
  private importContactsModalRef: NgbModalRef;

  constructor(private store: Store<AppState>,
              private modalService: NgbModal,
              private breakpointsService: BreakpointsService,
              private composeMailService: ComposeMailService,
              config: NgbDropdownConfig,
              @Inject(DOCUMENT) private document: Document) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = true;
  }

  ngOnInit() {
    this.updateUsersStatus();
  }

  ngOnDestroy(): void {
  }

  private updateUsersStatus(): void {
    this.store.select(state => state.user)
      .takeUntil(this.destroyed$).subscribe((state: UserState) => {
      this.userState = state;
      this.inProgress = this.userState.inProgress;
      if (this.contactsCount === this.userState.contact.length + this.selectedContacts.length) {
        this.selectedContacts = [];
        this.contactsCount = null;
      }
    });
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

  initSplitContactLayout(): any {
    this.isLayoutSplitted = true;
    this.isNewContact = true;
  }

  destroySplitContactLayout(): any {
    this.isLayoutSplitted = false;
    this.isNewContact = false;
    this.selectedContact = null;
  }

  addUserContactModalOpen(addUserContent) {
    this.isNewContact = true;
    this.modalService.open(
      addUserContent,
      {
        centered: true,
        windowClass: 'modal-sm users-action-modal',
        beforeDismiss: () => {
          this.isNewContact = false;
          this.selectedContact = null;
          return true;
        },
      });
  }

  editContact(contact: Contact, addUserContent) {
    this.selectedContact = contact;
    if (this.breakpointsService.isSM()) {
      this.addUserContactModalOpen(addUserContent);
    } else {
      this.initSplitContactLayout();
    }
  }

  openConfirmDeleteModal(modalRef) {
    this.selectedContacts = this.userState.contact.filter(item => item.markForDelete);
    if (this.selectedContacts.length === 0) {
      return;
    }
    this.confirmModalRef = this.modalService.open(modalRef, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
  }

  cancelDelete() {
    this.confirmModalRef.close();
  }

  deleteContacts() {
    this.confirmModalRef.close();
    this.inProgress = true;
    this.contactsCount = this.userState.contact.length;
    this.store.dispatch(new ContactDelete(this.selectedContacts.map(item => item.id).join(',')));
  }

  showComposeMailDialog() {
    this.selectedContacts = this.userState.contact.filter(item => item.markForDelete);
    if (this.selectedContacts.length > 10) {
      this.store.dispatch(new SnackErrorPush({
        message: 'Cannot open compose for more than 10 contacts'
      }));
    } else {
      const receiverEmails = this.selectedContacts.map(contact => contact.email);
      this.composeMailService.openComposeMailDialog({receivers: receiverEmails});
    }
  }

  toggleSelectAll() {
    this.userState.contact.forEach(item => item.markForDelete = this.selectAll);
  }

  openImportContactsModal() {
    this.selectedContactsProvider = null;
    this.importContactsError = null;
    this.importContactsModalRef = this.modalService.open(this.importContactsModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
  }

  closeImportContactsModal() {
    if (this.importContactsModalRef) {
      this.importContactsModalRef.close();
    }
  }

  onContactsFileSelected(files: Array<File>) {
    if (files.length === 1) {
      const data = {
        file: files[0],
        provider: this.selectedContactsProvider
      };
      this.store.dispatch(new ContactImport(data));
      this.closeImportContactsModal();
    } else if (files.length > 1) {
      this.importContactsError = 'Multiple files are not allowed.';
    }
  }
}
