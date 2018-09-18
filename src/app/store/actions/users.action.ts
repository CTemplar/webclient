// Ngrx
import { Action } from '@ngrx/store';
import { Settings } from '../datatypes';

export enum UsersActionTypes {
  ACCOUNTS = '[Users] Accounts',
  ACCOUNTS_READ_SUCCESS = '[Users] Accounts_Read_Success',
  WHITELIST = '[Users] WhiteLists',
  WHITELIST_READ_SUCCESS = '[Users] WhiteList_Read_Success',
  WHITELIST_ADD = '[Users] WhiteList_Add',
  WHITELIST_ADD_SUCCESS = '[Users] WhiteList_Add_Success',
  WHITELIST_ADD_ERROR = '[Users] WhiteList_Add_Error',
  WHITELIST_DELETE = '[Users] WhiteList_Delete',
  WHITELIST_DELETE_SUCCESS = '[Users] WhiteList_Delete_Success',
  BLACKLIST = '[Users] BlackLists',
  BLACKLIST_READ_SUCCESS = '[Users] BlackList_Read_Success',
  BLACKLIST_ADD = '[Users] BlackList_Add',
  BLACKLIST_ADD_SUCCESS = '[Users] BlackList_Add_Success',
  BLACKLIST_ADD_ERROR = '[Users] BlackList_Add_ERROR',
  BLACKLIST_DELETE = '[Users] BlackList_Delete',
  BLACKLIST_DELETE_SUCCESS = '[Users] BlackList_Delete_Success',
  CONTACT_GET = '[Users] ContactGet GET',
  CONTACT_GET_SUCCESS = '[Users] Contact_GET_Success',
  CONTACT_ADD = '[Users] Contact_Add',
  CONTACT_ADD_SUCCESS = '[Users] Contact_Add_Success',
  CONTACT_ADD_ERROR = '[Users] Contact_Add_Error',
  CONTACT_DELETE = '[Users] Contact_Delete',
  CONTACT_DELETE_SUCCESS = '[Users] Contact_Delete_Success',
  ACCOUNT_DETAILS_GET = '[Users] ACCOUNT_DETAILS_GET',
  ACCOUNT_DETAILS_GET_SUCCESS = '[Users] ACCOUNT_DETAILS_GET_SUCCESS',
  SNACK_PUSH = '[Snacks] Push',
  SNACK_PUSH_SUCCESS = '[Snacks] Push success',
  SNACK_ERROR_PUSH = '[Snacks] Error Push',
  SNACK_ERROR_PUSH_SUCCESS = '[Snacks] Error Push success',
  MEMBERSHIP_UPDATE = '[Membership] Update',
  SETTINGS_UPDATE = '[SETTINGS] UPDATE',
  SETTINGS_UPDATE_SUCCESS = '[SETTINGS] UPDATE SUCCESS'
}

export class Accounts implements Action {
  readonly type = UsersActionTypes.ACCOUNTS;

  constructor(public payload: any) {
  }
}

export class AccountsReadSuccess implements Action {
  readonly type = UsersActionTypes.ACCOUNTS_READ_SUCCESS;

  constructor(public payload: any) {
  }
}

export class WhiteList implements Action {
  readonly type = UsersActionTypes.WHITELIST;

  constructor(public payload?: any) {
  }
}

export class WhiteListsReadSuccess implements Action {
  readonly type = UsersActionTypes.WHITELIST_READ_SUCCESS;

  constructor(public payload: any) {
  }
}

export class WhiteListAdd implements Action {
  readonly type = UsersActionTypes.WHITELIST_ADD;

  constructor(public payload: any) {
  }
}

export class WhiteListAddSuccess implements Action {
  readonly type = UsersActionTypes.WHITELIST_ADD_SUCCESS;

  constructor(public payload: any) {
  }
}

export class WhiteListAddError implements Action {
  readonly type = UsersActionTypes.WHITELIST_ADD_ERROR;

  constructor(public payload?: any) {
  }
}

export class WhiteListDelete implements Action {
  readonly type = UsersActionTypes.WHITELIST_DELETE;

  constructor(public payload: any) {
  }
}

