import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Params
} from '@angular/router';
import { createFeatureSelector, ActionReducerMap } from '@ngrx/store';

import * as fromRouter from '@ngrx/router-store';
import { RouterStateUrl, AppState, BlogState } from '../datatypes';


export const getRouterState = createFeatureSelector<
  fromRouter.RouterReducerState<RouterStateUrl>
>('routerReducer');

export const selectAuthState = createFeatureSelector<AppState>('auth');
export const selectBlogState = createFeatureSelector<AppState>('blog');
// export const selectNewposts$ = createFeatureSelector<BlogState>('newPosts');

export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;

    return { url, queryParams, params };
  }
}
