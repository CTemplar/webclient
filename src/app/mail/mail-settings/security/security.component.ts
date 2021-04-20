import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AppState, Auth2FA, AuthState, ContactsState, PlanType, Settings, UserState } from '../../../store/datatypes';
import { MailSettingsService } from '../../../store/services/mail-settings.service';
import {
  ChangePassphraseSuccess,
  ChangePassword,
  Update2FA,
  Get2FASecret,
  ContactsGet,
  ClearContactsToDecrypt,
} from '../../../store/actions';
import { SnackErrorPush } from '../../../store';
import { OpenPgpService, SharedService, getCryptoRandom } from '../../../store/services';
import { PasswordValidation } from '../../../users/users-create-account/users-create-account.component';
import { apiUrl, SYNC_DATA_WITH_STORE, NOT_FIRST_LOGIN } from '../../../shared/config';

@UntilDestroy()
@Component({
  selector: 'app-settings-security',
  templateUrl: './security.component.html',
  styleUrls: ['./../mail-settings.component.scss', './security.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityComponent implements OnInit {
  @ViewChild('changePasswordModal') changePasswordModal: any;

  @ViewChild('auth2FAModal') auth2FAModal: any;

  @ViewChild('decryptContactsModal') decryptContactsModal: any;

  @ViewChild('confirmEncryptContactsModal') confirmEncryptContactsModal: any;

  private changePasswordModalRef: NgbModalRef;

  private decryptContactsModalRef: NgbModalRef;

  settings: Settings;

  changePasswordForm: FormGroup;

  showChangePasswordFormErrors = false;

  userState: UserState;

  inProgress: boolean;

  deleteData: boolean;

  apiUrl = apiUrl;

  auth2FA: Auth2FA;

  auth2FAForm: any = {};

  isDecryptingContacts: boolean;

  contactsState: ContactsState;

  isContactsEncrypted: boolean;

  planTypeEnum = PlanType;

  planType: PlanType;

  isUsingLocalStorage: boolean;

  private updatedPrivateKeys: any;

  passwordChangeInProgress = false;

  constructor(
    private store: Store<AppState>,
    private settingsService: MailSettingsService,
    private modalService: NgbModal,
    private openPgpService: OpenPgpService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    /**
     * Get user's settings
     */
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.userState = user;
        this.settings = user.settings;
        this.planType = user.settings.plan_type || PlanType.FREE;
        this.isContactsEncrypted = this.settings.is_contacts_encrypted;
      });

    /**
     * Change password using keys
     */
    this.store
      .select(state => state.auth)
      .pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        this.auth2FA = authState.auth2FA;
        if (this.passwordChangeInProgress && !authState.passwordChangeInProgress) {
          this.changePasswordModalRef.dismiss();
          if (authState.isChangePasswordError) {
            this.openPgpService.decryptAllPrivateKeys(undefined, this.changePasswordForm.value.password);
          } else {
            this.openPgpService.clearData();
          }
        }
        this.passwordChangeInProgress = authState.passwordChangeInProgress;
      });

    this.store
      .select(state => state.contacts)
      .pipe(untilDestroyed(this))
      .subscribe((contactsState: ContactsState) => {
        this.contactsState = contactsState;
      });

    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPwd: ['', [Validators.required]],
      },
      {
        validator: PasswordValidation.MatchPassword,
      },
    );

    this.isUsingLocalStorage = localStorage.getItem(SYNC_DATA_WITH_STORE) === 'true';
  }

  updateSettings(key?: string, value?: any) {
    this.settingsService.updateSettings(this.settings, key, value);
  }

  /**
   * Update anti phishing status
   */
  updateAntiPhishing(status: boolean) {
    if (this.settings.is_anti_phishing_enabled !== status) {
      this.settings.anti_phishing_phrase =
        getCryptoRandom().toString(36).slice(2, 5) + getCryptoRandom().toString(36).slice(2, 5);
      this.settingsService.updateSettings(this.settings, 'is_anti_phishing_enabled', status);
    }
  }

  get2FASecret() {
    this.store.dispatch(new Get2FASecret());
    this.modalService.open(this.auth2FAModal, {
      centered: true,
      windowClass: 'modal-md auth2fa-modal',
    });
  }

  update2FA(enable_2fa = true) {
    if (!this.auth2FAForm.passcode || !this.auth2FAForm.password) {
      this.auth2FAForm.submitted = true;
      return;
    }
    this.store.dispatch(
      new Update2FA({
        data: { ...this.auth2FAForm, enable_2fa, username: this.userState.username },
        settings: { ...this.settings, enable_2fa },
      }),
    );
  }

  disable2FA() {
    this.auth2FAForm = { auth2FAStep: 2, enable_2fa: false };
    this.modalService.open(this.auth2FAModal, {
      centered: true,
      windowClass: 'modal-md auth2fa-modal',
    });
  }

  copyToClipboard(value: string) {
    this.sharedService.copyToClipboard(value);
  }

  // == Open decrypt contacts confirmation NgbModal
  openDecryptContactsModal() {
    if (!this.settings.is_contacts_encrypted) {
      return;
    }
    this.isContactsEncrypted = false;
    this.decryptContactsModalRef = this.modalService.open(this.decryptContactsModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-md change-password-modal',
    });
    this.decryptContactsModalRef.result.then(reason => {
      this.isDecryptingContacts = false;
      this.decryptContactsModalRef = null;
    });
    setTimeout(() => {
      this.isContactsEncrypted = true;
    }, 100);
  }

  // == Open encrypt contacts confirmation NgbModal
  openConfirmEncryptContactsModal() {
    if (this.settings.is_contacts_encrypted) {
      return;
    }
    this.isContactsEncrypted = true;
    setTimeout(() => {
      this.isContactsEncrypted = false;
    }, 100);
    this.modalService.open(this.confirmEncryptContactsModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-md change-password-modal',
    });
  }

  confirmDecryptContacts() {
    this.updateSettings('is_contacts_encrypted', false);
    if (this.contactsState.totalContacts === 0 && this.contactsState.loaded) {
      this.decryptContactsModalRef.close();
      return;
    }
    this.isDecryptingContacts = true;
    this.store.dispatch(new ClearContactsToDecrypt({ clearCount: true }));
    this.store.dispatch(new ContactsGet({ limit: 20, offset: 0, isDecrypting: true }));
    this.decryptAllContacts();
  }

  decryptAllContacts() {
    if (this.contactsState.totalContacts === 0 && this.contactsState.loaded) {
      this.decryptContactsModalRef.close();
      return;
    }
    if (this.contactsState.contactsToDecrypt.length > 0) {
      this.openPgpService.decryptAllContacts();
      return;
    }
    setTimeout(() => {
      this.decryptAllContacts();
    }, 500);
  }

  closeDecryptContactsModal() {
    this.isDecryptingContacts = false;
    if (this.decryptContactsModalRef) {
      this.decryptContactsModalRef.close();
    }
  }

  /**
   * Change Password Section
   */
  /**
   * Open Change Password Modal
   */
  openChangePasswordModal() {
    this.deleteData = false;
    this.inProgress = false;
    this.showChangePasswordFormErrors = false;
    this.changePasswordForm.reset();
    this.changePasswordModalRef = this.modalService.open(this.changePasswordModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-md change-password-modal',
    });
  }

  /**
   * Change Password Process
   * Call OpenPGPService for change passphrase
   */
  changePassword() {
    this.showChangePasswordFormErrors = true;
    if (this.changePasswordForm.valid) {
      this.passwordChangeInProgress = true;
      this.openPgpService
        .changePassphrase(this.changePasswordForm.value.password, this.deleteData, this.userState.username)
        .subscribe(
          response => {
            this.changePasswordConfirmed(response.keys || {});
          },
          error => {
            this.passwordChangeInProgress = false;
            this.store.dispatch(new SnackErrorPush({ message: `Failed to change password` }));
          },
        );
    }
  }

  changePasswordConfirmed(updatedKeys: any) {
    this.updatedPrivateKeys = updatedKeys;
    const data = this.changePasswordForm.value;
    const new_keys: any[] = [];
    const extra_keys: any[] = [];
    Object.keys(updatedKeys).forEach((mailboxId: string) => {
      updatedKeys[mailboxId].forEach((key: any) => {
        if (key.is_primary) {
          new_keys.push({
            mailbox_id: mailboxId,
            private_key: key.private_key,
            public_key: key.public_key,
          });
        } else {
          extra_keys.push({
            mailbox_id: mailboxId,
            private_key: key.private_key,
            public_key: key.public_key,
            mailbox_key_id: key.mailbox_key_id,
          });
        }
      });
    });
    const requestData = {
      username: this.userState.username,
      old_password: data.oldPassword,
      password: data.password,
      confirm_password: data.confirmPwd,
      delete_data: this.deleteData,
      new_keys,
      extra_keys,
    };
    this.store.dispatch(new ChangePassword(requestData));
  }

  // == Toggle password visibility
  togglePassword(input: any): any {
    if (!input.value) {
      return;
    }
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  updateUsingLocalStorage(isUsing: boolean) {
    localStorage.setItem(SYNC_DATA_WITH_STORE, isUsing ? 'true' : 'false');
    localStorage.setItem(NOT_FIRST_LOGIN, 'true');
    this.store.dispatch(
      new SnackErrorPush({
        message: 'Settings updated successfully.',
      }),
    );
  }
}
