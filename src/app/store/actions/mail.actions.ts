// Ngrx
import { Action } from '@ngrx/store';


export enum MailActionTypes {
  GET_MAILS = '[Mail] GET_MAILS',
  GET_MAILS_SUCCESS = '[Mail] GET_MAILS_SUCCESS',
  GET_UNREAD_MAILS_COUNT = '[Unread Mail Count] GET_UNREAD_MAILS_COUNT',
  GET_UNREAD_MAILS_COUNT_SUCCESS = '[Unread Mail Count] GET_UNREAD_MAILS_COUNT_SUCCESS',
  STOP_GETTING_UNREAD_MAILS_COUNT = '[STOP getting unread mails] STOP_GETTING_UNREAD_MAILS_COUNT',
  GET_MAILBOXES = '[Mail] GET_MAILBOXES',
  GET_MAILBOXES_SUCCESS = '[Mail] GET_MAILBOXES_SUCCESS',
  GET_MAIL_DETAIL = '[Mail] GET_MAIL_DETAIL',
  CLEAR_MAIL_DETAIL = '[Mail] CLEAR_MAIL_DETAIL',
  GET_MAIL_DETAIL_SUCCESS = '[Mail] GET_MAIL_DETAIL_SUCCESS',
  UPDATE_MAIL_DETAIL_CHILDREN = '[Mail] UPDATE_MAIL_DETAIL_CHILDREN',
  MOVE_MAIL = '[Mail] MOVE',
  MOVE_MAIL_SUCCESS = '[Mail] MOVE SUCCESS',
  DELETE_MAIL = '[Mail] DELETE',
  DELETE_MAIL_SUCCESS = '[Mail] DELETE SUCCESS',
  READ_MAIL = '[Mail] READ_MAIL',
  READ_MAIL_SUCCESS = '[Mail] READ_MAIL SUCCESS',
  STAR_MAIL = '[Mail] STAR_MAIL',
  STAR_MAIL_SUCCESS = '[Mail] STAR_MAIL SUCCESS',
  SET_DECRYPT_INPROGRESS = '[DECRYPT] SET INPROGRESS STATUS',
  SET_DECRYPTED_KEY = '[DECRYPTED] SET KEY',
  SET_CURRENT_MAILBOX = '[MAILBOX] SET CURRENTLY SELECTED',
  UNDO_DELETE_MAIL = '[Mail] UNDO DELETE DRAFT MAIL',
  UNDO_DELETE_MAIL_SUCCESS = '[Mail] UNDO DELETE DRAFT MAIL SUCCESS',
  SET_CURRENT_FOLDER = '[FOLDER] SET CURRENT',
  UPDATE_PGP_DECRYPTED_CONTENT = '[PGP] UPDATE PGP DECRYPTED CONTENT',
  UPDATE_CURRENT_FOLDER = '[FOLDER] UPDATE CURRENT FOLDER',
  MAILBOX_SETTINGS_UPDATE = '[MAILBOX SETTINGS] UPDATE',
  MAILBOX_SETTINGS_UPDATE_SUCCESS = '[MAILBOX SETTINGS] UPDATE SUCCESS',
  CREATE_MAILBOX = '[MAILBOX] CREATE MAILBOX',
  CREATE_MAILBOX_SUCCESS = '[MAILBOX] CREATE MAILBOX SUCCESS',
  CREATE_MAILBOX_FAILURE = '[MAILBOX] CREATE MAILBOX FAILURE',
  SET_DEFAULT_MAILBOX = '[MAILBOX] SET DEFAULT MAILBOX',
  SET_DEFAULT_MAILBOX_SUCCESS = '[MAILBOX] SET DEFAULT MAILBOX SUCCESS',
  UPDATE_MAILBOX_ORDER = '[MAILBOX] UPDATE ORDER',
  UPDATE_MAILBOX_ORDER_SUCCESS = '[MAILBOX] UPDATE ORDER SUCCESS',
  EMPTY_TRASH = '[Mail] EMPTY TRASH',
  EMPTY_TRASH_SUCCESS = '[Mail] EMPTY TRASH SUCCESS',
  EMPTY_TRASH_FAILURE = '[Mail] EMPTY TRASH FAILURE',
}

export class GetMails implements Action {
  readonly type = MailActionTypes.GET_MAILS;

  constructor(public payload: any) {}
}

export class GetMailsSuccess implements Action {
  readonly type = MailActionTypes.GET_MAILS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetUnreadMailsCount implements Action {
  readonly type = MailActionTypes.GET_UNREAD_MAILS_COUNT;

  constructor(public payload?: any) {}
}

export class GetUnreadMailsCountSuccess implements Action {
  readonly type = MailActionTypes.GET_UNREAD_MAILS_COUNT_SUCCESS;

