
import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { AppState } from '../datatypes';
import * as auth from './auth.reducers';
import * as blog from './blog.reducers';
import * as mail from './mail.reducers';
import * as loading from './loading.reducers';
import * as keyboard from './keyboard.reducers';
export const reducers: ActionReducerMap<AppState> = {
  routerReducer: fromRouter.routerReducer,
  auth: auth.reducer,
  blog: blog.reducer,
  mail: mail.reducer,
  loading: loading.reducer,
  keyboard: keyboard.reducer
};

