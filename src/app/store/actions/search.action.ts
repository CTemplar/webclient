import { Action } from '@ngrx/store';

export enum SearchActionTypes {
  CLEAR_SEARCH = '[SEARCH] update'
}

export class ClearSearch implements Action {
  readonly type = SearchActionTypes.CLEAR_SEARCH;

  constructor(public payload?: any) {}
}

export type SearchActionAll = ClearSearch;
