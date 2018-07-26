import { Action } from '@ngrx/store';


export enum SearchActionTypes {
  UPDATE_SEARCH = '[SEARCH] update',
  CLEAR_SEARCH = '[SEARCH] clear',
}

export class UpdateSearch implements Action {
  readonly type = SearchActionTypes.UPDATE_SEARCH;

  constructor(public payload: any) { }
}

export class ClearSearch implements Action {
  readonly type = SearchActionTypes.CLEAR_SEARCH;

  constructor(public payload?: any) { }
}

export type SearchActionAll = UpdateSearch
  | ClearSearch;
