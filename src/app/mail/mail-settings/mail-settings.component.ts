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
  AuthState, Invoice,
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
import * as moment from 'moment-timezone';
import { ActivatedRoute, Router } from '@angular/router';

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
  selectedTabQueryParams: string;
  invoices: Invoice[];

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
    private cdr: ChangeDetectorRef,
    private router: Router
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
        this.invoices = user.invoices;
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
        this.selectedTabQueryParams = params['id'];
        this.navigateToTab(this.selectedTabQueryParams);
      }
    );
  }

  ngAfterViewInit() {
    this.tabSet.select(this.selectedTabQueryParams);
    this.cdr.detectChanges();
  }

  navigateToTab(tabSelected?) {
    if (this.selectedTabQueryParams === tabSelected) {
      return;
    }
    this.selectedTabQueryParams = tabSelected;
    window.history.replaceState({}, '', `/mail/settings/` + this.selectedTabQueryParams);
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

  // == Toggle password visibility
  togglePassword(input: any): any {
    if (!input.value) {
      return;
    }
    input.type = input.type === 'password' ? 'text' : 'password';
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

  scrollTo(x: number, y: number, wait: number = 500) {
    setTimeout(() => {
      window.scrollTo({ top: y, left: x, behavior: 'smooth' });
    }, wait);
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

  onViewInvoice(invoice: Invoice) {
    this.viewInvoice(invoice);
  }

  onPrintInvoice(invoice: Invoice) {
    this.viewInvoice(invoice, true);
  }

  viewInvoice(invoice: Invoice, print: boolean = false) {
    let popupWin;

    const data: any = {
      invoice: 1233423, invoice_date: new Date().toDateString(), status: 'PAID',
      total: 28, membership: 'Yearly',
      transactions: [
        { date: '12-02-2019', type: 'Credit', description: 'Credit added to account', quantity: 1, amount: 18 },
        { date: '12-02-2019', type: 'Bitcoin', description: 'Bitcoin payment', quantity: 1, amount: 10 }
      ]
    };

    let invoiceItems: string = '';
    invoice.items.forEach(item => {
      invoiceItems += `
                   <tr>
                    <td>${moment(invoice.invoice_date).format('DD/MM/YYYY')}</td>
                    <td>${invoice.payment_method ? invoice.payment_method : ''}</td>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td><b>$${(item.amount / 100).toFixed(2)}</b></td>
                </tr>
      `;
    });

    let invoiceData = `
<html>
<head>
    <title>Invoice : ${invoice.invoice_id}</title>
    <style>
        body {
            font-family: "Roboto", Helvetica, Arial, sans-serif;
        }

        div.divFooter {
            position: fixed;
            bottom: 75px;
            width: 100%;
            text-align: center;
            display: none;
        }

        @media print {
           div.divFooter {
             display: unset;
           }
        }

        .container {
            padding: 15px;
            margin: auto;
            color: #757675;
            border: 1px solid #757675;
            width: 21cm;
            min-height: 29.7cm;
        }

        .row {
            padding-left: -15px;
            padding-right: -15px;
            display: flex;
            flex-wrap: wrap;
        }

        .col-4 {
            flex: 0 0 33.3333333333%;
            max-width: 33.3333333333%;
        }

        .col-8 {
            flex: 0 0 66.6666666667%;
            max-width: 66.6666666667%;
        }

        .text-center {
            text-align: center;
        }

        .color-primary {
            color: #2f4254;
        }

        .page-title {
            font-weight: 300;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        th,
        td {
            text-align: left;
            padding: 20px;
        }

        th {
            text-transform: uppercase;
            color: rgba(0, 0, 0, 0.54);
            font-weight: normal;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
    </style>
</head>`;
    if (print) {
      invoiceData += `<body onload="window.print();window.close()">`;
    } else {
      invoiceData += `<body>`;
    }
    invoiceData += `
    <div class="container">
        <div class="row" style="margin-top: 1rem;">
            <div class="col-8">
                <img src="https://dev.ctemplar.com/assets/images/media-kit/mediakit-logo-sec.png"
                    style="height: 9rem;margin-left: 2rem;">
            </div>
            <div class="col-4 color-primary">
                <div style="text-align: right;padding-right: 35px; line-height: 1.5;">
                    <div><b>Invoice # </b>${invoice.invoice_id}</div>
                    <div><b>Invoice date : </b>${moment(invoice.invoice_date).format('DD/MM/YYYY')}</div>
                    <div style="margin-top:20px;"><b>Membership : </b>${invoice.payment_type}</div>
                    <br>
                    <div style="margin-top: 10px; font-size: 20px;"><b>Status : <label style="color: green;">PAID<label></label></b>
                    </div>
                </div>
            </div>
        </div>
        <div style="margin-top: 7rem;">
            <table>
                <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>QTY</th>
                    <th>Amount (USD)</th>
                </tr>
                ${invoiceItems}
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>TOTAL</td>
                    <td><b> $${(invoice.total_amount / 100).toFixed(2)}</b></td>
                </tr>
            </table>

        </div>
         <div style="margin-top:5rem">
            <div><b class="color-primary" style="padding-right: 81px;">Storage </b>${invoice.storage / (1024 * 1024)}GB</div>
            <div><b class="color-primary" style="padding-right: 18px;">Email addresses</b>${invoice.email_addresses}</div>
            <div><b class="color-primary" style="padding-right: 76px;">Domains</b>${invoice.custom_domains}</div>
        </div>
    </div>
    <div class="color-primary divFooter">
        <div><b>Orange Project ehf | Armula 4 &amp; 6 | Reykjavík, 108 | Iceland</b></div>
    </div>
</body>

</html>
         `;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(invoiceData);
    popupWin.document.close();
  }


}