  constructor(public payload: any) {}
}

export class StopGettingUnreadMailsCount implements Action {
  readonly type = MailActionTypes.STOP_GETTING_UNREAD_MAILS_COUNT;

  constructor(public payload?: any) {}
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

export class UpdateMailDetailChildren implements Action {
  readonly type = MailActionTypes.UPDATE_MAIL_DETAIL_CHILDREN;

  constructor(public payload: any) {}
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

export class UndoDeleteMail implements Action {
  readonly type = MailActionTypes.UNDO_DELETE_MAIL;

  constructor(public payload?: any) {}
}

export class UndoDeleteMailSuccess implements Action {
  readonly type = MailActionTypes.UNDO_DELETE_MAIL_SUCCESS;

  constructor(public payload?: any) {}
}

export class SetCurrentFolder implements Action {
  readonly type = MailActionTypes.SET_CURRENT_FOLDER;

  constructor(public payload: any) {}
}

export class UpdatePGPDecryptedContent implements Action {
  readonly type = MailActionTypes.UPDATE_PGP_DECRYPTED_CONTENT;

  constructor(public payload: any) {}
}

export class UpdateCurrentFolder implements Action {
  readonly type = MailActionTypes.UPDATE_CURRENT_FOLDER;

  constructor(public payload: any) {}
}

export class MailboxSettingsUpdate implements Action {
  readonly type = MailActionTypes.MAILBOX_SETTINGS_UPDATE;

  constructor(public payload: any) {}
}

export class MailboxSettingsUpdateSuccess implements Action {
  readonly type = MailActionTypes.MAILBOX_SETTINGS_UPDATE_SUCCESS;

  constructor(public payload: any) {}
}

export class CreateMailbox implements Action {
  readonly type = MailActionTypes.CREATE_MAILBOX;

  constructor(public payload: any) {}
}

export class CreateMailboxSuccess implements Action {
  readonly type = MailActionTypes.CREATE_MAILBOX_SUCCESS;

  constructor(public payload: any) {}
}

export class CreateMailboxFailure implements Action {
  readonly type = MailActionTypes.CREATE_MAILBOX_FAILURE;

  constructor(public payload: any) {}
}

export class SetDefaultMailbox implements Action {
  readonly type = MailActionTypes.SET_DEFAULT_MAILBOX;

  constructor(public payload: any) {
  }
}

export class SetDefaultMailboxSuccess implements Action {
  readonly type = MailActionTypes.SET_DEFAULT_MAILBOX_SUCCESS;

  constructor(public payload: any) {
  }
}

export class UpdateMailboxOrder implements Action {
  readonly type = MailActionTypes.UPDATE_MAILBOX_ORDER;

  constructor(public payload: any) {
  }
}

export class UpdateMailboxOrderSuccess implements Action {
  readonly type = MailActionTypes.UPDATE_MAILBOX_ORDER_SUCCESS;

  constructor(public payload: any) {
  }
}

export class EmptyTrash implements Action {
  readonly type = MailActionTypes.EMPTY_TRASH;

  constructor(public payload?: any) {
  }
}

export class EmptyTrashSuccess implements Action {
  readonly type = MailActionTypes.EMPTY_TRASH_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class EmptyTrashFailure implements Action {
  readonly type = MailActionTypes.EMPTY_TRASH_FAILURE;

  constructor(public payload: any) {
  }
}

export type MailActions =
  | GetMails
  | GetMailsSuccess
  | GetUnreadMailsCount
  | GetUnreadMailsCountSuccess
  | StopGettingUnreadMailsCount
  | GetMailboxes
  | GetMailboxesSuccess
  | GetMailDetail
  | ClearMailDetail
  | GetMailDetailSuccess
  | UpdateMailDetailChildren
  | MoveMail
  | MoveMailSuccess
  | DeleteMail
  | DeleteMailSuccess
  | ReadMail
  | ReadMailSuccess
  | StarMail
  | StarMailSuccess
  | SetDecryptInProgress
  | SetDecryptedKey
  | SetCurrentMailbox
  | UndoDeleteMail
  | UndoDeleteMailSuccess
  | SetCurrentFolder
  | UpdatePGPDecryptedContent
  | UpdateCurrentFolder
  | MailboxSettingsUpdate
  | MailboxSettingsUpdateSuccess
  | CreateMailbox
  | CreateMailboxSuccess
  | CreateMailboxFailure
  | SetDefaultMailbox
  | SetDefaultMailboxSuccess
  | UpdateMailboxOrder
  | UpdateMailboxOrderSuccess
  | EmptyTrash
  | EmptyTrashSuccess
  | EmptyTrashFailure;
