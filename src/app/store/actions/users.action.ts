// Ngrx
import { Action } from '@ngrx/store';
import { Settings } from '../datatypes';

export enum UsersActionTypes {
  ACCOUNTS = '[Users] Accounts',
  ACCOUNTS_READ_SUCCESS = '[Users] Accounts_Read_Success',
  WHITELIST_GET = '[Users] WhiteLists',
  WHITELIST_READ_SUCCESS = '[Users] WhiteList_Read_Success',
  WHITELIST_ADD = '[Users] WhiteList_Add',
  WHITELIST_ADD_SUCCESS = '[Users] WhiteList_Add_Success',
  WHITELIST_ADD_ERROR = '[Users] WhiteList_Add_Error',
  WHITELIST_DELETE = '[Users] WhiteList_Delete',
  WHITELIST_DELETE_SUCCESS = '[Users] WhiteList_Delete_Success',
  BLACKLIST_GET = '[Users] BlackLists',
  BLACKLIST_READ_SUCCESS = '[Users] BlackList_Read_Success',
  BLACKLIST_ADD = '[Users] BlackList_Add',
  BLACKLIST_ADD_SUCCESS = '[Users] BlackList_Add_Success',
  BLACKLIST_ADD_ERROR = '[Users] BlackList_Add_ERROR',
  BLACKLIST_DELETE = '[Users] BlackList_Delete',
  BLACKLIST_DELETE_SUCCESS = '[Users] BlackList_Delete_Success',
  ACCOUNT_DETAILS_GET = '[Users] ACCOUNT_DETAILS_GET',
  ACCOUNT_DETAILS_GET_SUCCESS = '[Users] ACCOUNT_DETAILS_GET_SUCCESS',
  SNACK_PUSH = '[Snacks] Push',
  SNACK_PUSH_SUCCESS = '[Snacks] Push success',
  SNACK_ERROR_PUSH = '[Snacks] Error Push',
  SNACK_ERROR_PUSH_SUCCESS = '[Snacks] Error Push success',
  MEMBERSHIP_UPDATE = '[Membership] Update',
  SETTINGS_UPDATE = '[SETTINGS] UPDATE',
  SETTINGS_UPDATE_SUCCESS = '[SETTINGS] UPDATE SUCCESS',
  CREATE_FOLDER = '[USER] UPDATE FOLDER',
  CREATE_FOLDER_SUCCESS = '[USER] UPDATE FOLDER SUCCESS',
  DELETE_FOLDER = '[USER] DELETE FOLDER',
  DELETE_FOLDER_SUCCESS = '[USER] DELETE FOLDER SUCCESS',
  GET_FILTERS = '[USER] GET FILTERS',
  GET_FILTERS_SUCCESS = '[USER] GET FILTERS SUCCESS',
  CREATE_FILTER = '[USER] CREATE FILTER',
  CREATE_FILTER_SUCCESS = '[USER] CREATE FILTER SUCCESS',
  CREATE_FILTER_FAILURE = '[USER] CREATE FILTER FAILURE',
  UPDATE_FILTER = '[USER] UPDATE FILTER',
  UPDATE_FILTER_SUCCESS = '[USER] UPDATE FILTER SUCCESS',
  UPDATE_FILTER_FAILURE = '[USER] UPDATE FILTER FAILURE',
  DELETE_FILTER = '[USER] DELETE FILTER',
  DELETE_FILTER_SUCCESS = '[USER] DELETE FILTER SUCCESS',
  DELETE_FILTER_FAILURE = '[USER] DELETE FILTER FAILURE',
  GET_DOMAINS = '[Users] GET_DOMAINS',
  GET_DOMAINS_SUCCESS = '[Users] GET_DOMAINS_SUCCESS',
  CREATE_DOMAIN = '[Users] CREATE_DOMAIN',
  CREATE_DOMAIN_SUCCESS = '[Users] CREATE_DOMAIN_SUCCESS',
  CREATE_DOMAIN_FAILURE = '[Users] CREATE_DOMAIN_FAILURE',
  UPDATE_DOMAIN = '[Users] UPDATE_DOMAIN',
  UPDATE_DOMAIN_SUCCESS = '[Users] UPDATE_DOMAIN_SUCCESS',
  UPDATE_DOMAIN_FAILURE = '[Users] UPDATE_DOMAIN_FAILURE',
  READ_DOMAIN = '[Users] READ_DOMAIN',
  READ_DOMAIN_SUCCESS = '[Users] READ_DOMAIN_SUCCESS',
  READ_DOMAIN_FAILURE = '[Users] READ_DOMAIN_FAILURE',
  DELETE_DOMAIN = '[Users] DELETE_DOMAIN',
  DELETE_DOMAIN_SUCCESS = '[Users] DELETE_DOMAIN_SUCCESS',
  DELETE_DOMAIN_FAILURE = '[Users] DELETE_DOMAIN_FAILURE',
  VERIFY_DOMAIN = '[Users] VERIFY_DOMAIN',
  VERIFY_DOMAIN_SUCCESS = '[Users] VERIFY_DOMAIN_SUCCESS',
  VERIFY_DOMAIN_FAILURE = '[Users] VERIFY_DOMAIN_FAILURE',
  PAYMENT_FAILURE = '[USER] PAYMENT FAILURE',
  SEND_EMAIL_FORWARDING_CODE = '[USER] SEND EMAIL FORWARDING CODE',
  SEND_EMAIL_FORWARDING_CODE_SUCCESS = '[USER] SEND EMAIL FORWARDING CODE SUCCESS',
  SEND_EMAIL_FORWARDING_CODE_FAILURE = '[USER] SEND EMAIL FORWARDING CODE FAILURE',
  VERIFY_EMAIL_FORWARDING_CODE = '[USER] VERIFY EMAIL FORWARDING CODE',
  VERIFY_EMAIL_FORWARDING_CODE_SUCCESS = '[USER] VERIFY EMAIL FORWARDING CODE SUCCESS',
  VERIFY_EMAIL_FORWARDING_CODE_FAILURE = '[USER] VERIFY EMAIL FORWARDING CODE FAILURE',
  UPDATE_FOLDER_ORDER = '[USER] UPDATE FOLDER ORDER',
  UPDATE_FOLDER_ORDER_SUCCESS = '[USER] UPDATE FOLDER ORDER SUCCESS',
  SAVE_AUTORESPONDER = '[USER] SAVE AUTORESPONDER',
  SAVE_AUTORESPONDER_SUCCESS = '[USER] SAVE AUTORESPONDER SUCCESS',
  SAVE_AUTORESPONDER_FAILURE = '[USER] SAVE AUTORESPONDER FAILURE',
  GET_INVOICES = '[USER] GET INVOICES',
  GET_INVOICES_SUCCESS = '[USER] GET INVOICES SUCCESS',
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

export class WhiteListGet implements Action {
  readonly type = UsersActionTypes.WHITELIST_GET;

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

export class BlackListGet implements Action {
  readonly type = UsersActionTypes.BLACKLIST_GET;

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

export class CreateFolder implements Action {
  readonly type = UsersActionTypes.CREATE_FOLDER;

