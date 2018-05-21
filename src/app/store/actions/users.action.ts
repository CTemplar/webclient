// Ngrx
import { Action } from '@ngrx/store';

export enum UsersActionTypes {
  ACCOUNTS = '[Users] Accounts',
  ACCOUNTS_READ_SUCCESS = '[Users] Accounts_Read_Success'
}

export class Accounts implements Action {
  readonly type = UsersActionTypes.ACCOUNTS;
  constructor(public payload: any) {}
}

export class AccountsReadSuccess implements Action {
  readonly type = UsersActionTypes.ACCOUNTS_READ_SUCCESS;
  constructor(public payload: any) {}
}

export type UsersActionAll =
  | Accounts
  | AccountsReadSuccess;
