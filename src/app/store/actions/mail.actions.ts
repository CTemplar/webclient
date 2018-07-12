// Ngrx
import { Action } from '@ngrx/store';


export enum MailActionTypes {
  GET_MAILS = '[Mail] GET_MAILS',
  GET_MAILS_SUCCESS = '[Mail] GET_MAILS_SUCCESS',
  GET_MAILBOXES = '[Mail] GET_MAILBOXES',
  GET_MAILBOXES_SUCCESS = '[Mail] GET_MAILBOXES_SUCCESS',
  CREATE_MAIL = '[Mail] CREATE',
  CREATE_MAIL_SUCCESS = '[Mail] CREATE SUCCESS',
  UPDATE_LOCAL_DRAFT = '[Mail] UPDATE LOCAL DRAFT',
  CLOSE_MAILBOX = '[Mailbox] CLOSE',
  DELETE_MAIL = '[Mail] DELETE',
  DELETE_MAIL_SUCCESS = '[Mail] DELETE SUCCESS',
  SEND_MAIL = '[Mail] SEND_MAIL',
  SEND_MAIL_SUCCESS = '[Mail] SEND_MAIL SUCCESS',
  SET_DECRYPT_INPROGRESS = '[DECRYPT] SET INPROGRESS STATUS',
  SET_DECRYPTED_KEY = '[DECRYPTED] SET KEY',
  SET_CURRENT_MAILBOX = '[MAILBOX] SET CURRENTLY SELECTED',
  UPDATE_PGP_CONTENT = '[PGP] UPDATE ENCRYPTED, DECRYPTED CONTENT',
}

export class GetMails implements Action {
  readonly type = MailActionTypes.GET_MAILS;

  constructor(public payload: any) {}
}

export class GetMailsSuccess implements Action {
  readonly type = MailActionTypes.GET_MAILS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetMailboxes implements Action {
  readonly type = MailActionTypes.GET_MAILBOXES;

  constructor(public payload: any = {}) {}
}

export class GetMailboxesSuccess implements Action {
  readonly type = MailActionTypes.GET_MAILBOXES_SUCCESS;

  constructor(public payload: any) {}
}

export class CreateMail implements Action {
  readonly type = MailActionTypes.CREATE_MAIL;

  constructor(public payload: any) {}
}

export class CreateMailSuccess implements Action {
  readonly type = MailActionTypes.CREATE_MAIL_SUCCESS;

  constructor(public payload: any) {}
}

export class UpdateLocalDraft implements Action {
  readonly type = MailActionTypes.UPDATE_LOCAL_DRAFT;

  constructor(public payload: any) {}
}

export class CloseMailbox implements Action {
  readonly type = MailActionTypes.CLOSE_MAILBOX;

  constructor(public payload?: any) {}
}

export class DeleteMail implements Action {
  readonly type = MailActionTypes.DELETE_MAIL;

  constructor(public payload: any) {}
}

export class DeleteMailSuccess implements Action {
  readonly type = MailActionTypes.DELETE_MAIL_SUCCESS;

  constructor(public payload?: any) {}
}

export class SendMail implements Action {
  readonly type = MailActionTypes.SEND_MAIL;

  constructor(public payload: any) {}
}

export class SendMailSuccess implements Action {
  readonly type = MailActionTypes.SEND_MAIL_SUCCESS;

  constructor(public payload?: any) {}
}

export class SetDecryptInProgress implements Action {
  readonly type = MailActionTypes.SET_DECRYPT_INPROGRESS;

  constructor(public payload?: any) {}
}

export class SetDecryptedKey implements Action {
  readonly type = MailActionTypes.SET_DECRYPTED_KEY;

  constructor(public payload?: any) {}
}

export class SetCurrentMailbox implements Action {
  readonly type = MailActionTypes.SET_CURRENT_MAILBOX;

  constructor(public payload?: any) {}
}

export class UpdatePGPContent implements Action {
  readonly type = MailActionTypes.UPDATE_PGP_CONTENT;

  constructor(public payload?: any) {}
}


export type MailActions =
  | GetMails
  | GetMailsSuccess
  | GetMailboxes
  | GetMailboxesSuccess
  | CreateMail
  | CreateMailSuccess
  | UpdateLocalDraft
  | CloseMailbox
  | DeleteMail
  | DeleteMailSuccess
  | SendMail
  | SendMailSuccess
  | SetDecryptInProgress
  | SetDecryptedKey
  | SetCurrentMailbox
  | UpdatePGPContent;
