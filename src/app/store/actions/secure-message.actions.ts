import { Action } from '@ngrx/store';

export enum SecureMessageActionTypes {
  GET_MESSAGE = '[Mail] GET MESSAGE',
  GET_MESSAGE_SUCCESS = '[Mail] GET MESSAGE SUCCESS',
  GET_MESSAGE_FAILURE = '[Mail] GET MESSAGE FAILURE',
  UPDATE_SECURE_MESSAGE_KEY = '[Mail] UPDATE SECURE MESSAGE KEY',
  UPDATE_SECURE_MESSAGE_CONTENT = '[Mail] UPDATE SECURE MESSAGE CONTENT',
  UPDATE_SECURE_MESSAGE_ENCRYPTED_CONTENT = 'UPDATE_SECURE_MESSAGE_CONTENT',
  SEND_SECURE_MESSAGE_REPLY = '[Mail] SEND SECURE MESSAGE REPLY MAIL',
  SEND_SECURE_MESSAGE_REPLY_SUCCESS = '[Mail] SEND SECURE MESSAGE REPLY SUCCESS',
  SEND_SECURE_MESSAGE_REPLY_FAILURE = '[Mail] SEND SECURE MESSAGE REPLY FAILURE',
  GET_SECURE_MESSAGE_USERS_KEYS = '[USERS] GET SECURE MESSAGE USER KEYS',
  GET_SECURE_MESSAGE_USERS_KEYS_SUCCESS = '[USERS] GET SECURE MESSAGE USER KEYS SUCCESS'
}

export class GetMessage implements Action {
  readonly type = SecureMessageActionTypes.GET_MESSAGE;

  constructor(public payload: any) {}
}

export class GetMessageSuccess implements Action {
  readonly type = SecureMessageActionTypes.GET_MESSAGE_SUCCESS;

  constructor(public payload: any) {}
}

export class GetMessageFailure implements Action {
  readonly type = SecureMessageActionTypes.GET_MESSAGE_FAILURE;

  constructor(public payload: any) {}
}

export class UpdateSecureMessageKey implements Action {
  readonly type = SecureMessageActionTypes.UPDATE_SECURE_MESSAGE_KEY;

  constructor(public payload: any) {}
}

export class UpdateSecureMessageContent implements Action {
  readonly type = SecureMessageActionTypes.UPDATE_SECURE_MESSAGE_CONTENT;

  constructor(public payload: any) {}
}

export class UpdateSecureMessageEncryptedContent implements Action {
  readonly type = SecureMessageActionTypes.UPDATE_SECURE_MESSAGE_ENCRYPTED_CONTENT;

  constructor(public payload: any) {}
}

export class SendSecureMessageReply implements Action {
  readonly type = SecureMessageActionTypes.SEND_SECURE_MESSAGE_REPLY;

  constructor(public payload: any) {}
}

export class SendSecureMessageReplySuccess implements Action {
  readonly type = SecureMessageActionTypes.SEND_SECURE_MESSAGE_REPLY_SUCCESS;

  constructor(public payload: any) {}
}

export class SendSecureMessageReplyFailure implements Action {
  readonly type = SecureMessageActionTypes.SEND_SECURE_MESSAGE_REPLY_FAILURE;

  constructor(public payload: any) {}
}

export class GetSecureMessageUserKeys implements Action {
  readonly type = SecureMessageActionTypes.GET_SECURE_MESSAGE_USERS_KEYS;

  constructor(public payload: any) {}
}

export class GetSecureMessageUserKeysSuccess implements Action {
  readonly type = SecureMessageActionTypes.GET_SECURE_MESSAGE_USERS_KEYS_SUCCESS;

  constructor(public payload: any) {}
}

export type SecureMessageActions =
  | GetMessage
  | GetMessageSuccess
  | GetMessageFailure
  | UpdateSecureMessageKey
  | UpdateSecureMessageContent
  | UpdateSecureMessageEncryptedContent
  | SendSecureMessageReply
  | SendSecureMessageReplySuccess
  | SendSecureMessageReplyFailure
  | GetSecureMessageUserKeys
  | GetSecureMessageUserKeysSuccess;
