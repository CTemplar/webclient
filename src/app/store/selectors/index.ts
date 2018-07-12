// Angular
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// Ngrx
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
// Model
import { AppState, BlogState, MailState, RouterStateUrl } from '../datatypes';

export const selectBlogState1 = (state: AppState) => state.blog;


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

export const getMailDetail = createSelector(
  selectMailState,
  (state: MailState) => state.mailDetail
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
