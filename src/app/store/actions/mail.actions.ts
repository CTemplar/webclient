// Ngrx
import { Action } from '@ngrx/store';


export enum MailActionTypes {
  GET_MAILS = '[Mail] GET_MAILS',
  GET_MAILS_SUCCESS = '[Mail] GET_MAILS_SUCCESS',
  GET_MAILBOXES = '[Mail] GET_MAILBOXES',
  GET_MAILBOXES_SUCCESS = '[Mail] GET_MAILBOXES_SUCCESS',
  GET_MAIL_DETAIL = '[Mail] GET_MAIL_DETAIL',
  CLEAR_MAIL_DETAIL = '[Mail] CLEAR_MAIL_DETAIL',
  GET_MAIL_DETAIL_SUCCESS = '[Mail] GET_MAIL_DETAIL_SUCCESS',
  CREATE_MAIL = '[Mail] CREATE',
  CREATE_MAIL_SUCCESS = '[Mail] CREATE SUCCESS',
  UPDATE_LOCAL_DRAFT = '[Mail] UPDATE LOCAL DRAFT',
  CLOSE_MAILBOX = '[Mailbox] CLOSE',
  MOVE_MAIL = '[Mail] MOVE',
  MOVE_MAIL_SUCCESS = '[Mail] MOVE SUCCESS',
  DELETE_MAIL = '[Mail] DELETE',
  DELETE_MAIL_SUCCESS = '[Mail] DELETE SUCCESS',
  SEND_MAIL = '[Mail] SEND_MAIL',
  SEND_MAIL_SUCCESS = '[Mail] SEND_MAIL SUCCESS',
  READ_MAIL = '[Mail] READ_MAIL',
  READ_MAIL_SUCCESS = '[Mail] READ_MAIL SUCCESS',
  STAR_MAIL = '[Mail] STAR_MAIL',
  STAR_MAIL_SUCCESS = '[Mail] STAR_MAIL SUCCESS',
  SET_DECRYPT_INPROGRESS = '[DECRYPT] SET INPROGRESS STATUS',
  SET_DECRYPTED_KEY = '[DECRYPTED] SET KEY',
  SET_CURRENT_MAILBOX = '[MAILBOX] SET CURRENTLY SELECTED',
  UPDATE_PGP_CONTENT = '[PGP] UPDATE ENCRYPTED, DECRYPTED CONTENT',
  UNDO_DELETE_MAIL = '[Mail] UNDO DELETE DRAFT MAIL',
  UNDO_DELETE_MAIL_SUCCESS = '[Mail] UNDO DELETE DRAFT MAIL SUCCESS',
  UPLOAD_ATTACHMENT = '[Attachment] UPLOAD_ATTACHMENT',
  UPLOAD_ATTACHMENT_PROGRESS = '[Attachment] UPLOAD_ATTACHMENT_PROGRESS',
  UPLOAD_ATTACHMENT_REQUEST = '[Attachment] UPLOAD_ATTACHMENT_REQUEST',
  UPLOAD_ATTACHMENT_SUCCESS = '[Attachment] UPLOAD_ATTACHMENT_SUCCESS',
  DELETE_ATTACHMENT = '[Attachment] DELETE_ATTACHMENT',
  DELETE_ATTACHMENT_SUCCESS = '[Attachment] DELETE_ATTACHMENT_SUCCESS',
  SET_FOLDERS = '[MAILBOX] SET FOLDERS',
  CREATE_FOLDER = '[MAILBOX] CREATE FOLDER',
  CREATE_FOLDER_SUCCESS = '[MAILBOX] CREATE FOLDER SUCCESS',
  SET_CURRENT_FOLDER = '[FOLDER] SET CURRENT',
  GET_USERS_KEYS = '[USERS] GET KEYS',
  GET_USERS_KEYS_SUCCESS = '[USERS] GET KEYS SUCCESS',
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

export class GetMailDetail implements Action {
  readonly type = MailActionTypes.GET_MAIL_DETAIL;

  constructor(public payload: any) {}
}

export class ClearMailDetail implements Action {
  readonly type = MailActionTypes.CLEAR_MAIL_DETAIL;

  constructor(public payload?: any) {}
}


export class GetMailDetailSuccess implements Action {
  readonly type = MailActionTypes.GET_MAIL_DETAIL_SUCCESS;

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


export class MoveMail implements Action {
  readonly type = MailActionTypes.MOVE_MAIL;

