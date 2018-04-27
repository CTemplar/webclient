
import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { AppState } from '../datatypes';
import * as auth from './auth.reducers';
import * as blog from './blog.reducers';
import * as mail from './mail.reducers';

export const reducers: ActionReducerMap<AppState> = {
  routerReducer: fromRouter.routerReducer,
  auth: auth.reducer,
  blog: blog.reducer,
  mail: mail.reducer
};

