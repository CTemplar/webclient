import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDropdownConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// Store
import { Store } from '@ngrx/store';
import {
  DEFAULT_CUSTOM_DOMAIN,
  DEFAULT_EMAIL_ADDRESS,
  DEFAULT_STORAGE,
  FONTS,
  Language,
  LANGUAGES,
  VALID_EMAIL_REGEX
} from '../../shared/config';

import { BlackListDelete, DeleteAccount, SnackPush, WhiteListDelete } from '../../store/actions';
import {
  AppState,
  AuthState,
  NotificationPermission,
  Payment,
  PaymentMethod,
  PaymentType,
  PlanType,
  Settings,
  Timezone,
  TimezonesState,
  UserState
} from '../../store/datatypes';
import { OpenPgpService } from '../../store/services';
import { MailSettingsService } from '../../store/services/mail-settings.service';
import { PushNotificationService, PushNotificationOptions } from '../../shared/services/push-notification.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mail-settings',
  templateUrl: './mail-settings.component.html',
  styleUrls: ['./mail-settings.component.scss']
})
export class MailSettingsComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly defaultStorage = DEFAULT_STORAGE;
  readonly defaultEmailAddress = DEFAULT_EMAIL_ADDRESS;
  readonly defaultCustomDomain = DEFAULT_CUSTOM_DOMAIN;
  readonly fonts = FONTS;
  readonly championMonthlyPrice = 50;
  readonly championAnnualPriceTotal = 450;
  readonly planType = PlanType;
  @ViewChild('tabSet', { static: false }) tabSet;
  @ViewChild('deleteAccountInfoModal', { static: false }) deleteAccountInfoModal;
  @ViewChild('confirmDeleteAccountModal', { static: false }) confirmDeleteAccountModal;

  selectedIndex = -1; // Assuming no element are selected initially
  userState: UserState;
  authState: AuthState;
  settings: Settings;
  payment: Payment;
  paymentType = PaymentType;
  paymentMethod = PaymentMethod;
  userPlanType: PlanType = PlanType.FREE;
  newListContact = { show: false, type: 'Whitelist' };
  selectedLanguage: Language;
  languages: Language[] = LANGUAGES;
  timezones: Timezone[];
  annualTotalPrice: number;
  annualDiscountedPrice: number;
  extraStorage: number = 0; // storage extra than the default 5GB
  extraEmailAddress: number = 0; // email aliases extra than the default 1 alias
  extraCustomDomain: number = 0;
  deleteAccountInfoForm: FormGroup;
  deleteAccountOptions: any = {};
  notificationsPermission: string;
  notificationPermissionType = NotificationPermission;
  forwardingQueryParams: any;

  private deleteAccountInfoModalRef: NgbModalRef;
  private confirmDeleteAccountModalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    config: NgbDropdownConfig,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private openPgpService: OpenPgpService,
    private settingsService: MailSettingsService,
    private pushNotificationService: PushNotificationService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = true; // ~'outside';
  }

  ngOnInit() {
    this.notificationsPermission = Notification.permission;

    this.store.select(state => state.auth).pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        this.authState = authState;
      });
    this.store.select(state => state.user).pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.userState = user;
        this.settings = user.settings;
        this.payment = user.payment_transaction;
        this.calculatePrices();
        this.calculateExtraStorageAndEmailAddresses();
        if (user.settings.plan_type) {
          this.userPlanType = user.settings.plan_type;
        } else if (user.isPrime) {
          this.userPlanType = PlanType.PRIME;
        } else {
          this.userPlanType = PlanType.FREE;
        }
        if (user.settings.language) {
          this.selectedLanguage = this.languages.filter(item => item.name === user.settings.language)[0];
        }
      });
    this.store.select(state => state.timezone).pipe(untilDestroyed(this))
      .subscribe((timezonesState: TimezonesState) => {
        this.timezones = timezonesState.timezones;
      });

    this.deleteAccountInfoForm = this.formBuilder.group({
      'contact_email': ['', [Validators.pattern(VALID_EMAIL_REGEX)]],
      'password': ['', [Validators.required]]
    });
    this.route.params.subscribe(
      params => {
        this.forwardingQueryParams = params['id'];
      }
    );
  }

  ngAfterViewInit() {
    if (this.forwardingQueryParams === 'auto') {
      this.tabSet.select('forwardingAndAuto');
      this.cdr.detectChanges();
    }
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
        this.extraStorage = this.defaultStorage < storageInGB ? storageInGB - this.defaultStorage : 0;
      }
      if (this.settings.email_count) {
        this.extraEmailAddress = this.defaultEmailAddress < this.settings.email_count
          ? this.settings.email_count - this.defaultEmailAddress : 0;
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
    this.settingsService.updateSettings(this.settings, key, value);
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

  requestNotificationPermission() {
    this.pushNotificationService.requestPermission();
  }

  scrollTo(x: number, y: number) {
    setTimeout(() => {
      window.scroll(x, y);
    }, 500);
  }

  testNotification() {
    const options = new PushNotificationOptions();
    options.body = 'You have received a new email';
    options.icon = 'https://ctemplar.com/assets/images/media-kit/mediakit-logo4.png';

    this.pushNotificationService.create('Test Notification', options).subscribe((notif) => {
        if (notif.event.type === 'click') {
          notif.notification.close();
        }
      },
      (err) => {
        console.log(err);
      });
  }
}