  constructor(public payload: any) {}
}

export class MoveMailSuccess implements Action {
  readonly type = MailActionTypes.MOVE_MAIL_SUCCESS;

  constructor(public payload: any) {}
}

export class DeleteMail implements Action {
  readonly type = MailActionTypes.DELETE_MAIL;

  constructor(public payload: any) {}
}

export class ReadMail implements Action {
  readonly type = MailActionTypes.READ_MAIL;

  constructor(public payload: any) {}
}

export class ReadMailSuccess implements Action {
  readonly type = MailActionTypes.READ_MAIL_SUCCESS;

  constructor(public payload: any) {}
}

export class StarMail implements Action {
  readonly type = MailActionTypes.STAR_MAIL;

  constructor(public payload: any) {}
}

export class StarMailSuccess implements Action {
  readonly type = MailActionTypes.STAR_MAIL_SUCCESS;

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

export class UndoDeleteMail implements Action {
  readonly type = MailActionTypes.UNDO_DELETE_MAIL;

  constructor(public payload?: any) {}
}

export class UndoDeleteMailSuccess implements Action {
  readonly type = MailActionTypes.UNDO_DELETE_MAIL_SUCCESS;

  constructor(public payload?: any) {}
}

export class UploadAttachment implements Action {
  readonly type = MailActionTypes.UPLOAD_ATTACHMENT;

  constructor(public payload: any) {}
}

export class UploadAttachmentProgress implements Action {
  readonly type = MailActionTypes.UPLOAD_ATTACHMENT_PROGRESS;

  constructor(public payload: any) {}
}

export class UploadAttachmentRequest implements Action {
  readonly type = MailActionTypes.UPLOAD_ATTACHMENT_REQUEST;

  constructor(public payload: any) {}
}

export class UploadAttachmentSuccess implements Action {
  readonly type = MailActionTypes.UPLOAD_ATTACHMENT_SUCCESS;

  constructor(public payload?: any) {}
}

export class DeleteAttachment implements Action {
  readonly type = MailActionTypes.DELETE_ATTACHMENT;

  constructor(public payload: any) {}
}

export class DeleteAttachmentSuccess implements Action {
  readonly type = MailActionTypes.DELETE_ATTACHMENT_SUCCESS;

  constructor(public payload: any) {}
}

export class SetFolders implements Action {
  readonly type = MailActionTypes.SET_FOLDERS;

  constructor(public payload: any) {}
}

export class CreateFolder implements Action {
  readonly type = MailActionTypes.CREATE_FOLDER;

  constructor(public payload: any) {}
}

export class CreateFolderSuccess implements Action {
  readonly type = MailActionTypes.CREATE_FOLDER_SUCCESS;

  constructor(public payload: any) {}
}

export class SetCurrentFolder implements Action {
  readonly type = MailActionTypes.SET_CURRENT_FOLDER;

  constructor(public payload: any) {}
}

export class GetUsersKeys implements Action {
  readonly type = MailActionTypes.GET_USERS_KEYS;

  constructor(public payload: any) {}
}

export class GetUsersKeysSuccess implements Action {
  readonly type = MailActionTypes.GET_USERS_KEYS_SUCCESS;

  constructor(public payload: any) {}
}

export type MailActions =
  | GetMails
  | GetMailsSuccess
  | GetMailboxes
  | GetMailboxesSuccess
  | GetMailDetail
  | ClearMailDetail
  | GetMailDetailSuccess
  | CreateMail
  | CreateMailSuccess
  | UpdateLocalDraft
  | CloseMailbox
  | MoveMail
  | MoveMailSuccess
  | DeleteMail
  | DeleteMailSuccess
  | SendMail
  | SendMailSuccess
  | ReadMail
  | ReadMailSuccess
  | StarMail
  | StarMailSuccess
  | SetDecryptInProgress
  | SetDecryptedKey
  | SetCurrentMailbox
  | UpdatePGPContent
  | UndoDeleteMail
  | UndoDeleteMailSuccess
  | UploadAttachment
  | UploadAttachmentProgress
  | UploadAttachmentRequest
  | UploadAttachmentSuccess
  | DeleteAttachment
  | DeleteAttachmentSuccess
  | SetFolders
  | CreateFolder
  | CreateFolderSuccess
  | SetCurrentFolder
  | GetUsersKeys
  | GetUsersKeysSuccess;
