import { Action } from '@ngrx/store';

export enum SecureMessageActionTypes {
  GET_MESSAGE = '[Mail] GET MESSAGE',
  GET_MESSAGE_SUCCESS = '[Mail] GET MESSAGE SUCCESS',
  GET_MESSAGE_FAILURE = '[Mail] GET MESSAGE FAILURE',
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

export type SecureMessageActions =
  | GetMessage
  | GetMessageSuccess
  | GetMessageFailure;