  constructor(public payload: any) {}
}

export class CreateFolderSuccess implements Action {
  readonly type = UsersActionTypes.CREATE_FOLDER_SUCCESS;

  constructor(public payload: any) {}
}

export class DeleteFolder implements Action {
  readonly type = UsersActionTypes.DELETE_FOLDER;

  constructor(public payload: any) {}
}

export class DeleteFolderSuccess implements Action {
  readonly type = UsersActionTypes.DELETE_FOLDER_SUCCESS;

  constructor(public payload: any) {}
}

export class GetFilters implements Action {
  readonly type = UsersActionTypes.GET_FILTERS;

  constructor(public payload?: any) {
  }
}

export class GetFiltersSuccess implements Action {
  readonly type = UsersActionTypes.GET_FILTERS_SUCCESS;

  constructor(public payload: any) {
  }
}

export class CreateFilter implements Action {
  readonly type = UsersActionTypes.CREATE_FILTER;

  constructor(public payload: any) {
  }
}

export class CreateFilterSuccess implements Action {
  readonly type = UsersActionTypes.CREATE_FILTER_SUCCESS;

  constructor(public payload: any) {
  }
}

export class CreateFilterFailure implements Action {
  readonly type = UsersActionTypes.CREATE_FILTER_FAILURE;