export class WhiteListDeleteSuccess implements Action {
  readonly type = UsersActionTypes.WHITELIST_DELETE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class BlackList implements Action {
  readonly type = UsersActionTypes.BLACKLIST;

  constructor(public payload?: any) {
  }
}

export class BlackListsReadSuccess implements Action {
  readonly type = UsersActionTypes.BLACKLIST_READ_SUCCESS;

  constructor(public payload: any) {
  }
}

export class BlackListAdd implements Action {
  readonly type = UsersActionTypes.BLACKLIST_ADD;

  constructor(public payload: any) {
  }
}

export class BlackListAddSuccess implements Action {
  readonly type = UsersActionTypes.BLACKLIST_ADD_SUCCESS;

  constructor(public payload: any) {
  }
}

export class BlackListAddError implements Action {
  readonly type = UsersActionTypes.BLACKLIST_ADD_ERROR;

  constructor(public payload?: any) {
  }
}

export class BlackListDelete implements Action {
  readonly type = UsersActionTypes.BLACKLIST_DELETE;

  constructor(public payload: any) {
  }
}

export class BlackListDeleteSuccess implements Action {
  readonly type = UsersActionTypes.BLACKLIST_DELETE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ContactGet implements Action {
  readonly type = UsersActionTypes.CONTACT_GET;

  constructor(public payload: any) {
  }
}

export class ContactGetSuccess implements Action {
  readonly type = UsersActionTypes.CONTACT_GET_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ContactAdd implements Action {
  readonly type = UsersActionTypes.CONTACT_ADD;

  constructor(public payload: any) {
  }
}

export class ContactAddSuccess implements Action {
  readonly type = UsersActionTypes.CONTACT_ADD_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ContactAddError implements Action {
  readonly type = UsersActionTypes.CONTACT_ADD_ERROR;

  constructor(public payload?: any) {
  }
}

export class ContactDelete implements Action {
  readonly type = UsersActionTypes.CONTACT_DELETE;

  constructor(public payload: any) {
  }
}

export class ContactDeleteSuccess implements Action {
  readonly type = UsersActionTypes.CONTACT_DELETE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class AccountDetailsGet implements Action {
  readonly type = UsersActionTypes.ACCOUNT_DETAILS_GET;

  constructor(public payload?: any) {
  }
}

export class AccountDetailsGetSuccess implements Action {
  readonly type = UsersActionTypes.ACCOUNT_DETAILS_GET_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class SnackPush implements Action {
  readonly type = UsersActionTypes.SNACK_PUSH;

  constructor(public payload?: any) {
  }
}

export class SnackPushSuccess implements Action {
  readonly type = UsersActionTypes.SNACK_PUSH_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class SnackErrorPush implements Action {
  readonly type = UsersActionTypes.SNACK_ERROR_PUSH;

  constructor(public payload?: any) {
  }
}

export class SnackErrorPushSuccess implements Action {
  readonly type = UsersActionTypes.SNACK_ERROR_PUSH_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class MembershipUpdate implements Action {
  readonly type = UsersActionTypes.MEMBERSHIP_UPDATE;

  constructor(public payload?: any) {
  }
}

export class SettingsUpdate implements Action {
  readonly type = UsersActionTypes.SETTINGS_UPDATE;

  constructor(public payload: Settings) {}
}

export class SettingsUpdateSuccess implements Action {
  readonly type = UsersActionTypes.SETTINGS_UPDATE_SUCCESS;

  constructor(public payload: Settings) {}
}

export type UsersActionAll =
  Accounts
  | AccountsReadSuccess
  | WhiteList
  | WhiteListsReadSuccess
  | WhiteListAdd
  | WhiteListAddSuccess
  | WhiteListAddError
  | WhiteListDelete
  | WhiteListDeleteSuccess
  | BlackList
  | BlackListsReadSuccess
  | BlackListAdd
  | BlackListAddSuccess
  | BlackListAddError
  | BlackListDelete
  | BlackListDeleteSuccess
  | ContactGet
  | ContactGetSuccess
  | ContactAdd
  | ContactAddSuccess
  | ContactAddError
  | ContactDelete
  | ContactDeleteSuccess
  | AccountDetailsGet
  | AccountDetailsGetSuccess
  | SnackPush
  | SnackPushSuccess
  | SnackErrorPush
  | SnackErrorPushSuccess
  | MembershipUpdate
  | SettingsUpdate
  | SettingsUpdateSuccess;
