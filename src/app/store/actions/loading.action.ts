import { Action } from '@ngrx/store';

export enum LoadingActionTypes {
  LOADING = '[Loading] Loading',
  LOADED = '[Loading] Loaded'
}

export class Loading implements Action {
  readonly type = LoadingActionTypes.LOADING;
  constructor(public payload: any) { }
}

export class Loaded implements Action {
  readonly type = LoadingActionTypes.LOADED;
  constructor(public payload: any) {}
}

export type LoadingActionAll =
  | Loading
  | Loaded;