  constructor(public payload: any) {
  }
}

export class UpdateFilter implements Action {
  readonly type = UsersActionTypes.UPDATE_FILTER;

  constructor(public payload: any) {
  }
}

export class UpdateFilterSuccess implements Action {
  readonly type = UsersActionTypes.UPDATE_FILTER_SUCCESS;

  constructor(public payload: any) {
  }
}

export class UpdateFilterFailure implements Action {
  readonly type = UsersActionTypes.UPDATE_FILTER_FAILURE;

  constructor(public payload: any) {
  }
}

export class DeleteFilter implements Action {
  readonly type = UsersActionTypes.DELETE_FILTER;

  constructor(public payload: any) {
  }
}

export class DeleteFilterSuccess implements Action {
  readonly type = UsersActionTypes.DELETE_FILTER_SUCCESS;

  constructor(public payload: any) {
  }
}

export class DeleteFilterFailure implements Action {
  readonly type = UsersActionTypes.DELETE_FILTER_FAILURE;

  constructor(public payload: any) {
  }
}

export class GetDomains implements Action {
  readonly type = UsersActionTypes.GET_DOMAINS;

  constructor(public payload?: any) {
  }
}

export class GetDomainsSuccess implements Action {
  readonly type = UsersActionTypes.GET_DOMAINS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateDomain implements Action {
  readonly type = UsersActionTypes.CREATE_DOMAIN;

  constructor(public payload: string) {
  }
}

export class CreateDomainSuccess implements Action {
  readonly type = UsersActionTypes.CREATE_DOMAIN_SUCCESS;

  constructor(public payload: any) {
  }
}

export class CreateDomainFailure implements Action {
  readonly type = UsersActionTypes.CREATE_DOMAIN_FAILURE;

  constructor(public payload: any) {
  }
}

export class UpdateDomain implements Action {
  readonly type = UsersActionTypes.UPDATE_DOMAIN;

  constructor(public payload: any) {
  }
}

export class UpdateDomainSuccess implements Action {
  readonly type = UsersActionTypes.UPDATE_DOMAIN_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateDomainFailure implements Action {
  readonly type = UsersActionTypes.UPDATE_DOMAIN_FAILURE;

  constructor(public payload: any) {
  }
}

export class ReadDomain implements Action {
  readonly type = UsersActionTypes.READ_DOMAIN;

  constructor(public payload: number) {
  }
}

export class ReadDomainSuccess implements Action {
  readonly type = UsersActionTypes.READ_DOMAIN_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ReadDomainFailure implements Action {
  readonly type = UsersActionTypes.READ_DOMAIN_FAILURE;

  constructor(public payload: any) {
  }
}

export class DeleteDomain implements Action {
  readonly type = UsersActionTypes.DELETE_DOMAIN;

  constructor(public payload: any) {
  }
}

export class DeleteDomainSuccess implements Action {
  readonly type = UsersActionTypes.DELETE_DOMAIN_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class DeleteDomainFailure implements Action {
  readonly type = UsersActionTypes.DELETE_DOMAIN_FAILURE;

  constructor(public payload?: any) {
  }
}

export class VerifyDomain implements Action {
  readonly type = UsersActionTypes.VERIFY_DOMAIN;

  constructor(public payload: any) {
  }
}

export class VerifyDomainSuccess implements Action {
  readonly type = UsersActionTypes.VERIFY_DOMAIN_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class VerifyDomainFailure implements Action {
  readonly type = UsersActionTypes.VERIFY_DOMAIN_FAILURE;

  constructor(public payload?: any) {
  }
}

export class PaymentFailure implements Action {
  readonly type = UsersActionTypes.PAYMENT_FAILURE;

  constructor(public payload?: any) {
  }
}

export class SendEmailForwardingCode implements Action {
  readonly type = UsersActionTypes.SEND_EMAIL_FORWARDING_CODE;

