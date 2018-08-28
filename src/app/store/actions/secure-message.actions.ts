import { Action } from '@ngrx/store';

export enum SecureMessageActionTypes {
  GET_MESSAGE = '[Mail] GET MESSAGE',
  GET_MESSAGE_SUCCESS = '[Mail] GET MESSAGE SUCCESS',
  GET_MESSAGE_FAILURE = '[Mail] GET MESSAGE FAILURE',
  UPDATE_SECURE_MESSAGE_KEY = '[Mail] UDATE SECURE MESSAGE KEY',
  UPDATE_SECURE_MESSAGE_CONTENT = '[Mail] UDATE SECURE MESSAGE CONTENT'
}

export class GetMessage implements Action {
  readonly type = SecureMessageActionTypes.GET_MESSAGE;

  constructor(public payload: any) {
  }
}

export class GetMessageSuccess implements Action {
  readonly type = SecureMessageActionTypes.GET_MESSAGE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class GetMessageFailure implements Action {
  readonly type = SecureMessageActionTypes.GET_MESSAGE_FAILURE;

  constructor(public payload: any) {
  }
}

export class UpdateSecureMessageKey implements Action {
  readonly type = SecureMessageActionTypes.UPDATE_SECURE_MESSAGE_KEY;

  constructor(public payload: any) {
  }
}

export class UpdateSecureMessageContent implements Action {
  readonly type = SecureMessageActionTypes.UPDATE_SECURE_MESSAGE_CONTENT;

  constructor(public payload: any) {
  }
}

export type SecureMessageActions =
  | GetMessage
  | GetMessageSuccess
  | GetMessageFailure
  | UpdateSecureMessageKey
  | UpdateSecureMessageContent;
