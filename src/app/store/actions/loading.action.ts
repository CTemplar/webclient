import { Action } from '@ngrx/store';

export enum LoadingActionTypes {
  LOADING = '[Loading] Loading',
  LOADED = '[Loading] Loaded'
}

export class BlogLoading implements Action {
  readonly type = LoadingActionTypes.LOADING;
  constructor(public payload: any) { }
}

export class BlogLoaded implements Action {
  readonly type = LoadingActionTypes.LOADED;
  constructor(public payload: any) {}
}

export type LoadingActionAll =
  | BlogLoading
  | BlogLoaded;
