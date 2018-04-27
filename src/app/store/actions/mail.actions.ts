// Ngrx
import { Action } from '@ngrx/store';


export enum MailActionTypes {
  GET_MAILS = '[Mail] GET_MAILS',
  GET_MAILS_SUCCESS = '[Mail] GET_MAILS_SUCCESS',
  SEND_MAIL = '[Mail] SEND_MAIL'
}

export class GetMails implements Action {
  readonly type = MailActionTypes.GET_MAILS;
  constructor(public payload: any) {}
}

export class GetMailsSuccess implements Action {
  readonly type = MailActionTypes.GET_MAILS_SUCCESS;
  constructor(public payload: any) {}
}

export class SendMail implements Action {
  readonly type = MailActionTypes.SEND_MAIL;
  constructor(public payload: any) {}
}


export type MailActionAll =
  | GetMails
  | GetMailsSuccess
  | SendMail;
