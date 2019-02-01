// Angular
import { Injectable } from '@angular/core';
// Ngrx
import { Actions, Effect } from '@ngrx/effects';





// Rxjs
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
// Services
import { MailService } from '../../store/services';
// Custom Actions
import {
  CreateMail,
  DeleteMailSuccess,
  GetMailDetail,
  GetMailDetailSuccess,
  GetMails,
  GetMailsSuccess,
  MailActionTypes,
  MoveMail,
  MoveMailSuccess,
  ReadMail,
  ReadMailSuccess,
  SnackErrorPush,
  SnackPush,
  StarMailSuccess,
  UndoDeleteMail,
  UndoDeleteMailSuccess, AccountDetailsGet, DeleteFolder, GetUnreadMailsCount, GetUnreadMailsCountSuccess
} from '../actions';
import { MailFolderType } from '../models';

@Injectable()
export class MailEffects {

  constructor(private actions: Actions,
              private mailService: MailService) {
  }

  @Effect()
  getMailsEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.GET_MAILS)
    .map((action: GetMails) => action.payload)
    .switchMap(payload => {
      return this.mailService.getMessages(payload)
      .pipe(
        map((response) => {
          return new GetMailsSuccess({ ...payload, mails: response['results'], total_mail_count: response['total_count'] });
        }),
        catchError((error) => [])
      );
    });


  @Effect()
  getUnreadMailsCountEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.GET_UNREAD_MAILS_COUNT)
    .map((action: GetUnreadMailsCount) => action.payload)
    .switchMap(payload => {
      return this.mailService.getUnreadMailsCount()
      .pipe(
        map((response) => {
          return new GetUnreadMailsCountSuccess(response);
        }),
        catchError((error) => [])
      );
    });

  @Effect()
  moveMailEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.MOVE_MAIL)
    .map((action: MoveMail) => action.payload)
    .switchMap(payload => {
      return this.mailService.moveMail(payload.ids, payload.folder)
        .pipe(
          switchMap(res => {

            const updateFolderActions = [];

            if (payload.shouldDeleteFolder) {
              updateFolderActions.push(new DeleteFolder(payload.folderToDelete));
            }

            updateFolderActions.push(new MoveMailSuccess(payload));
            if (!payload.shouldDeleteFolder) {
              updateFolderActions.push(new SnackPush({
                message: `Mail moved to ${payload.folder}`,
                ids: payload.ids,
                folder: payload.folder,
                sourceFolder: payload.sourceFolder,
                mail: payload.mail,
                allowUndo: payload.allowUndo
              }));
            }
            if (payload.folder === MailFolderType.SPAM) {
              updateFolderActions.push(new AccountDetailsGet());
            }

            return updateFolderActions;

          }),
          catchError(err => [new SnackErrorPush({ message: `Failed to move mail to ${payload.folder}.` })])
        );
    });

  @Effect()
  deleteMailEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.DELETE_MAIL)
    .map((action: CreateMail) => action.payload)
    .switchMap(payload => {
      return this.mailService.deleteMails(payload.ids)
        .pipe(
          switchMap(res => {
            return [
              new DeleteMailSuccess(payload)
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to delete mail.' })])
        );
    });

  @Effect()
  readMailEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.READ_MAIL)
    .map((action: ReadMail) => action.payload)
    .switchMap(payload => {
      return this.mailService.markAsRead(payload.ids, payload.read)
        .pipe(
          switchMap(res => {
            return [
              new ReadMailSuccess(payload)
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to mark mail as read.' })])
        );
    });

  @Effect()
  starMailEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.STAR_MAIL)
    .map((action: ReadMail) => action.payload)
    .mergeMap(payload => {
      return this.mailService.markAsStarred(payload.ids, payload.starred)
        .pipe(
          switchMap(res => {
            return [
              new StarMailSuccess(payload)
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to mark as starred.' })])
        );
    });

  @Effect()
  getMailDetailEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.GET_MAIL_DETAIL)
    .map((action: GetMailDetail) => action.payload)
    .switchMap(payload => {
      return this.mailService.getMessage(payload)
        .pipe(
          switchMap(res => {
            return [new GetMailDetailSuccess(res)];
          })
        );
    });

  @Effect()
  undoDeleteDraftMailEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.UNDO_DELETE_MAIL)
    .map((action: UndoDeleteMail) => action.payload)
    .switchMap(payload => {
      return this.mailService.moveMail(payload.ids, payload.sourceFolder)
        .pipe(
          switchMap(res => {
            return [
              new UndoDeleteMailSuccess(payload)
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: `Failed to move mail to ${payload.folder}.` })])
        );
    });

}
