// Ngrx
import { Action } from '@ngrx/store';

export enum UsersActionTypes {
  ACCOUNTS = '[Users] Accounts',
  ACCOUNTS_READ_SUCCESS = '[Users] Accounts_Read_Success',
  WHITELIST = '[Users] WhiteLists',
  WHITELIST_READ_SUCCESS = '[Users] WhiteList_Read_Success',
  WHITELIST_ADD = '[Users] WhiteList_Add',
  WHITELIST_ADD_SUCCESS = '[Users] WhiteList_Add_Success',
  WHITELIST_DELETE = '[Users] WhiteList_Delete',
  WHITELIST_DELETE_SUCCESS = '[Users] WhiteList_Delete_Success',
  BLACKLIST = '[Users] BlackLists',
  BLACKLIST_READ_SUCCESS = '[Users] BlackList_Read_Success',
  BLACKLIST_ADD = '[Users] BlackList_Add',
  BLACKLIST_ADD_SUCCESS = '[Users] BlackList_Add_Success',
  BLACKLIST_DELETE = '[Users] BlackList_Delete',
  BLACKLIST_DELETE_SUCCESS = '[Users] BlackList_Delete_Success',
  CONTACT_GET = '[Users] ContactGet GET',
  CONTACT_GET_SUCCESS = '[Users] Contact_GET_Success',
  CONTACT_ADD = '[Users] Contact_Add',
  CONTACT_ADD_SUCCESS = '[Users] Contact_Add_Success',
  CONTACT_DELETE = '[Users] Contact_Delete',
  CONTACT_DELETE_SUCCESS = '[Users] Contact_Delete_Success'
}

export class Accounts implements Action {
  readonly type = UsersActionTypes.ACCOUNTS;
  constructor(public payload: any) {}
}

export class AccountsReadSuccess implements Action {
  readonly type = UsersActionTypes.ACCOUNTS_READ_SUCCESS;
  constructor(public payload: any) {}
}

export class WhiteList implements Action {
  readonly type = UsersActionTypes.WHITELIST;
  constructor(public payload: any) {}
}

export class WhiteListsReadSuccess implements Action {
  readonly type = UsersActionTypes.WHITELIST_READ_SUCCESS;
  constructor(public payload: any) {}
}

export class WhiteListAdd implements Action {
  readonly type = UsersActionTypes.WHITELIST_ADD;
  constructor(public payload: any) {}
}

export class WhiteListAddSuccess implements Action {
  readonly type = UsersActionTypes.WHITELIST_ADD_SUCCESS;
  constructor(public payload: any) {}
}

export class WhiteListDelete implements Action {
  readonly type = UsersActionTypes.WHITELIST_DELETE;
  constructor(public payload: any) {}
}

export class WhiteListDeleteSuccess implements Action {
  readonly type = UsersActionTypes.WHITELIST_DELETE_SUCCESS;
  constructor(public payload: any) { }
}
export class BlackList implements Action {
  readonly type = UsersActionTypes.BLACKLIST;
  constructor(public payload: any) { }
}

export class BlackListsReadSuccess implements Action {
  readonly type = UsersActionTypes.BLACKLIST_READ_SUCCESS;
  constructor(public payload: any) { }
}

export class BlackListAdd implements Action {
  readonly type = UsersActionTypes.BLACKLIST_ADD;
  constructor(public payload: any) { }
}

export class BlackListAddSuccess implements Action {
  readonly type = UsersActionTypes.BLACKLIST_ADD_SUCCESS;
  constructor(public payload: any) { }
}

export class BlackListDelete implements Action {
  readonly type = UsersActionTypes.BLACKLIST_DELETE;
  constructor(public payload: any) { }
}

export class BlackListDeleteSuccess implements Action {
  readonly type = UsersActionTypes.BLACKLIST_DELETE_SUCCESS;
  constructor(public payload: any) { }
}

export class ContactGet implements Action {
  readonly type = UsersActionTypes.CONTACT_GET;
  constructor(public payload: any) {}
}

export class ContactGetSuccess implements Action {
  readonly type = UsersActionTypes.CONTACT_GET_SUCCESS;
  constructor(public payload: any) {}
}

export class ContactAdd implements Action {
  readonly type = UsersActionTypes.CONTACT_ADD;
  constructor(public payload: any) {}
}

export class ContactAddSuccess implements Action {
  readonly type = UsersActionTypes.CONTACT_ADD_SUCCESS;
  constructor(public payload: any) {}
}

export class ContactDelete implements Action {
  readonly type = UsersActionTypes.CONTACT_DELETE;
  constructor(public payload: any) {}
}

export class ContactDeleteSuccess implements Action {
  readonly type = UsersActionTypes.CONTACT_DELETE_SUCCESS;
  constructor(public payload: any) {}
}

export type UsersActionAll =
 Accounts
 | AccountsReadSuccess
 | WhiteList
 | WhiteListsReadSuccess
 | WhiteListAddSuccess
 | WhiteListDelete
 | WhiteListDeleteSuccess
 | BlackList
 | BlackListsReadSuccess
 | BlackListAddSuccess
 | BlackListDelete
 | BlackListDeleteSuccess
 | ContactGet
 | ContactGetSuccess
 | ContactAddSuccess
 | ContactDelete
 | ContactDeleteSuccess;
