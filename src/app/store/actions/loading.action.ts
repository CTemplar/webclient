import { Action } from '@ngrx/store';

export enum LoadingActionTypes {
  RELATED_LOADING = '[Loading] Related Loading',
  RELATED_LOADED = '[Loading] Related Loaded',
  RECENT_LOADING = '[Loading] Recent Loading',
  RECENT_LOADED = '[Loading] Recent Loaded',
  FINAL_LOADING = '[Loading] Loading'
}

export class RelatedBlogLoading implements Action {
  readonly type = LoadingActionTypes.RELATED_LOADING;
  constructor(public payload: any) { }
}

export class RelatedBlogLoaded implements Action {
  readonly type = LoadingActionTypes.RELATED_LOADED;
  constructor(public payload: any) {}
}
export class RecentBlogLoading implements Action {
  readonly type = LoadingActionTypes.RECENT_LOADING;
  constructor(public payload: any) { }
}

export class RecentBlogLoaded implements Action {
  readonly type = LoadingActionTypes.RECENT_LOADED;
  constructor(public payload: any) { }
}

export class FinalLoading implements Action {
  readonly type = LoadingActionTypes.FINAL_LOADING;
  constructor(public payload: any) {
  }
}

export type LoadingActionAll =
  | RelatedBlogLoading
  | RelatedBlogLoaded
  | RecentBlogLoading
  | RecentBlogLoaded
  | FinalLoading;
