// Angular
import { environment } from '../../environments/environment';

export const IS_ELECTRON = window.location.protocol === 'file:';
export const apiUrl = getBaseUrl();
export const PRIMARY_DOMAIN = environment.production ? 'ctemplar.com' : 'dev.ctemplar.com';
export const PRIMARY_WEBSITE = 'https://ctemplar.com';


export const COLORS: string[] = [
  '#000000', '#616161', '#828282', '#adadad',
  '#d2d2d2', '#e9e9e9', '#ffffff', '#730000',
  '#ae0000', '#e60000', '#ff2121', '#ff7676',
  '#ffc9c9', '#ffefef', '#734600', '#ae6200',
  '#e66300', '#ff8c21', '#ffc576', '#ffe9c9',
  '#ffe9c9', '#737200', '#a0ae00', '#e6e300',
  '#fff621', '#fdff76', '#fffdc9', '#ffffef',
  '#0f7300', '#0eae00', '#1ee600', '#21ff38',
  '#76ff76', '#c9ffd0', '#effff1', '#006e73',
  '#00aeac', '#00dce6', '#21f4ff', '#76fff4',
  '#c9fffc', '#effeff', '#000173', '#0016ae',
  '#0100e6', '#5555ff', '#7681ff', '#cdc9ff',
  '#f1efff', '#530073', '#7500ae', '#ba00e6',
  '#e955ff', '#de76ff', '#f2c9ff', '#fcefff',
];

export const FOLDER_COLORS: string[] = [
  '#ced4da', '#868e96', '#212529', '#da77f2', '#be4bdb', '#8e44ad', '#f783ac', '#e64980', '#a61e4d',
  '#748ffc', '#4c6ef5', '#364fc7', '#9775fa', '#7950f2', '#5f3dc4', '#ff8787', '#fa5252', '#c0392b',
  '#4dabf7', '#3498db', '#1864ab', '#2ecc71', '#27ae60', '#16a085', '#ffd43b', '#fab005', '#e67e22',
  '#3bc9db', '#15aabf', '#0b7285', '#a9e34b', '#82c91e', '#5c940d', '#f39c12', '#fd7e14', '#e74c3c',
];

export const LANGUAGES: Language[] = [
  { name: 'English', locale: 'en' },
  { name: 'Spanish', locale: 'es' },
  { name: 'Russian', locale: 'ru' },
  { name: 'Chinese', locale: 'zh' },
  { name: 'French', locale: 'fr' },
  { name: 'Ukrainian', locale: 'uk' },
  { name: 'Portuguese', locale: 'pt' },
];

export interface Language {
  name: string;
  locale: string;
}

export const ESCAPE_KEYCODE = 27;

export const VALID_EMAIL_REGEX: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const FONTS = ['lato', 'roboto', 'arial', 'times-new-roman'];

export const REFFERAL_CODE_KEY = 'referral_code';
export const PROMO_CODE_KEY = 'promo_code';
export const REFFERAL_ID_KEY = 'cjevent';

export const SummarySeparator = '-----------------------------------------------------------------------------------------------';

import * as QuillNamespace from 'quill';
const Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/imageResize', ImageResize);

export const QUILL_FORMATTING_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'color': COLORS }, { 'background': COLORS }],          // dropdown with defaults from theme
    [{ 'align': [] }],
    ['clean'],                                         // remove formatting button
    ['link', 'image']                         // link /not-allowed-in-simple-version(and image, video)
  ],
  imageResize: true
};

function getBaseUrl() {
  if (environment.production) {
    if (IS_ELECTRON) {
      return 'https://api.ctemplar.com/';
    }
    const config = getWindowConfig();
    if (config.host === 'gh.ctemplar.com') {
      return 'https://api.ctemplar.com/';
    } else if (config.host === 'dev1.ctemplar.net') {
      return 'https://devapi.ctemplar.net/';
    }
    if (config.host === 'mail.ctemplarpizuduxk3fkwrieizstx33kg5chlvrh37nz73pv5smsvl6ad.onion') {
      return '/api/';
    }
    return config.protocol + '//' + config.host.replace('mail.', 'api.') + '/';
  }
  return 'https://devapi.ctemplar.net/';
}

export function getWindowConfig(): { host: string, protocol: string } {
  let protocol = window.location.protocol;
  let host = location.host;
  if (IS_ELECTRON) {
    protocol = 'https:';
    host = environment.production ? 'mail.ctemplar.com' : 'dev.ctemplar.com';
  }
  return { host, protocol };
}

