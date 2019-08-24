// Ngrx
import { Action } from '@ngrx/store';

export enum ContactsActionTypes {
  CONTACT_GET = '[Contacts] ContactGet GET',
  CONTACT_GET_SUCCESS = '[Contacts] Contact_GET_Success',
  CONTACT_ADD = '[Contacts] Contact_Add',
  CONTACT_ADD_SUCCESS = '[Contacts] Contact_Add_Success',
  CONTACT_ADD_ERROR = '[Contacts] Contact_Add_Error',
  CONTACT_DELETE = '[Contacts] Contact_Delete',
  CONTACT_DELETE_SUCCESS = '[Contacts] Contact_Delete_Success',
  CONTACT_IMPORT = '[Contacts] Contact Import',
  CONTACT_IMPORT_SUCCESS = '[Contacts] Contact Import Success',
  CONTACT_IMPORT_FAILURE = '[Contacts] Contact Import Failure',
  CONTACT_DECRYPT_SUCCESS = '[Contacts] Contact_Decrypt_Success',
  GET_EMAIL_CONTACTS = '[USER] GET EMAIL CONTACTS',
  GET_EMAIL_CONTACTS_SUCCESS = '[USER] GET EMAIL CONTACTS SUCCESS',
}


export class ContactsGet implements Action {
  readonly type = ContactsActionTypes.CONTACT_GET;

  constructor(public payload: any = {}) {
  }
}

export class ContactGetSuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_GET_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ContactAdd implements Action {
  readonly type = ContactsActionTypes.CONTACT_ADD;

  constructor(public payload: any) {
  }
}

export class ContactAddSuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_ADD_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ContactAddError implements Action {
  readonly type = ContactsActionTypes.CONTACT_ADD_ERROR;

  constructor(public payload?: any) {
  }
}

export class ContactDelete implements Action {
  readonly type = ContactsActionTypes.CONTACT_DELETE;

  constructor(public payload: any) {
  }
}

export class ContactDeleteSuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_DELETE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ContactImport implements Action {
  readonly type = ContactsActionTypes.CONTACT_IMPORT;

  constructor(public payload: any) {
  }
}

export class ContactImportSuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_IMPORT_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ContactImportFailure implements Action {
  readonly type = ContactsActionTypes.CONTACT_IMPORT_FAILURE;

  constructor(public payload: any) {
  }
}


export class ContactDecryptSuccess implements Action {
  readonly type = ContactsActionTypes.CONTACT_DECRYPT_SUCCESS;

  constructor(public payload: any) {
  }
}

export class GetEmailContacts implements Action {
  readonly type = ContactsActionTypes.GET_EMAIL_CONTACTS;

  constructor(public payload?: any) {
  }
}

export class GetEmailContactsSuccess implements Action {
  readonly type = ContactsActionTypes.GET_EMAIL_CONTACTS_SUCCESS;

  constructor(public payload: any) {
  }
}

export type ContactsActionAll =
  | ContactsGet
  | ContactGetSuccess
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
  | GetEmailContactsSuccess;
