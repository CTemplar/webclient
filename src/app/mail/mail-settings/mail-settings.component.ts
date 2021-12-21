import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDropdownConfig, NgbModal, NgbModalRef, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment-timezone';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as Sentry from '@sentry/browser';

import {
  MoveToBlacklist,
  MoveToWhitelist,
  BlackListDelete,
  DeleteAccount,
  SnackPush,
  WhiteListDelete,
  CardDelete,
  CardMakePrimary,
  MoveTab,
  ClearMailsOnConversationModeChange,
  GetUnreadMailsCount,
} from '../../store/actions';
import { CreditCardNumberPipe } from '../../shared/pipes/creditcard-number.pipe';
import {
  AppState,
  AuthState,
  Invoice,
  MailState,
  NotificationPermission,
  Payment,
  PaymentMethod,
  PlanType,
  PricingPlan,
  Settings,
  Timezone,
  TimezonesState,
  UserState,
  CardState,
} from '../../store/datatypes';
import { OpenPgpService, SharedService } from '../../store/services';
import { MailSettingsService } from '../../store/services/mail-settings.service';
import { PushNotificationOptions, PushNotificationService } from '../../shared/services/push-notification.service';
import {
  CUSTOM_THEMES,
  SENTRY_DSN,
  FONTS,
  Language,
  LANGUAGES,
  VALID_EMAIL_REGEX,
  AUTOSAVE_DURATION,
  COMPOSE_COLORS,
  SIZES,
  BACKGROUNDS,
  DEFAULT_FONT_SIZE,
} from '../../shared/config';
import { UserSelectManageService } from '../../shared/services/user-select-manage.service';

@UntilDestroy()
@Component({
  selector: 'app-mail-settings',
  templateUrl: './mail-settings.component.html',
  styleUrls: ['./mail-settings.component.scss'],
})
export class MailSettingsComponent implements OnInit, AfterViewInit {
  readonly themes = CUSTOM_THEMES;

  readonly fonts = FONTS;

  readonly colors = COMPOSE_COLORS;

  readonly sizes = SIZES;

  readonly defaultFontSize = DEFAULT_FONT_SIZE;

  readonly backgrounds = BACKGROUNDS;

  readonly autosaveDurations = AUTOSAVE_DURATION;

  readonly planType = PlanType;

  @ViewChild('navSet') navSet: any;

  @ViewChild('deleteAccountInfoModal') deleteAccountInfoModal: any;

  @ViewChild('confirmDeleteAccountModal') confirmDeleteAccountModal: any;

  @ViewChild('billingInfoModal') billingInfoModal: any;

  @ViewChild('settingsContent') settingsContent: any;

  selectedIndex = -1; // Assuming no element are selected initially

  userState: UserState = new UserState();

  mailState: MailState;

  authState: AuthState;

  settings: Settings = new Settings();

  cards: Array<CardState> = [];

  payment: Payment = new Payment();

  paymentMethod = PaymentMethod;

  userPlanType: PlanType = PlanType.FREE;

  newListContact = { show: false, type: 'Whitelist' };

  selectedLanguage: Language;

  languages: Language[] = LANGUAGES;

  timezones: Timezone[];

  searchWhitelistInput = new FormControl();

  searchBlacklistInput = new FormControl();

  searchWhitelistPlaceholder = 'settings.whitelist.search_whitelist';

  searchBlacklistPlaceholder = 'settings.blacklist.search_blacklist';

  deleteAccountInfoForm: FormGroup;

  deleteAccountOptions: any = {};

  notificationsPermission: string;

  notificationEmail: string;

  autosave_duration: any = {};

  WhitelistItems: any = [];

  BlacklistItems: any = [];

  autosave_duration_list: Array<string>;

  notificationPermissionType = NotificationPermission;

  selectedTabQueryParams = 'dashboard-and-plans';

  invoices: Invoice[];

  isLifeTimePrime = false;

  currentPlan: PricingPlan;

  isAddNewCard = false;

  isCardUpdateMode = false;

  private deleteAccountInfoModalRef: NgbModalRef;

  private confirmDeleteAccountModalRef: NgbModalRef;

  timeZoneFilter = new FormControl('', []);

  timeZoneFilteredOptions: Observable<Timezone[] | void>;

