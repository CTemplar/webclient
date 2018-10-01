import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDropdownConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// Store
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';
import { Language, LANGUAGES } from '../../shared/config';

import {
  BlackListDelete,
  ChangePassword,
  CreateMailbox,
  SettingsUpdate,
  SnackErrorPush,
  SnackPush,
  WhiteListDelete
} from '../../store/actions';
import { MailboxSettingsUpdate } from '../../store/actions/mail.actions';
import {
  AppState,
  MailBoxesState,
  Payment,
  PaymentMethod,
  PaymentType,
  Settings,
  Timezone,
  TimezonesState,
  UserState
} from '../../store/datatypes';
import { Mailbox, UserMailbox } from '../../store/models';
import { OpenPgpService, UsersService } from '../../store/services';
import { PasswordValidation } from '../../users/users-create-account/users-create-account.component';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-settings',
  templateUrl: './mail-settings.component.html',
  styleUrls: ['./mail-settings.component.scss']
})
export class MailSettingsComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  readonly defaultStorage = 5; // storage in GB
  readonly defaultEmailAddress = 1;

  @ViewChild('changePasswordModal') changePasswordModal;

  selectedIndex = -1; // Assuming no element are selected initially
  userState: UserState;
  settings: Settings;
  payment: Payment;
  paymentType = PaymentType;
  paymentMethod = PaymentMethod;
  selectedMailboxForKey: UserMailbox;
  publicKey: any;
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
  mailBoxesState: MailBoxesState;
  currentMailBox: Mailbox;
  mailboxes: Mailbox[];
  newAddressForm: FormGroup;
  newAddressOptions: any = {};

  private changePasswordModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    config: NgbDropdownConfig,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private openPgpService: OpenPgpService,
    private usersService: UsersService
  ) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = true; // ~'outside';
  }

  ngOnInit() {
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
        if (this.userState.mailboxes.length > 0) {
          this.selectedMailboxForKey = this.userState.mailboxes[0];
        }
      });
    this.store.select(state => state.timezone).takeUntil(this.destroyed$)
      .subscribe((timezonesState: TimezonesState) => {
        this.timezones = timezonesState.timezones;
      });
    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailboxesState: MailBoxesState) => {
        if (this.mailBoxesState && this.mailBoxesState.inProgress && !mailboxesState.inProgress && this.newAddressOptions.isBusy) {
          this.onDiscardNewAddress();
        }
        this.mailBoxesState = mailboxesState;
        this.mailboxes = mailboxesState.mailboxes;
        if (this.mailboxes.length > 0) {
          this.currentMailBox = mailboxesState.currentMailbox;
          this.publicKey = 'data:application/octet-stream;charset=utf-8;base64,' + btoa(this.mailboxes[0].public_key);
        }
      });

    this.changePasswordForm = this.formBuilder.group({
        oldPassword: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPwd: ['', [Validators.required]]
      },
      {
        validator: PasswordValidation.MatchPassword
      });

    this.newAddressForm = this.formBuilder.group({
      'username': ['', [
        Validators.required,
        Validators.pattern(/^[a-z]+[a-z0-9._-]+$/i),
        Validators.minLength(4),
        Validators.maxLength(64)
      ]]
    });
    this.handleUsernameAvailability();
  }

  calculatePrices() {
    if (this.payment && this.payment.amount) {
      let price = +this.payment.amount;
      price = +(price / 100).toFixed(2);
      if (this.payment.payment_type === PaymentType.ANNUALLY) {
        this.annualDiscountedPrice = price;
      } else {
        this.annualTotalPrice = +(price * 12).toFixed(2);
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
      if (this.payment && this.payment.payment_type === PaymentType.ANNUALLY) {
        this.annualTotalPrice = +((8 + this.extraStorage + (this.extraEmailAddress / 3)) * 12).toFixed(2);
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

  // == Open add custom filter NgbModal
  addCustomFilterModalOpen(customFilterContent) {
    this.modalService.open(customFilterContent, {
      centered: true,
      windowClass: 'modal-sm'
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

  updateMailboxSettings(key?: string, value?: any) {
    if (key) {
      if (this.currentMailBox[key] !== value) {
        this.currentMailBox[key] = value;
        this.store.dispatch(new MailboxSettingsUpdate(this.currentMailBox));
      }
    }
  }

  changePassword() {
    this.showChangePasswordFormErrors = true;
    if (this.changePasswordForm.valid) {
      this.openPgpService.generateUserKeys(this.userState.username, this.changePasswordForm.value.password);
      if (this.openPgpService.getUserKeys()) {
        this.changePasswordConfirmed();
      } else {
        this.waitForPGPKeys('changePasswordConfirmed');
      }
    }
  }

  waitForPGPKeys(callback) {
    setTimeout(() => {
      if (this.openPgpService.getUserKeys()) {
        this[callback]();
        return;
      }
      this.waitForPGPKeys(callback);
    }, 500);
  }

  changePasswordConfirmed() {
    const data = this.changePasswordForm.value;
    const requestData = {
      username: this.userState.username,
      old_password: data.oldPassword,
      password: data.password,
      confirm_password: data.confirmPwd,
      ...this.openPgpService.getUserKeys(),
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
    this.store.dispatch(new SnackPush({message: 'Settings updated successfully.'}));
  }

  onAddNewAddress() {
    if (!this.newAddressOptions.isAddingNew) {
      this.newAddressForm.reset('username');
      this.newAddressOptions = {
        isAddingNew: true
      };
    }
  }

  onDiscardNewAddress() {
    this.newAddressForm.reset('username');
    this.newAddressOptions = {
      isAddingNew: false
    };
  }

  submitNewAddress() {
    this.newAddressOptions.isSubmitted = true;
    if (this.newAddressForm.valid && !this.newAddressOptions.usernameExists) {
      this.newAddressOptions.isBusy = true;
      this.openPgpService.generateUserKeys(this.userState.username, atob(this.usersService.getUserKey()));
      if (this.openPgpService.getUserKeys()) {
        this.addNewAddress();
      } else {
        this.waitForPGPKeys('addNewAddress');
      }
    }
  }

  addNewAddress() {
    const requestData = {
      email: this.newAddressForm.value.username, // backend appends domain in username to create `email`
      ...this.openPgpService.getUserKeys()
    };
    this.store.dispatch(new CreateMailbox(requestData));
  }

  handleUsernameAvailability() {
    this.newAddressForm.get('username').valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe((username) => {
        if (!this.newAddressForm.controls['username'].errors) {
          this.newAddressOptions.isBusy = true;
          this.usersService.checkUsernameAvailability(this.newAddressForm.controls['username'].value)
            .subscribe(response => {
                this.newAddressOptions.usernameExists = response.exists;
                this.newAddressOptions.isBusy = false;
              },
              error => {
                this.store.dispatch(new SnackErrorPush({ message: 'Failed to check username availability.' }));
                this.newAddressOptions.isBusy = false;
              });
        }
      });
  }

}