export const darkModeCss = 'body{background:#20273e!important;color:#fff!important}.mailbox-sidebar-inner .mailbox-sidebar-footer,aside#mailbox-sidebar{background:#151e34;border-right:2px solid #323a4c}nav.navbar.mailbox-navbar{background:#20273e;border:0;border-bottom:1px solid #323a4c}.mail-contact .mail-list-row,div.mail-list-row,div.mail-list-row.is-read,div.mail-list-row.is-selected,div.mail-list-row.is-unread,tr.mail-list-row,tr.mail-list-row.is-read,tr.mail-list-row.is-selected,tr.mail-list-row.is-unread{background:#20273e!important;color:#fff!important;border-bottom:1px solid #323a4c!important}.mail-contact-body.is-bordered,.mail-contact-header.mail-list-row{border:1px solid #323a4c!important}tr.mail-list-row.is-selected{background:#373c50!important}*,.mail-controls div.mail-result-text.text-muted>small,.mailbox-footer-menu a u,.plan-details .subscription,.pricing-plans .plan-item div,.setting-actions-list a i,.text-dark,.text-gray-dark,.text-secondary,::after,::before,a.dropdown-item,a.text-dark:focus,a.text-dark:hover,a.text-gray-dark:focus,a.text-gray-dark:hover,a.text-muted,a.text-muted:hover,ngb-datepicker div.ngb-dp-months div ngb-datepicker-month-view div.ngb-dp-week .ngb-dp-weekday{color:#fff!important}.mail-list-row.is-unread .mail-from-name,.mail-list-row.is-unread .mail-subject{font-size:15px}.mailbox-actionbar{border-bottom:1px solid #323a4c!important}.mail-checkbox .mat-checkbox .mat-checkbox-frame,.mat-checkbox-checked.mat-accent .mat-checkbox-background,.mat-checkbox-indeterminate.mat-accent .mat-checkbox-background,.select-all-checkbox .mat-checkbox .mat-checkbox-frame{border:2px solid #fff!important}.input-group-addon,.search-form div.form-group{border:1px solid #474e61!important}.search-form .search-btn{background:#182034;border:0}.bitcoin-payment.card,.bitcoin-payment.card .card-header,.domain-body .domains-list .row .actions .action:hover,.domains-list,.download-attachment-wrapper .download-attachment,.dropdown-menu,.form-control,.help-icon .icon-button,.info-card,.info-list-item,.mail-compose-field,.mailbox-actionbar .mailbox-actionbar-menu>li>a,.mailbox-actionbar-menu>li .dropdown-toggle,.mailbox-dropdown .dropdown-menu,.mailbox-dropdown .dropdown-menu a.dropdown-item:active,.mailbox-dropdown .dropdown-menu a.dropdown-item:focus,.mailbox-dropdown .dropdown-menu a.dropdown-item:hover,.mat-stepper-horizontal,.mat-stepper-vertical,.modal-body,.modal-footer,.modal-header,.nav-tabs.nav .nav-link,.nav-tabs.nav li,.nav.nav-tabs,.plan-details .desc-card-body,.pricing-plans .plan-item,.pricing-plans .plan-sub-item,.stepper-form,.timezone-option,.ui-list-item,app-mail-header .mailbox-actions-menu>li a,app-mail-settings .timezone-block .mat-form-field-appearance-legacy .mat-form-field-infix,app-organization-users .actions,app-organization-users .actions:hover,button.actions-btn,button.btn.btn-default.btn-sm,button.btn.btn-user-action,button.dropdown-toggle,div.mailbox-actionbar div.mail-nav-control button,input,input::placeholder,textarea,textarea::placeholder{background:#363d51!important;border:solid 1px #474e61!important;color:#fff!important}.help-icon .icon-button:hover,.input-group-addon,.mailbox-actionbar .mailbox-actionbar-menu>li>a:hover,app-generic-folder div.mailbox-actionbar div.mail-nav-control button:hover,app-mail-header .mailbox-actions-menu>li a:hover{border:solid 1px #394061!important}.mailbox-dropdown .dropdown-menu a.dropdown-item,.ui-header.border-all-corner{border:solid 1px #363d51!important}input,input::placeholder,textarea,textarea::placeholder{border:0!important}.nav-tabs.nav .nav-link.active,.nav-tabs.nav .nav-link:hover,.nav-tabs.nav li:hover,.nav.nav-tabs:hover{background:#182034!important}.progress-secondary .progress-bar{background-color:#c0392b!important}.bg-faded,.bg-light,.bg-white,.mailbox-footer{background:#363d51!important}.pricing-plans .plan-item .select-btn{box-shadow:5px 10px 10px #151e35!important}.mail-compose-field button{border:0!important}.loading,app-compose-mail .mail-compose-box-inner,app-compose-mail .mail-compose-editable-box,app-compose-mail .mail-composer-footer,app-compose-mail .ng2-menu-item,app-compose-mail tag,ul.mail-composer-actions li div div div ul li button.ql-font,ul.mail-composer-actions li div div div ul li button.ql-size{background:#363d51!important}app-users-sign-in .input-group{border:1px solid #fff;border-radius:5px}app-users-sign-in .password-toggle{border:0}app-mail-detail .mail-content *{background:unset!important}';