  isEditingRecoveryEmail: boolean;

  selectedThemeName = 'default';

  constructor(
    private modalService: NgbModal,
    config: NgbDropdownConfig,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private settingsService: MailSettingsService,
    private pushNotificationService: PushNotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private userSelectManageService: UserSelectManageService,
  ) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = true;
  }

  ngOnInit() {
    this.initAutoSaving(); // Convert milliseconds to time format(m:s)
    if ('Notification' in window) {
      this.notificationsPermission = Notification.permission;
    }
    this.sharedService.loadPricingPlans();

    this.store
      .select(state => state.auth)
      .pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        this.authState = authState;
      });

    /**
     * Get user's state and initialize
     */
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.userState = user;
        this.WhitelistItems = user.whiteList;
        this.BlacklistItems = user.blackList;
        this.settings = user.settings;
        this.notificationEmail = user.settings.notification_email;
        this.timeZoneFilter.setValue(user.settings.timezone);
        this.cdr.detectChanges();
        this.payment = user.payment_transaction;
        this.cards = user.cards;
        this.isLifeTimePrime = user.isLifeTimePrime;
        this.invoices = user.invoices;
        this.userPlanType = user.settings.plan_type || PlanType.FREE;
        if (SharedService.PRICING_PLANS && user.settings.plan_type) {
          this.currentPlan = SharedService.PRICING_PLANS[this.userPlanType];
        }
        if (user.settings.language) {
          this.selectedLanguage = this.languages.find(item => item.name === user.settings.language);
        }
        if (user.settings.autosave_duration !== 'none' && user.settings.autosave_duration) {
          const duration = Number(user.settings.autosave_duration);
          // convert duration to m:s format (1m = 60000ms, 1s = 1000ms)
          const newDuration = duration >= 60_000 ? `${duration / 60_000}m` : `${duration / 1000}s`;
          this.autosave_duration = newDuration;
        } else {
          this.autosave_duration = 'none';
        }
        // Custom Theme
        this.selectedThemeName = CUSTOM_THEMES.find(t => t.value === this.settings.theme)?.name ?? '';
      });

    this.store
      .select(state => state.timezone)
      .pipe(untilDestroyed(this))
      .subscribe((timezonesState: TimezonesState) => {
        this.timezones = timezonesState.timezones;
      });

    this.deleteAccountInfoForm = this.formBuilder.group({
      contact_email: ['', [Validators.pattern(VALID_EMAIL_REGEX)]],
      password: ['', [Validators.required]],
    });
    this.route.params.subscribe(parameters => {
      if (parameters.id !== 'undefined') {
        this.store.dispatch(new MoveTab(parameters.id));
      }
      this.userSelectManageService.updateUserSelectPossiblilityState(true);
    });

    this.timeZoneFilteredOptions = this.timeZoneFilter.valueChanges.pipe(
      startWith(''),
      map(name => (name ? this.filterTimeZone(name) : [...this.timezones])),
    );

    /**
     * Save current settings tab
     */
    this.store
      .select(state => state.mail)
      .pipe(untilDestroyed(this))
      .subscribe((mailState: MailState) => {
        if (mailState.currentSettingsTab) {
          if (this.selectedTabQueryParams === mailState.currentSettingsTab) {
            return;
          }
          this.selectedTabQueryParams = mailState.currentSettingsTab;
          this.changeUrlParams();
          this.navSet.select(this.selectedTabQueryParams);
          this.cdr.detectChanges();
        }
      });
  }

  private filterTimeZone(name: string) {
    return this.timezones.filter(option => option.value.toLowerCase().includes(name.toLowerCase()));
  }

  toggleRecoveyEmailEdit() {
    this.isEditingRecoveryEmail = !this.isEditingRecoveryEmail;
  }

  /**
   * Convert milliseconds to time format(m:s)
   */
  initAutoSaving() {
    const autosaveDurations: string[] = [];
    for (const duration of this.autosaveDurations) {
      if (duration !== 'none' && duration) {
        const perduration = Number(duration);
        const newDuration = perduration >= 60_000 ? `${perduration / 60_000}m` : `${perduration / 1000}s`;
        autosaveDurations.push(newDuration);
      } else {
        autosaveDurations.push('none');
      }
    }
    this.autosave_duration_list = autosaveDurations;
  }

  ngAfterViewInit() {
    this.navSet.select(this.selectedTabQueryParams);
    this.cdr.detectChanges();
  }

  navigateToTab(navId: NgbNavChangeEvent) {
    if (navId.activeId === navId.nextId) return;
    this.store.dispatch(new MoveTab(navId.nextId));
    this.scrollTop(this.settingsContent.nativeElement);
  }

  changeUrlParams() {
    this.router.navigateByUrl(`/mail/settings/${this.selectedTabQueryParams}`);
  }

  onAddNewCard() {
    if (this.userState.inProgress) {
      return;
    }
    this.isAddNewCard = true;
    this.modalService.open(this.billingInfoModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-lg',
    });
  }

  onDeleteCard(card: CardState) {
    if (this.userState.inProgress) {
      return;
    }
    this.store.dispatch(new CardDelete(card.id));
  }

  onMakePrimaryCard(card: CardState) {
    if (this.userState.inProgress) {
      return;
    }
    this.store.dispatch(new CardMakePrimary(card.id));
  }

  billingInfoModalOpen(billingInfoContent: any) {
    this.isAddNewCard = false;
    this.modalService.open(billingInfoContent, {
      centered: true,
      windowClass: 'modal-lg',
    });
  }

  renew() {
    this.isAddNewCard = false;
    this.modalService.open(this.billingInfoModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-lg',
    });
  }

  searchWhitelist() {
    this.WhitelistItems = this.searchWhitelistInput.value
      ? this.userState.whiteList.filter(item => item.email.includes(this.searchWhitelistInput.value))
      : this.userState.whiteList;
  }

  searchBlacklist() {
    this.BlacklistItems = this.searchBlacklistInput.value
      ? this.userState.blackList.filter(item => item.email.includes(this.searchBlacklistInput.value))
      : this.userState.blackList;
  }

  moveToBlacklist(id: number, name: string, email: string) {
    this.store.dispatch(new MoveToBlacklist({ id, name, email }));
  }

  moveToWhitelist(id: number, name: string, email: string) {
    this.store.dispatch(new MoveToWhitelist({ id, name, email }));
  }

  public deleteWhiteList(id: number) {
    this.store.dispatch(new WhiteListDelete(id));
  }

  public deleteBlackList(id: number) {
    this.store.dispatch(new BlackListDelete(id));
  }

  updateLanguage(language: Language) {
    this.settings.language = language.name;
    this.updateSettings();
  }

  updateTimeZone(event: any) {
    this.updateSettings('timezone', event.value);
  }

  updateConversationMode(is_conversation_mode: boolean) {
    this.updateSettings('is_conversation_mode', is_conversation_mode);
    this.store.dispatch(new ClearMailsOnConversationModeChange());
    this.store.dispatch(new GetUnreadMailsCount());
  }

  updateShowPlainTextMode(is_showplaintext_mode: boolean) {
    this.updateSettings('show_plain_text', is_showplaintext_mode);
  }

  updateAutoReadMode(auto_read_mode: boolean) {
    this.updateSettings('auto_read', auto_read_mode);
  }

  /**
   * convert m:s format to milliseconds and update settings
   */
  updateSettings(key?: string, value?: any) {
    if (key === 'autosave_duration') {
      if (value.slice(-1) === 'm') {
        value = Number(value.slice(0, -1)) * 60_000;
      }
      if (value.slice(-1) === 's') {
        value = Number(value.slice(0, -1)) * 1000;
      }
    }
    if (key === 'is_enable_report_bugs') {
      Sentry.init({
        dsn: SENTRY_DSN,
        enabled: value,
      });
    }
    if (key === 'notification_email' && value !== '' && !this.validateEmail(value)) {
      this.store.dispatch(new SnackPush({ message: `"${value}" is not valid email address.` }));
      this.notificationEmail = this.userState.settings.notification_email;
    } else {
      this.settingsService.updateSettings(this.settings, key, value);
    }
  }

  validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  onUpdateSettingsBtnClick() {}

  onDeleteAccount() {
    this.deleteAccountOptions = {};
    this.deleteAccountInfoForm.reset();
    this.deleteAccountInfoModalRef = this.modalService.open(this.deleteAccountInfoModal, {
      centered: true,
      windowClass: 'modal-sm',
    });
  }

  onDeleteAccountInfoSubmit() {
    this.deleteAccountOptions.showErrors = true;
    if (this.deleteAccountInfoForm.valid) {
      this.deleteAccountInfoModalRef.dismiss();
      this.confirmDeleteAccountModalRef = this.modalService.open(this.confirmDeleteAccountModal, {
        centered: true,
        windowClass: 'modal-sm',
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
      username: this.userState.username,
    };
    this.store.dispatch(new DeleteAccount(data));
    this.confirmDeleteAccountModalRef.dismiss();
  }

  requestNotificationPermission() {
    this.pushNotificationService.requestPermission();
  }

  scrollTop(element: HTMLElement) {
    element.scroll(0, 0);
  }

  scroll(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }

  testNotification() {
    const options = new PushNotificationOptions();
    options.body = 'You have received a new email';
    options.icon = 'https://mail.ctemplar.com/assets/images/media-kit/mediakit-logo4.png';

    this.pushNotificationService.create('Test Notification', options).subscribe(
      (notif: any) => {
        if (notif.event.type === 'click') {
          notif.notification.close();
        }
        this.store.dispatch(
          new SnackPush({ message: "if you can't see notification, please change notification settings on browser" }),
        );
      },
      (error: any) => {
        this.store.dispatch(new SnackPush({ message: error }));
      },
    );
  }

  onViewInvoice(invoice: Invoice) {
    this.viewInvoice(invoice);
  }

  onPrintInvoice(invoice: Invoice) {
    this.viewInvoice(invoice, true);
  }

  viewInvoice(invoice: Invoice, print = false) {
    let invoiceItems = '';
    for (const item of invoice.items) {
      invoiceItems += `
        <tr>
          <td>${moment(invoice.invoice_date).format('DD/MM/YYYY')}</td>
          <td>${item.type || invoice.payment_method}</td>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td><b>$${(item.amount / 100).toFixed(2)}</b></td>
        </tr>
      `;
    }

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
    invoiceData += print ? `<body onload="window.print();window.close()">` : `<body>`;
    invoiceData += `
    <div class="container">
        <div class="row" style="margin-top: 1rem;">
            <div class="col-8">
                <img src="https://mail.ctemplar.com/assets/images/media-kit/mediakit-logo-sec.png"
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
            <div><b class="color-primary" style="padding-right: 81px;">Storage </b>${
              invoice.storage / (1024 * 1024 * 1024)
            }GB</div>
            <div><b class="color-primary" style="padding-right: 18px;">Email addresses</b>${
              invoice.email_addresses
            }</div>
            <div><b class="color-primary" style="padding-right: 76px;">Domains</b>${invoice.custom_domains}</div>
        </div>
    </div>
    <div class="color-primary divFooter">
        <div><b>Orange Project ehf | Armula 4 &amp; 6 | Reykjavík, 108 | Iceland</b></div>
    </div>
</body>
</html>`;

    const popupWin = window.open('', '_blank', 'top=0,left=0,height=auto,width=auto');
    popupWin.document.open();
    popupWin.document.write(invoiceData);
    popupWin.document.close();
  }

  copyToClipboard(value: string) {
    this.sharedService.copyToClipboard(value);
  }

  onSelectCustomTheme(theme: { name: string; value: string }) {
    if (theme.value === 'default') {
      this.settingsService.updateSettings({
        ...this.settings,
        theme: '',
      });
    } else {
      this.settingsService.updateSettings({
        ...this.settings,
        is_night_mode: true,
        theme: theme.value,
      });
    }
  }

  onSetDarkMode(isDarkMode: boolean) {
    if (!isDarkMode && this.settings.theme) {
      this.settingsService.updateSettings({
        ...this.settings,
        is_night_mode: isDarkMode,
        theme: '',
      });
    } else {
      this.updateSettings('is_night_mode', isDarkMode);
    }
  }

  // onAnchoredLink(fragment: string): void {
  // this.router.navigate([], { fragment }).then(() => {
  //   document.querySelector(`#${fragment}`).scrollIntoView();
  // });
  // }
  onAnchoredLink(id: string): void {
    const elmnt = document.getElementById(id);
    elmnt.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}
