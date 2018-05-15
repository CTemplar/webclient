// Angular
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Params
} from '@angular/router';

// Ngrx
import { createFeatureSelector, ActionReducerMap, createSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

// Model
import { RouterStateUrl, AppState, BlogState, MailState } from '../datatypes';


export const getRouterState = createFeatureSelector<AppState>('routerReducer');

export const selectAuthState = createFeatureSelector<AppState>('auth');
export const selectBlogState = createFeatureSelector<AppState>('blog');
export const selectBlogState1 = (state: AppState) => state.blog;
export const selectLoadingState = createFeatureSelector<AppState>('loading');

export const getBlogDetail = createSelector(
  selectBlogState1,
  (state: BlogState) => state.selectedPost
);

export const getNewBlogs = createSelector(
  selectBlogState1,
  (state: BlogState) => state.newPosts
);

export const getCategories = createSelector(
  selectBlogState1,
  (state: BlogState) => state.categories
);


export const getRelatedBlogs = createSelector(
  selectBlogState1,
  (state: BlogState) => state.relatedPosts
);

export const getNewCommentState = createSelector(
  selectBlogState1,
  (state: BlogState) => state.errorMessage
);

export const selectMailState = (state: AppState) => state.mail;
export const getMails = createSelector(
  selectMailState,
  (state: MailState) => state.mails
);

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

    return { url, queryParams, params, state };
  }
}
