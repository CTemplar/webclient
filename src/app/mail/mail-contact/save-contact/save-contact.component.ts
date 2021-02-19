import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { AppState, Contact, ContactsState, UserState, MailboxKey, PGPEncryptionScheme } from '../../../store/datatypes';
import { ContactAdd, MailboxEffects, MoveToWhitelist } from '../../../store';
import { OpenPgpService } from '../../../store/services';
import { config } from 'rxjs';

import { getEmailDomain } from '../../../shared/config';

@UntilDestroy()
@Component({
  selector: 'app-save-contact',
  templateUrl: './save-contact.component.html',
  styleUrls: ['./save-contact.component.scss', './../mail-contact.component.scss'],
})
export class SaveContactComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() selectedContact: Contact;

  @Output() userSaved = new EventEmitter<boolean>();

  @ViewChild('newContactForm') newContactForm: NgForm;

  @ViewChild('advancedSettingsModal') advancedSettingsModal;

  private advancedSettingsModalRef: NgbModalRef;

  newContactModel: Contact = {
    name: '',
    email: '',
    address: '',
    note: '',
    phone: '',
    enabled_encryption: false,
    public_keys: new Array<MailboxKey>(),
  };

  public inProgress: boolean;

  public internalUser: boolean;

  private isContactsEncrypted: boolean;

  PGPEncryptionScheme: PGPEncryptionScheme;

  constructor(
    private store: Store<AppState>, 
    private openpgp: OpenPgpService, 
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal) {}

  ngOnInit() {
    this.handleUserState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Get contactEmail, Domain and check if this is internalUser with domain
    this.newContactModel = { ...this.selectedContact };
    const contactEmail = this.newContactModel.email;
    const emailDomain = contactEmail.substring(contactEmail.indexOf('@') + 1, contactEmail.length);
    this.internalUser = emailDomain === getEmailDomain();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {}

  private handleUserState(): void {
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((userState: UserState) => {
        this.isContactsEncrypted = userState.settings.is_contacts_encrypted; // set encryption from user settings
      });

    this.store
      .select(state => state.contacts)
      .pipe(untilDestroyed(this))
      .subscribe((contactsState: ContactsState) => {
        if (this.inProgress && !contactsState.inProgress) {
          this.inProgress = false;
          if (!contactsState.isError) {
            this.userSaved.emit(true);
          }
        }
      });
  }

  createNewContact() {
    if (this.newContactForm.invalid) {
      return false;
    }
    this.newContactModel.email = this.newContactModel.email.toLocaleLowerCase();
    if (this.isContactsEncrypted) {
      this.openpgp.encryptContact(this.newContactModel);
    } else {
      this.store.dispatch(new ContactAdd(this.newContactModel));
    }
    this.inProgress = true;
  }

  clearPublicKey() {
    // this.newContactModel.public_key = '';
    // return false;
  }

  onShowAdvancedSettings() {
    this.advancedSettingsModalRef = this.modalService.open(this.advancedSettingsModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-lg',
    });
  }

  onClickIsEncrypt(isEncrypt: boolean) {
    this.newContactModel.enabled_encryption = isEncrypt;
  }

  onSelectEncryptionScheme(scheme: PGPEncryptionScheme) {
    this.newContactModel.encryption_scheme = scheme;
  }
}
