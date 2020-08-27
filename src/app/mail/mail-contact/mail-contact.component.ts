import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppState, Contact, ContactsState, PlanType, UserState, MailBoxesState } from '../../store/datatypes';
import { ContactDelete, ContactImport, ContactsGet, SnackErrorPush, ContactNotify } from '../../store';
// Store
import { Store } from '@ngrx/store';
import { NgbDropdownConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { BreakpointsService } from '../../store/services/breakpoint.service';
import { ComposeMailService } from '../../store/services/compose-mail.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';

import { Mailbox, Mail } from '../../store/models';
import { TranslateService } from '@ngx-translate/core';

export enum ContactsProviderType {
  GOOGLE = <any>'GOOGLE',
  YAHOO = <any>'YAHOO',
  OUTLOOK = <any>'OUTLOOK',
  OTHER = <any>'OTHER'
}

@UntilDestroy()
@Component({
  selector: 'app-mail-contact',
  templateUrl: './mail-contact.component.html',
  styleUrls: ['./mail-contact.component.scss']
})
export class MailContactComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('importContactsModal') importContactsModal;
  @ViewChild('confirmDeleteModal') confirmDeleteModal;
  @ViewChild('addUserContent') addUserContent;
  @ViewChild('notifyContactsModal') notifyContactsModal;

  contactsProviderType = ContactsProviderType;
  public userState: UserState;
  public contactsState: ContactsState;
  public isNewContact: boolean;
  public selectedContact: Contact;
  public inProgress: boolean;
  public selectAll: boolean;
  public selectedContacts: Contact[] = [];
  selectedContactsProvider: ContactsProviderType;
  importContactsError: any;
  isLayoutSplitted = false;
  checkAll = false;
  isMenuOpened: boolean;
  isMobile: boolean;
  currentPlan: PlanType;
  currentMailbox: Mailbox;
  notifyContactsMail: any = {};

  MAX_EMAIL_PAGE_LIMIT = 1;
  LIMIT = 20;
  OFFSET = 0;
  PAGE = 0;

  private contactsCount: number;
  private confirmModalRef: NgbModalRef;
  private importContactsModalRef: NgbModalRef;
  private notifyContactsModalRef: NgbModalRef;
  private searchText: string;

  constructor(private store: Store<AppState>,
    private modalService: NgbModal,
    private breakpointsService: BreakpointsService,
    private composeMailService: ComposeMailService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    config: NgbDropdownConfig,
    @Inject(DOCUMENT) private document: Document,
    private cdr: ChangeDetectorRef) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = true;
  }

  ngOnInit() {
    this.updateUsersStatus();
    this.activatedRoute.queryParams.pipe(untilDestroyed(this))
      .subscribe((params) => {
        this.searchText = params.search || '';
        this.store.dispatch(new ContactsGet({ limit: 20, offset: 0, q: this.searchText }));
      });

    this.isMobile = window.innerWidth <= 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = window.innerWidth <= 768;
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void { }

  private updateUsersStatus(): void {
    this.store.select(state => state.user)
      .pipe(untilDestroyed(this)).subscribe((state: UserState) => {
        this.userState = state;
        this.currentPlan = state.settings.plan_type || PlanType.FREE;
      });

    this.store.select(state => state.contacts)
      .pipe(untilDestroyed(this)).subscribe((contactsState: ContactsState) => {
        this.contactsState = contactsState;
        this.inProgress = contactsState.inProgress;
        this.MAX_EMAIL_PAGE_LIMIT = contactsState.totalContacts;
        if (this.contactsCount === contactsState.contacts.length + this.selectedContacts.length) {
          this.selectedContacts = [];
          this.contactsCount = null;
        }
      });
      this.store.select(state => state.mailboxes).pipe(untilDestroyed(this))
      .subscribe((mailBoxesState: MailBoxesState) => {
        if (mailBoxesState.currentMailbox) {
          this.currentMailbox = mailBoxesState.currentMailbox;
        } else if (mailBoxesState.mailboxes.length > 0) {
          this.currentMailbox = mailBoxesState.mailboxes[0];
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

  checkContact(contact: Contact) {
    this.selectAll = false;
    contact.markForDelete = !contact.markForDelete;
  }

  openConfirmDeleteModal(modalRef) {
    this.selectedContacts = this.contactsState.contacts.filter(item => item.markForDelete);
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

  selectEntire(status) {
    if (status) {
      this.checkAll = true;
    } else {
      this.checkAll = false;
      this.selectAll = false;
      this.toggleSelectAll();
    }
  }

  deleteContacts() {
    this.confirmModalRef.close();
    this.inProgress = true;
    this.contactsCount = this.contactsState.contacts.length;
    const deleteContacts = this.checkAll ? 'all' : this.selectedContacts.map(item => item.id).join(',');
    this.store.dispatch(new ContactDelete(deleteContacts));
  }

  showComposeMailDialog() {
    this.selectedContacts = this.contactsState.contacts.filter(item => item.markForDelete);
    if (this.selectedContacts.length > 10) {
      this.store.dispatch(new SnackErrorPush({
        message: 'Cannot open compose for more than 10 contacts'
      }));
    } else {
      const receiverEmails = this.selectedContacts.map(contact => contact.email);
      this.composeMailService.openComposeMailDialog({
        receivers: receiverEmails,
        isFullScreen: this.userState.settings.is_composer_full_screen
      });
    }
  }

  toggleSelectAll() {
    this.contactsState.contacts.forEach(item => item.markForDelete = this.selectAll);
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

  cancelNotifyContacts() {
    this.notifyContactsModalRef.close();
  }

  notifyContacts() {
    this.notifyContactsModalRef.close();
    this.inProgress = true;
    this.contactsCount = this.contactsState.contacts.length;
    const contacts = this.selectedContacts.map(item => item.email);
    const display_name = this.currentMailbox.display_name ? this.currentMailbox.display_name : this.currentMailbox.email;
    // generating mails
    this.notifyContactsMail = {
      mailbox: this.currentMailbox.id,
      sender: this.currentMailbox.email,
      receiver: contacts,
      display_name
    }
    this.store.dispatch(new ContactNotify(this.notifyContactsMail));
  }

  openNotifyContactsModal() {
    this.selectedContacts = this.contactsState.contacts.filter(item => item.markForDelete);
    if (this.selectedContacts.length === 0) {
      return;
    }
    this.notifyContactsModalRef = this.modalService.open(this.notifyContactsModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
  }

  closeNotifyContactsModal() {
    if (this.notifyContactsModalRef) {
      this.notifyContactsModalRef.close();
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

  prevPage() {
    if (this.PAGE > 0) {
      this.PAGE--;
      this.OFFSET = this.PAGE * this.LIMIT;
      this.store.dispatch(new ContactsGet({ limit: this.LIMIT, offset: this.OFFSET, q: this.searchText }));
    }
  }

  nextPage() {
    if (((this.PAGE + 1) * this.LIMIT) < this.MAX_EMAIL_PAGE_LIMIT) {
      this.OFFSET = (this.PAGE + 1) * this.LIMIT;
      this.PAGE++;
      this.store.dispatch(new ContactsGet({ limit: this.LIMIT, offset: this.OFFSET, q: this.searchText }));
    }
  }
}
