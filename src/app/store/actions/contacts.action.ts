import { Action } from '@ngrx/store';

export enum ContactsActionTypes {
  CONTACT_GET = '[Contacts] ContactGet GET',
  CONTACT_GET_SUCCESS = '[Contacts] Contact_GET_Success',
  CONTACT_GET_FAILURE = '[Contacts] Contact_GET_Failure',
  CONTACT_ADD = '[Contacts] Contact_Add',
  CONTACT_ADD_SUCCESS = '[Contacts] Contact_Add_Success',
  CONTACT_ADD_ERROR = '[Contacts] Contact_Add_Error',
  CONTACT_DELETE = '[Contacts] Contact_Delete',
  CONTACT_DELETE_SUCCESS = '[Contacts] Contact_Delete_Success',
  CONTACT_NOTIFY = '[Contacts] Contact_Notify',
  CONTACT_NOTIFY_SUCCESS = '[Contacts] Contact_Notify_Success',
  CONTACT_NOTIFY_FAILURE = '[Contacts] Contact_Notify_Failure',
  CONTACT_IMPORT = '[Contacts] Contact Import',
  CONTACT_IMPORT_SUCCESS = '[Contacts] Contact Import Success',
  CONTACT_IMPORT_FAILURE = '[Contacts] Contact Import Failure',
  CONTACT_DECRYPT_SUCCESS = '[Contacts] Contact_Decrypt_Success',
  GET_EMAIL_CONTACTS = '[Contacts] GET EMAIL CONTACTS',
  GET_EMAIL_CONTACTS_SUCCESS = '[Contacts] GET EMAIL CONTACTS SUCCESS',
  CLEAR_CONTACTS_TO_DECRYPT = '[Contacts] CLEAR CONTACTS TO DECRYPT',
  CONTACT_BATCH_UPDATE = '[Contacts] Batch update',
  CONTACT_BATCH_UPDATE_SUCCESS = '[Contacts] Batch update Success',
  CONTACT_FETCH_KEYS = '[Contacts] Fetch Contact Keys',
  CONTACT_FETCH_KEYS_SUCCESS = '[Contacts] Fetch Contact Keys Success',
  CONTACT_FETCH_KEYS_FAILURE = '[Contacts] Fetch Contact Keys Failure',
  CONTACT_ADD_KEYS = '[Contacts] Add Contact Keys',
  CONTACT_ADD_KEYS_SUCCESS = '[Contacts] Add Contact Keys Success',
  CONTACT_ADD_KEYS_FAILURE = '[Contacts] Add Contact Keys Failure',
  CONTACT_UPDATE_KEYS = '[Contacts] Update Contact Keys',
  CONTACT_UPDATE_KEYS_SUCCESS = '[Contacts] Update Contact Keys Success',
  CONTACT_UPDATE_KEYS_FAILURE = '[Contacts] Update Contact Keys Failure',
  CONTACT_REMOVE_KEYS = '[Contacts] Remove Contact Keys',
  CONTACT_REMOVE_KEYS_SUCCESS = '[Contacts] Remove Contact Keys Success',
  CONTACT_REMOVE_KEYS_FAILURE = '[Contacts] Remove Contact Keys Failure',
}

export class ContactsGet implements Action {
  readonly type = ContactsActionTypes.CONTACT_GET;

  constructor(public payload: any = {}) {}
}

export class ContactGetSuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_GET_SUCCESS;

  constructor(public payload: any) {}
}
export class ContactGetFailure implements Action {
  readonly type = ContactsActionTypes.CONTACT_GET_FAILURE;

  constructor(public payload?: any) {}
}

export class ContactAdd implements Action {
  readonly type = ContactsActionTypes.CONTACT_ADD;

  constructor(public payload: any) {}
}

export class ContactAddSuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_ADD_SUCCESS;

  constructor(public payload: any) {}
}

export class ContactAddError implements Action {
  readonly type = ContactsActionTypes.CONTACT_ADD_ERROR;

  constructor(public payload?: any) {}
}

export class ContactDelete implements Action {
  readonly type = ContactsActionTypes.CONTACT_DELETE;

  constructor(public payload: any) {}
}

export class ContactDeleteSuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_DELETE_SUCCESS;

  constructor(public payload: any) {}
}

