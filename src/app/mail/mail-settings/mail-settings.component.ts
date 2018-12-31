import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDropdownConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// Store
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import {
  DEFAULT_CUSTOM_DOMAIN,
  DEFAULT_EMAIL_ADDRESS,
  DEFAULT_STORAGE,
  FONTS,
  Language,
  LANGUAGES,
  VALID_EMAIL_REGEX
} from '../../shared/config';

import { BlackListDelete, ChangePassword, DeleteAccount, SettingsUpdate, SnackPush, WhiteListDelete } from '../../store/actions';
import {
  AppState,
  AuthState,
  Payment,
  PaymentMethod,
  PaymentType,
  Settings,
  Timezone,
  TimezonesState,
  UserState
} from '../../store/datatypes';
import { OpenPgpService } from '../../store/services';
import { PasswordValidation } from '../../users/users-create-account/users-create-account.component';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-settings',
  templateUrl: './mail-settings.component.html',
  styleUrls: ['./mail-settings.component.scss']
})
export class MailSettingsComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  readonly defaultStorage = DEFAULT_STORAGE;
  readonly defaultEmailAddress = DEFAULT_EMAIL_ADDRESS;
  readonly defaultCustomDomain = DEFAULT_CUSTOM_DOMAIN;
  readonly fonts = FONTS;

  @ViewChild('changePasswordModal') changePasswordModal;
  @ViewChild('deleteAccountInfoModal') deleteAccountInfoModal;
  @ViewChild('confirmDeleteAccountModal') confirmDeleteAccountModal;

  selectedIndex = -1; // Assuming no element are selected initially
  userState: UserState;
  authState: AuthState;
  settings: Settings;
  payment: Payment;
  paymentType = PaymentType;
  paymentMethod = PaymentMethod;
  newListContact = { show: false, type: 'Whitelist' };
  selectedLanguage: Language;
  languages: Language[] = LANGUAGES;
  timezones: Timezone[];
  changePasswordForm: FormGroup;
  showChangePasswordFormErrors = false;
  annualTotalPrice: number;
  annualDiscountedPrice: number;
  extraStorage: number = 0; // storage extra than the default 5GB
  extraEmailAddress: number = 0; // email aliases extra than the default 1 alias
  extraCustomDomain: number = 0;
  deleteAccountInfoForm: FormGroup;
  deleteAccountOptions: any = {};

  private changePasswordModalRef: NgbModalRef;
  private deleteAccountInfoModalRef: NgbModalRef;
  private confirmDeleteAccountModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    config: NgbDropdownConfig,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private openPgpService: OpenPgpService,
  ) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = true; // ~'outside';
  }

  ngOnInit() {
    this.store.select(state => state.auth).takeUntil(this.destroyed$)
      .subscribe((authState: AuthState) => {
        this.authState = authState;
      });
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.userState = user;
        this.settings = user.settings;
        this.payment = user.payment_transaction;
        this.calculatePrices();
        this.calculateExtraStorageAndEmailAddresses();
        if (user.settings.language) {
          this.selectedLanguage = this.languages.filter(item => item.name === user.settings.language)[0];
        }
      });
    this.store.select(state => state.timezone).takeUntil(this.destroyed$)
      .subscribe((timezonesState: TimezonesState) => {
        this.timezones = timezonesState.timezones;
      });

    this.changePasswordForm = this.formBuilder.group({
        oldPassword: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPwd: ['', [Validators.required]]
      },
      {
        validator: PasswordValidation.MatchPassword
      });

    this.deleteAccountInfoForm = this.formBuilder.group({
      'contact_email': ['', [Validators.pattern(VALID_EMAIL_REGEX)]],
      'password': ['', [Validators.required]]
    });
  }

  calculatePrices() {
    if (this.payment && this.payment.amount) {
      let price = +this.payment.amount;
      if (this.payment.payment_method === PaymentMethod.BITCOIN.toLowerCase()) {
        price = +(price / 100000000).toFixed(5);
      } else {
        price = +(price / 100).toFixed(2);
      }
      if (this.payment.payment_method !== PaymentMethod.BITCOIN.toLowerCase()) {
        // prices are calculated in `calculateExtraStorageAndEmailAddresses` method when payment method is Bitcoin
        if (this.payment.payment_type === PaymentType.ANNUALLY) {
          this.annualDiscountedPrice = price;
        } else {
          this.annualTotalPrice = +(price * 12).toFixed(2);
        }
      }
    } else {
      this.annualTotalPrice = 96;
    }
  }

  calculateExtraStorageAndEmailAddresses() {
    if (this.settings) {
      if (this.settings.allocated_storage) {
        const storageInGB = +(this.settings.allocated_storage / 1048576).toFixed(0);
        this.extraStorage = storageInGB - this.defaultStorage;
      }
      if (this.settings.email_count) {
        this.extraEmailAddress = this.settings.email_count - this.defaultEmailAddress;
      }
      if (this.settings.domain_count) {
        this.extraCustomDomain = this.settings.domain_count - this.defaultCustomDomain;
      }
      if (this.payment) {
        if (this.payment.payment_type === PaymentType.ANNUALLY) {
          this.annualTotalPrice = +((8 + this.extraStorage + (this.extraEmailAddress / 10) + this.extraCustomDomain) * 12).toFixed(2);
        } else if (this.payment.payment_method === PaymentMethod.BITCOIN.toLowerCase()) {
          this.annualTotalPrice = +((8 + this.extraStorage + (this.extraEmailAddress / 10) + this.extraCustomDomain) * 12).toFixed(2);
          this.annualDiscountedPrice = +(this.annualTotalPrice * 0.75).toFixed(2);
        }
      }
    }
  }

  // == Toggle active state of the slide in price page
  toggleSlides(index) {
    this.selectedIndex = index;
    document.querySelector('.package-xs-tab > li').classList.remove('active');
    document
      .querySelector('.package-prime-col')
      .classList.remove('active-slide');
  }

  // == Methods related to ngbModal

  // == Open change password NgbModal
  openChangePasswordModal() {
    this.showChangePasswordFormErrors = false;
    this.changePasswordForm.reset();
    this.changePasswordModalRef = this.modalService.open(this.changePasswordModal, {
      centered: true,
      windowClass: 'modal-md'
    });
  }

  // == Open billing information NgbModal
  billingInfoModalOpen(billingInfoContent) {
    this.modalService.open(billingInfoContent, {
      centered: true,
      windowClass: 'modal-lg'
    });
  }

  // == Open add new payment NgbModal
  newPaymentMethodModalOpen(newPaymentMethodContent) {
    this.modalService.open(newPaymentMethodContent, {
      centered: true,
      windowClass: 'modal-sm'
    });
  }

  // == Open make a donation NgbModal
  makeDonationModalOpen(makeDonationContent) {
    this.modalService.open(makeDonationContent, {
      centered: true,
      windowClass: 'modal-sm'
    });
  }

  public deleteWhiteList(id) {
    this.store.dispatch(new WhiteListDelete(id));
  }

  public deleteBlackList(id) {
    this.store.dispatch(new BlackListDelete(id));
  }

  updateLanguage(language: Language) {
    this.settings.language = language.name;
    this.updateSettings();
  }

  updateSettings(key?: string, value?: any) {
    if (key) {
      if (this.settings[key] !== value) {
        this.settings[key] = value;
        this.store.dispatch(new SettingsUpdate(this.settings));
      }
    } else {
      this.store.dispatch(new SettingsUpdate(this.settings));
    }
  }

  changePassword() {
    this.showChangePasswordFormErrors = true;
    if (this.changePasswordForm.valid) {
      this.openPgpService.generateUserKeys(this.userState.username, this.changePasswordForm.value.password);
      if (this.openPgpService.getUserKeys()) {
        this.changePasswordConfirmed();
      } else {
        this.openPgpService.waitForPGPKeys(this, 'changePasswordConfirmed');
      }
    }
  }

  changePasswordConfirmed() {
    const data = this.changePasswordForm.value;
    const requestData = {
      username: this.userState.username,
      old_password: data.oldPassword,
      password: data.password,
      confirm_password: data.confirmPwd,
      ...this.openPgpService.getUserKeys()
    };
    this.store.dispatch(new ChangePassword(requestData));
    this.changePasswordModalRef.dismiss();
  }

  // == Toggle password visibility
  togglePassword(input: any): any {
    if (!input.value) {
      return;
    }
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  ngOnDestroy(): void {
  }

  onUpdateSettingsBtnClick() {
    this.store.dispatch(new SnackPush({ message: 'Settings updated successfully.' }));
  }

  onDeleteAccount() {
    this.deleteAccountOptions = {};
    this.deleteAccountInfoForm.reset();
    this.deleteAccountInfoModalRef = this.modalService.open(this.deleteAccountInfoModal, {
      centered: true,
      windowClass: 'modal-sm'
    });
  }

  onDeleteAccountInfoSubmit() {
    this.deleteAccountOptions.showErrors = true;
    if (this.deleteAccountInfoForm.valid) {
      this.deleteAccountInfoModalRef.dismiss();
      this.confirmDeleteAccountModalRef = this.modalService.open(this.confirmDeleteAccountModal, {
        centered: true,
        windowClass: 'modal-sm'
      });
    }
  }

  confirmDeleteAccount() {
    const data = {
      ...this.deleteAccountInfoForm.value,
      username: this.userState.username
    };
    this.store.dispatch(new DeleteAccount(data));
    this.confirmDeleteAccountModalRef.dismiss();
  }
}