  constructor(public payload?: any) {
  }
}

export class SendEmailForwardingCodeSuccess implements Action {
  readonly type = UsersActionTypes.SEND_EMAIL_FORWARDING_CODE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class SendEmailForwardingCodeFailure implements Action {
  readonly type = UsersActionTypes.SEND_EMAIL_FORWARDING_CODE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class VerifyEmailForwardingCode implements Action {
  readonly type = UsersActionTypes.VERIFY_EMAIL_FORWARDING_CODE;

  constructor(public payload?: any) {
  }
}

export class VerifyEmailForwardingCodeSuccess implements Action {
  readonly type = UsersActionTypes.VERIFY_EMAIL_FORWARDING_CODE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class VerifyEmailForwardingCodeFailure implements Action {
  readonly type = UsersActionTypes.VERIFY_EMAIL_FORWARDING_CODE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateFolderOrder implements Action {
  readonly type = UsersActionTypes.UPDATE_FOLDER_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdateFolderOrderSuccess implements Action {
  readonly type = UsersActionTypes.UPDATE_FOLDER_ORDER_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class SaveAutoResponder implements Action {
  readonly type = UsersActionTypes.SAVE_AUTORESPONDER;

  constructor(public payload: any) {
  }
}

export class SaveAutoResponderSuccess implements Action {
  readonly type = UsersActionTypes.SAVE_AUTORESPONDER_SUCCESS;

  constructor(public payload: any) {
  }
}

export class SaveAutoResponderFailure implements Action {
  readonly type = UsersActionTypes.SAVE_AUTORESPONDER_FAILURE;

  constructor(public payload: any) {
  }
}


export class GetInvoices implements Action {
  readonly type = UsersActionTypes.GET_INVOICES;

  constructor(public payload?: any) {
  }
}

export class GetInvoicesSuccess implements Action {
  readonly type = UsersActionTypes.GET_INVOICES_SUCCESS;

  constructor(public payload: any) {
  }
}

export type UsersActionAll =
  Accounts
  | AccountsReadSuccess
  | WhiteListGet
  | WhiteListsReadSuccess
  | WhiteListAdd
  | WhiteListAddSuccess
  | WhiteListAddError
  | WhiteListDelete
  | WhiteListDeleteSuccess
  | BlackListGet
  | BlackListsReadSuccess
  | BlackListAdd
  | BlackListAddSuccess
  | BlackListAddError
  | BlackListDelete
  | BlackListDeleteSuccess
  | AccountDetailsGet
  | AccountDetailsGetSuccess
  | SnackPush
  | SnackPushSuccess
  | SnackErrorPush
  | SnackErrorPushSuccess
  | MembershipUpdate
  | SettingsUpdate
  | SettingsUpdateSuccess
  | CreateFolder
  | CreateFolderSuccess
  | DeleteFolder
  | DeleteFolderSuccess
  | GetFilters
  | GetFiltersSuccess
  | CreateFilter
  | CreateFilterSuccess
  | CreateFilterFailure
  | UpdateFilter
  | UpdateFilterSuccess
  | UpdateFilterFailure
  | DeleteFilter
  | DeleteFilterSuccess
  | DeleteFilterFailure
  | GetDomains
  | GetDomainsSuccess
  | CreateDomain
  | CreateDomainSuccess
  | CreateDomainFailure
  | UpdateDomain
  | UpdateDomainSuccess
  | UpdateDomainFailure
  | ReadDomain
  | ReadDomainSuccess
  | ReadDomainFailure
  | DeleteDomain
  | DeleteDomainSuccess
  | DeleteDomainFailure
  | PaymentFailure
  | VerifyDomain
  | VerifyDomainSuccess
  | VerifyDomainFailure
  | SendEmailForwardingCode
  | SendEmailForwardingCodeSuccess
  | SendEmailForwardingCodeFailure
  | VerifyEmailForwardingCode
  | VerifyEmailForwardingCodeSuccess
  | VerifyEmailForwardingCodeFailure
  | UpdateFolderOrder
  | UpdateFolderOrderSuccess
  | SaveAutoResponder
  | SaveAutoResponderSuccess
  | SaveAutoResponderFailure
  | GetInvoices
  | GetInvoicesSuccess;
