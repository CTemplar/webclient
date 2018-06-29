// Ngrx
import { Action } from '@ngrx/store';


export enum MailActionTypes {
  GET_MAILS = '[Mail] GET_MAILS',
  GET_MAILS_SUCCESS = '[Mail] GET_MAILS_SUCCESS',
  CREATE_MAIL = '[Mail] CREATE',
  CREATE_MAIL_SUCCESS = '[Mail] CREATE SUCCESS',
  DELETE_MAIL = '[Mail] DELETE',
  DELETE_MAIL_SUCCESS = '[Mail] DELETE SUCCESS',
  SEND_MAIL = '[Mail] SEND_MAIL',
  SEND_MAIL_SUCCESS = '[Mail] SEND_MAIL SUCCESS'
}

export class GetMails implements Action {
  readonly type = MailActionTypes.GET_MAILS;

  constructor(public payload: any) {}
}

export class GetMailsSuccess implements Action {
  readonly type = MailActionTypes.GET_MAILS_SUCCESS;

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


export type MailActions =
  | GetMails
  | GetMailsSuccess
  | CreateMail
  | CreateMailSuccess
  | DeleteMail
  | DeleteMailSuccess
  | SendMail
  | SendMailSuccess;
