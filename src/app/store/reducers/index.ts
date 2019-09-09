import { ActionReducerMap } from '@ngrx/store';

import { AppState } from '../datatypes';
import * as auth from './auth.reducers';
import * as mail from './mail.reducers';
import * as mailboxes from './mailboxes.reducers';
import * as loading from './loading.reducers';
import * as keyboard from './keyboard.reducers';
import * as user from './users.reducers';
import * as timezone from './timezone.reducer';
import * as bitcoin from './bitcoin.reducers';
import * as composeMail from './compose-mail.reducers';
import * as search from './search.reducers';
import * as secureMessage from './secure-message.reducers';
import * as webSocket from '../websocket.store';
import * as organization from '../organization.store';
import * as contacts from './contacts.reducers';

export const reducers: ActionReducerMap<AppState> = {
  auth: auth.reducer,
  mail: mail.reducer,
  mailboxes: mailboxes.reducer,
  loading: loading.reducer,
  keyboard: keyboard.reducer,
  user: user.reducer,
  contacts: contacts.reducer,
  timezone: timezone.reducer,
  bitcoin: bitcoin.reducer,
  composeMail: composeMail.reducer,
  search: search.reducer,
  secureMessage: secureMessage.reducer,
  webSocket: webSocket.reducer,
  organization: organization.reducer,
};