export class ContactNotify implements Action {
  readonly type = ContactsActionTypes.CONTACT_NOTIFY;

  constructor(public payload: any) {}
}

export class ContactNotifySuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_NOTIFY_SUCCESS;

  constructor(public payload: any) {}
}

export class ContactNotifyFailure implements Action {
  readonly type = ContactsActionTypes.CONTACT_NOTIFY_FAILURE;

  constructor(public payload: any) {}
}

export class ContactImport implements Action {
  readonly type = ContactsActionTypes.CONTACT_IMPORT;

  constructor(public payload: any) {}
}

export class ContactImportSuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_IMPORT_SUCCESS;

  constructor(public payload: any) {}
}

export class ContactImportFailure implements Action {
  readonly type = ContactsActionTypes.CONTACT_IMPORT_FAILURE;

  constructor(public payload: any) {}
}

export class ContactDecryptSuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_DECRYPT_SUCCESS;

  constructor(public payload: any) {}
}

export class GetEmailContacts implements Action {
  readonly type = ContactsActionTypes.GET_EMAIL_CONTACTS;

  constructor(public payload?: any) {}
}

export class GetEmailContactsSuccess implements Action {
  readonly type = ContactsActionTypes.GET_EMAIL_CONTACTS_SUCCESS;

  constructor(public payload: any) {}
}

export class ClearContactsToDecrypt implements Action {
  readonly type = ContactsActionTypes.CLEAR_CONTACTS_TO_DECRYPT;

  constructor(public payload?: any) {}
}

export class UpdateBatchContacts implements Action {
  readonly type = ContactsActionTypes.CONTACT_BATCH_UPDATE;

  constructor(public payload: any) {}
}

export class UpdateBatchContactsSuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_BATCH_UPDATE_SUCCESS;

  constructor(public payload?: any) {}
}

export class ContactFetchKeys implements Action {
  readonly type = ContactsActionTypes.CONTACT_FETCH_KEYS;

  constructor(public payload?: any) {}
}

export class ContactFetchKeysSuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_FETCH_KEYS_SUCCESS;

  constructor(public payload?: any) {}
}

export class ContactFetchKeysFailure implements Action {
  readonly type = ContactsActionTypes.CONTACT_FETCH_KEYS_FAILURE;

  constructor(public payload?: any) {}
}

export class ContactAddKeys implements Action {
  readonly type = ContactsActionTypes.CONTACT_ADD_KEYS;

  constructor(public payload?: any) {}
}

export class ContactAddKeysSuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_ADD_KEYS_SUCCESS;

  constructor(public payload?: any) {}
}

export class ContactAddKeysFailure implements Action {
  readonly type = ContactsActionTypes.CONTACT_ADD_KEYS_FAILURE;

  constructor(public payload?: any) {}
}

export class ContactRemoveKeys implements Action {
  readonly type = ContactsActionTypes.CONTACT_REMOVE_KEYS;

  constructor(public payload?: any) {}
}

export class ContactRemoveKeysSuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_REMOVE_KEYS_SUCCESS;

  constructor(public payload?: any) {}
}

export class ContactRemoveKeysFailure implements Action {
  readonly type = ContactsActionTypes.CONTACT_REMOVE_KEYS_FAILURE;

  constructor(public payload?: any) {}
}

export type ContactsActionAll =
  | ContactsGet
  | ContactGetSuccess
  | ContactGetFailure
  | ContactAdd
  | ContactAddSuccess
  | ContactAddError
  | ContactDelete
  | ContactDeleteSuccess
  | ContactImport
  | ContactImportSuccess
  | ContactImportFailure
  | ContactDecryptSuccess
  | GetEmailContacts
  | GetEmailContactsSuccess
  | ClearContactsToDecrypt
  | UpdateBatchContacts
  | UpdateBatchContactsSuccess
  | ContactNotify
  | ContactNotifySuccess
  | ContactNotifyFailure
  | ContactFetchKeys
  | ContactFetchKeysSuccess
  | ContactFetchKeysFailure
  | ContactAddKeys
  | ContactAddKeysSuccess
  | ContactAddKeysFailure
  | ContactRemoveKeys
  | ContactRemoveKeysSuccess
  | ContactRemoveKeysFailure;
