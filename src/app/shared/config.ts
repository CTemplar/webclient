import * as QuillNamespace from 'quill';
import ImageResize from 'quill-image-resize-module';

import { AppConfig } from '../../environments/environment';

export const IS_ELECTRON = window.location.protocol === 'file:';
export const apiUrl = getBaseUrl();
export const PRIMARY_DOMAIN = AppConfig.production ? 'ctemplar.com' : 'dev.ctemplar.net';
export const PRIMARY_WEBSITE = 'https://ctemplar.com';
export const SENTRY_DSN = 'https://e768a553906d4f87bcb0419a151e36b0@o190614.ingest.sentry.io/5256284';

export const COLORS: string[] = [
  '#000000',
  '#616161',
  '#828282',
  '#adadad',
  '#d2d2d2',
  '#e9e9e9',
  '#ffffff',
  '#730000',
  '#ae0000',
  '#e60000',
  '#ff2121',
  '#ff7676',
  '#ffc9c9',
  '#ffefef',
  '#734600',
  '#ae6200',
  '#e66300',
  '#ff8c21',
  '#ffc576',
  '#ffe9c9',
  '#ffe9c9',
  '#737200',
  '#a0ae00',
  '#e6e300',
  '#fff621',
  '#fdff76',
  '#fffdc9',
  '#ffffef',
  '#0f7300',
  '#0eae00',
  '#1ee600',
  '#21ff38',
  '#76ff76',
  '#c9ffd0',
  '#effff1',
  '#006e73',
  '#00aeac',
  '#00dce6',
  '#21f4ff',
  '#76fff4',
  '#c9fffc',
  '#effeff',
  '#000173',
  '#0016ae',
  '#0100e6',
  '#5555ff',
  '#7681ff',
  '#cdc9ff',
  '#f1efff',
  '#530073',
  '#7500ae',
  '#ba00e6',
  '#e955ff',
  '#de76ff',
  '#f2c9ff',
  '#fcefff',
];

export const FOLDER_COLORS: string[] = [
  '#ced4da',
  '#868e96',
  '#212529',
  '#da77f2',
  '#be4bdb',
  '#8e44ad',
  '#f783ac',
  '#e64980',
  '#a61e4d',
  '#748ffc',
  '#4c6ef5',
  '#364fc7',
  '#9775fa',
  '#7950f2',
  '#5f3dc4',
  '#ff8787',
  '#fa5252',
  '#c0392b',
  '#4dabf7',
  '#3498db',
  '#1864ab',
  '#2ecc71',
  '#27ae60',
  '#16a085',
  '#ffd43b',
  '#fab005',
  '#e67e22',
  '#3bc9db',
  '#15aabf',
  '#0b7285',
  '#a9e34b',
  '#82c91e',
  '#5c940d',
  '#f39c12',
  '#fd7e14',
  '#e74c3c',
];

export const LANGUAGES: Language[] = [
  { name: 'English', locale: 'en' },
  { name: 'Spanish', locale: 'es' },
  { name: 'Russian', locale: 'ru' },
  { name: 'Chinese', locale: 'zh' },
  { name: 'French', locale: 'fr' },
  { name: 'Ukrainian', locale: 'uk' },
  { name: 'Portuguese', locale: 'pt' },
  { name: 'Arabic', locale: 'ar' },
  { name: 'German', locale: 'de' },
];

export interface Language {
  name: string;
  locale: string;
}

export const ESCAPE_KEYCODE = 27;
export const MAX_FOLDERS_COUNT = 5;

export const VALID_EMAIL_REGEX: any = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z\-]+\.)+[A-Za-z]{2,}))$/;

export const FONTS = ['lato', 'roboto', 'arial', 'times-new-roman'];
export const AUTOSAVE_DURATION = ['none', '5000', '10000', '20000', '30000'];

export const REFFERAL_CODE_KEY = 'referral_code';
export const PROMO_CODE_KEY = 'promo_code';
export const REFFERAL_ID_KEY = 'cjevent';
export const JWT_AUTH_COOKIE = 'jwt_auth_cookie';
export const REMEMBER_ME = 'remember_me';
export const SYNC_DATA_WITH_STORE = 'sync_data_with_store';
export const NOT_FIRST_LOGIN = 'not_first_login';

export const SummarySeparator = '';
const Quill: any = QuillNamespace;

Quill.register('modules/imageResize', ImageResize);

export const QUILL_FORMATTING_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction
    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ color: COLORS }, { background: COLORS }], // dropdown with defaults from theme
    [{ align: [] as any[] }],
    ['clean'], // remove formatting button
    ['link', 'image'], // link /not-allowed-in-simple-version(and image, video)
  ],
  imageResize: true,
};

function getBaseUrl() {
  const config = getWindowConfig();
  if (AppConfig.production) {
    return config.host === 'mail.ctemplarpizuduxk3fkwrieizstx33kg5chlvrh37nz73pv5smsvl6ad.onion'
      ? 'http://api.ctemplarpizuduxk3fkwrieizstx33kg5chlvrh37nz73pv5smsvl6ad.onion/'
      : 'https://api.ctemplar.com/';
  }
  if (AppConfig.local) {
    return 'http://localhost:8000/';
  }
  if (config.host === 'test.ctemplar.net') {
    return 'https://testapi.ctemplar.net/';
  }
  return 'https://devapi.ctemplar.net/';
}

export function getWindowConfig(): { host: string; protocol: string } {
  let { protocol } = window.location;
  let { host } = location;
  if (IS_ELECTRON || location.hostname === 'localhost') {
    protocol = 'https:';
    host = AppConfig.production ? 'mail.ctemplar.com' : 'dev.ctemplar.net';
  }
  return { host, protocol };
}
