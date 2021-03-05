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
import { take } from 'rxjs/operators';

import {
  AppState,
  Contact,
  ContactsState,
  UserState,
  MailboxKey,
  PGPEncryptionType,
  StringBooleanMappedType,
  StringStringMappedType,
  ContactKey,
} from '../../../store/datatypes';
import {
  ContactAdd,
  ContactAddKeys,
  ContactFetchKeys,
  MailboxEffects,
  MoveToWhitelist,
  SnackErrorPush,
  ContactRemoveKeys,
  ContactBulkUpdateKeys,
} from '../../../store';
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

  @ViewChild('advancedSettingsModal') advancedSettingsModal: any;

  private advancedSettingsModalRef: NgbModalRef;

  newContactModel: Contact = {
    name: '',
    email: '',
    address: '',
    note: '',
    phone: '',
    enabled_encryption: false,
  };

  public inProgress: boolean;

  public advancedSettingInProgress: boolean = false;

  public isUpdatedPrimaryKey: boolean = false;

  public isImportingKey: boolean = false;

  public internalUser: boolean;

  private isContactsEncrypted: boolean;

  PGPEncryptionType: PGPEncryptionType;

  keyMatchStatusForEmail: StringBooleanMappedType = {};

  downloadUrls: StringStringMappedType = {};

  selectedContactPulbicKeys: Array<ContactKey> = [];

  constructor(
    private store: Store<AppState>,
    private openpgp: OpenPgpService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.handleUserState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Get contactEmail, Domain and check if this is internalUser with domain
    this.newContactModel = { ...this.selectedContact };
    const contactEmail = this.newContactModel.email;
    const emailDomain = contactEmail.substring(contactEmail.indexOf('@') + 1, contactEmail.length);
    this.internalUser = emailDomain === getEmailDomain();
    if (!this.internalUser) {
      this.store.dispatch(new ContactFetchKeys(this.selectedContact));
    }
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
          if (!contactsState.isError && !this.advancedSettingsModalRef) {
            this.userSaved.emit(true);
          }
        }
        this.advancedSettingInProgress = contactsState.advancedSettingInProgress;
        this.selectedContactPulbicKeys = contactsState.selectedContactKeys;

        this.selectedContactPulbicKeys.forEach(key => {
          this.keyMatchStatusForEmail[key.fingerprint] = key.parsed_emails
            ? key.parsed_emails.includes(this.selectedContact.email)
            : false;
          this.downloadUrls[key.fingerprint] = `data:application/octet-stream;charset=utf-8;base64,${btoa(
            key.public_key,
          )}`;
        });
      });
  }

  createNewContact(isCheckForm: boolean = true) {
    if (isCheckForm && this.newContactForm.invalid) {
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
    if (!this.selectedContactPulbicKeys || this.selectedContactPulbicKeys.length === 0) {
      return;
    }
    this.newContactModel.enabled_encryption = isEncrypt;
    if (!this.newContactModel.encryption_type) {
      this.newContactModel.encryption_type = PGPEncryptionType.PGP_MIME;
    }
  }

  onSelectEncryptionScheme(scheme: string) {
    if (scheme === 'MIME') {
      this.newContactModel.encryption_type = PGPEncryptionType.PGP_MIME;
    } else if (scheme === 'INLINE') {
      this.newContactModel.encryption_type = PGPEncryptionType.PGP_INLINE;
    }
  }

  onSelectNewKeyFile(files: Array<File>) {
    if (files.length > 1) return;
    if (this.isImportingKey) return;

    if (files && files.length) {
      this.isImportingKey = true;
      const file = files[0];
      let reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        const result = event.target.result;
        this.openpgp
          .getKeyInfoFromPublicKey(result)
          .pipe(take(1))
          .subscribe(
            keyInfo => {
              this.isImportingKey = false;
              const newKeyInfo = this.getMailboxKeyModelFromParsedInfo({ ...keyInfo, public_key: result });
              if (newKeyInfo) {
                if (this.selectedContactPulbicKeys && this.selectedContactPulbicKeys.length > 0) {
                  this.selectedContactPulbicKeys.forEach(key => {
                    if (key.fingerprint === newKeyInfo.fingerprint && key.id) {
                      newKeyInfo.id = key.id;
                      newKeyInfo.is_primary = key.is_primary;
                    }
                  });
                }
                this.makeCallForAddKeys(newKeyInfo);
              } else {
                this.store.dispatch(
                  new SnackErrorPush({
                    message: 'Failed to import the public key',
                  }),
                );
              }
            },
            error => {
              this.isImportingKey = false;
              this.store.dispatch(
                new SnackErrorPush({
                  message: `${file.name} is not a valid PGP public key`,
                }),
              );
            },
          );
      });
      reader.readAsText(file);
    }
  }

  makeCallForAddKeys(key: ContactKey) {
    key.contact = this.selectedContact.id;
    this.store.dispatch(new ContactAddKeys(key));
  }

  getMailboxKeyModelFromParsedInfo(keyInfo: any): ContactKey {
    if (keyInfo) {
      const mailboxKey: ContactKey = {};
      let keyType = '';
      if (keyInfo.algorithmInfo) {
        keyType = keyInfo.algorithmInfo.bits ? `RSA${keyInfo.algorithmInfo.bits}` : keyInfo.algorithmInfo.curve;
      }
      mailboxKey.public_key = keyInfo.public_key;
      mailboxKey.key_type = keyType;
      // mailboxKey.created_at = keyInfo.creationTime;
      mailboxKey.fingerprint = keyInfo.fingerprint;
      mailboxKey.parsed_emails = keyInfo.emails;

      // If there is no already associated key, new key would be Primary key
      if (!this.selectedContactPulbicKeys || this.selectedContactPulbicKeys.length === 0) {
        mailboxKey.is_primary = true;
      } else {
        mailboxKey.is_primary = false;
      }
      return mailboxKey;
    }
    return null;
  }

  onRemovePublicKey(key: ContactKey) {
    const remainedKeys = this.selectedContactPulbicKeys.filter(originKey => originKey.id !== key.id);
    if (remainedKeys.length === 0) {
      this.newContactModel.encryption_type = null;
      this.newContactModel.enabled_encryption = false;
      this.createNewContact(false);
    } else if (key.is_primary) {
      remainedKeys[0].is_primary = true;
      this.store.dispatch(new ContactBulkUpdateKeys([remainedKeys[0]]));
    }
    this.store.dispatch(new ContactRemoveKeys(key));
  }

  onSetPrimary(key: ContactKey) {
    this.selectedContactPulbicKeys.forEach(originKey => {
      originKey.is_primary = false;
      if (originKey.fingerprint === key.fingerprint) {
        originKey.is_primary = true;
        this.isUpdatedPrimaryKey = true;
      }
    });
  }

  onSaveAdvancedSettings() {
    this.store.dispatch(new ContactBulkUpdateKeys(this.selectedContactPulbicKeys));
    this.createNewContact(false);
  }
}
