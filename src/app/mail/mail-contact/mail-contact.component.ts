import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppState, Contact, UserState } from '../../store/datatypes';
import { ContactDelete } from '../../store';
// Store
import { Store } from '@ngrx/store';
import { NgbDropdownConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import 'rxjs/add/operator/takeUntil';
import { BreakpointsService } from '../../store/services/breakpoint.service';
import { NotificationService } from '../../store/services/notification.service';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-contact',
  templateUrl: './mail-contact.component.html',
  styleUrls: ['./mail-contact.component.scss']
})
export class MailContactComponent implements OnInit, OnDestroy {

  isLayoutSplitted: boolean = false;
  public userState: UserState;
  public isNewContact: boolean;
  readonly destroyed$: Observable<boolean>;
  public selectedContact: Contact;
  public inProgress: boolean;
  public selectAll: boolean;

  private contactsCount: number;
  public contactsToDelete: Contact[] = [];
  private confirmModalRef: NgbModalRef;

  constructor(private store: Store<AppState>,
              private modalService: NgbModal,
              private breakpointsService: BreakpointsService,
              private notificationService: NotificationService,
              config: NgbDropdownConfig) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = 'outside';
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
      if (this.contactsCount === this.userState.contact.length + this.contactsToDelete.length) {
        this.inProgress = false;
        this.notificationService.showSuccess('Contacts deleted successfully.');
        this.contactsToDelete = [];
        this.contactsCount = null;
      }
    });
  }

  initSplitContactLayout(): any {
    this.isLayoutSplitted = true;

    if (this.isLayoutSplitted === true) {
      window.document.documentElement.classList.add('no-scroll');
    }
    this.isNewContact = true;
  }

  destroySplitContactLayout(): any {
    this.isLayoutSplitted = false;

    if (this.isLayoutSplitted === false) {
      window.document.documentElement.classList.remove('no-scroll');
    }
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
    this.contactsToDelete = this.userState.contact.filter(item => item.markForDelete);
    if (this.contactsToDelete.length === 0) {
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
    this.contactsToDelete.forEach((contact) => {
      this.store.dispatch(new ContactDelete(contact.id));
    });
  }

  toggleSelectAll() {
    this.userState.contact.forEach(item => item.markForDelete = this.selectAll);
  }
}
