// Angular
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export function apiHeaders() {
  return {
    headers: new HttpHeaders({ 'Authorization': `JWT ${sessionStorage.getItem('token')}` })
  };
}

export const apiUrl = environment.apiServerUrl;
export const bitcoinApiUrl = environment.bitcoinServerUrl;


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

export const LANGUAGES: Language[] = [
  { name: 'English', locale: 'en' },
  // { name: 'Spanish', locale: 'es' },
  // { name: 'Russian', locale: 'ru' },
  // { name: 'Icelandic', locale: 'is' },
  // { name: 'Arabic', locale: 'ar' },
  // { name: 'Hebrew', locale: 'he' },
  // { name: 'Chinese', locale: 'zh' },
  // { name: 'French', locale: 'fr' },
  // { name: 'Italiano', locale: 'it' },
  // { name: 'Dutch', locale: 'nl' },
  // { name: 'Ukrainian', locale: 'uk' },
];

export interface Language {
  name: string;
  locale: string;
}

export const ESCAPE_KEYCODE = 27;
