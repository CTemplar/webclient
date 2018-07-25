// Ngrx
import { Action } from '@ngrx/store';

export enum ComposeMailActionTypes {
  CREATE_MAIL = '[Mail] CREATE',
  CREATE_MAIL_SUCCESS = '[Mail] CREATE SUCCESS',
  SEND_MAIL = '[Mail] SEND_MAIL',
  SEND_MAIL_SUCCESS = '[Mail] SEND_MAIL SUCCESS',
  UPDATE_LOCAL_DRAFT = '[Mail] UPDATE LOCAL DRAFT',
  CLOSE_MAILBOX = '[Mailbox] CLOSE',
  UPDATE_PGP_ENCRYPTED_CONTENT = '[PGP] UPDATE PGP ENCRYPTED CONTENT',
  UPLOAD_ATTACHMENT = '[Attachment] UPLOAD_ATTACHMENT',
  UPLOAD_ATTACHMENT_PROGRESS = '[Attachment] UPLOAD_ATTACHMENT_PROGRESS',
  UPLOAD_ATTACHMENT_REQUEST = '[Attachment] UPLOAD_ATTACHMENT_REQUEST',
  UPLOAD_ATTACHMENT_SUCCESS = '[Attachment] UPLOAD_ATTACHMENT_SUCCESS',
  DELETE_ATTACHMENT = '[Attachment] DELETE_ATTACHMENT',
  DELETE_ATTACHMENT_SUCCESS = '[Attachment] DELETE_ATTACHMENT_SUCCESS',
  GET_USERS_KEYS = '[USERS] GET KEYS',
  GET_USERS_KEYS_SUCCESS = '[USERS] GET KEYS SUCCESS',
  NEW_DRAFT = '[DraftState] NEW_DRAFT',
  CLEAR_DRAFT = '[DRAFT] CLEAR'
}

export class CreateMail implements Action {
  readonly type = ComposeMailActionTypes.CREATE_MAIL;

  constructor(public payload: any) {
  }
}

export class CreateMailSuccess implements Action {
  readonly type = ComposeMailActionTypes.CREATE_MAIL_SUCCESS;

  constructor(public payload: any) {
  }
}

export class UpdateLocalDraft implements Action {
  readonly type = ComposeMailActionTypes.UPDATE_LOCAL_DRAFT;

  constructor(public payload: any) {
  }
}

export class CloseMailbox implements Action {
  readonly type = ComposeMailActionTypes.CLOSE_MAILBOX;

  constructor(public payload?: any) {
  }
}

export class SendMail implements Action {
  readonly type = ComposeMailActionTypes.SEND_MAIL;

  constructor(public payload: any) {
  }
}

export class SendMailSuccess implements Action {
  readonly type = ComposeMailActionTypes.SEND_MAIL_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdatePGPEncryptedContent implements Action {
  readonly type = ComposeMailActionTypes.UPDATE_PGP_ENCRYPTED_CONTENT;

  constructor(public payload?: any) {
  }
}

export class UploadAttachment implements Action {
  readonly type = ComposeMailActionTypes.UPLOAD_ATTACHMENT;

  constructor(public payload: any) {
  }
}

export class UploadAttachmentProgress implements Action {
  readonly type = ComposeMailActionTypes.UPLOAD_ATTACHMENT_PROGRESS;

  constructor(public payload: any) {
  }
}

export class UploadAttachmentRequest implements Action {
  readonly type = ComposeMailActionTypes.UPLOAD_ATTACHMENT_REQUEST;

  constructor(public payload: any) {
  }
}

export class UploadAttachmentSuccess implements Action {
  readonly type = ComposeMailActionTypes.UPLOAD_ATTACHMENT_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class DeleteAttachment implements Action {
  readonly type = ComposeMailActionTypes.DELETE_ATTACHMENT;

  constructor(public payload: any) {
  }
}

export class DeleteAttachmentSuccess implements Action {
  readonly type = ComposeMailActionTypes.DELETE_ATTACHMENT_SUCCESS;

  constructor(public payload: any) {
  }
}

export class GetUsersKeys implements Action {
  readonly type = ComposeMailActionTypes.GET_USERS_KEYS;

  constructor(public payload: any) {
  }
}

export class GetUsersKeysSuccess implements Action {
  readonly type = ComposeMailActionTypes.GET_USERS_KEYS_SUCCESS;

  constructor(public payload: any) {
  }
}

export class NewDraft implements Action {
  readonly type = ComposeMailActionTypes.NEW_DRAFT;

  constructor(public payload: any) {
  }
}

export class ClearDraft implements Action {
  readonly type = ComposeMailActionTypes.CLEAR_DRAFT;

  constructor(public payload: any) {
  }
}

export type ComposeMailActions =
  | CreateMail
  | CreateMailSuccess
  | UpdateLocalDraft
  | CloseMailbox
  | SendMail
  | SendMailSuccess
  | UpdatePGPEncryptedContent
  | UploadAttachment
  | UploadAttachmentProgress
  | UploadAttachmentRequest
  | UploadAttachmentSuccess
  | DeleteAttachment
  | DeleteAttachmentSuccess
  | GetUsersKeys
  | GetUsersKeysSuccess
  | NewDraft
  | ClearDraft;
