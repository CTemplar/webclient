// Angular
import { Injectable } from '@angular/core';
// Ngrx
import { Actions, Effect, ofType } from '@ngrx/effects';
// Rxjs
import { Observable } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
// Services
import { MailService } from '../../store/services';
// Custom Actions
import {
  AccountDetailsGet,
  CreateMail,
  DeleteFolder,
  DeleteMailSuccess, EmptyTrash, EmptyTrashFailure, EmptyTrashSuccess,
  GetMailDetail,
  GetMailDetailSuccess,
  GetMails,
  GetMailsSuccess,
  GetUnreadMailsCount,
  GetUnreadMailsCountSuccess,
  MailActionTypes,
  MoveMail,
  MoveMailSuccess,
  ReadMail,
  ReadMailSuccess,
  SnackErrorPush,
  SnackPush,
  StarMailSuccess,
  UndoDeleteMail,
  UndoDeleteMailSuccess
} from '../actions';
import { MailFolderType } from '../models';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class MailEffects {

  constructor(private actions: Actions,
              private mailService: MailService) {
  }

  @Effect()
  getMailsEffect: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.GET_MAILS),
    map((action: GetMails) => action.payload),
    switchMap(payload => {
      return this.mailService.getMessages(payload)
        .pipe(
          map((response) => {
            return new GetMailsSuccess({ ...payload, mails: response['results'], total_mail_count: response['total_count'] });
          }),
          catchError((error) => EMPTY)
        );
    }));


  @Effect()
  getUnreadMailsCountEffect: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.GET_UNREAD_MAILS_COUNT),
    map((action: GetUnreadMailsCount) => action.payload),
    mergeMap(payload => {
      return this.mailService.getUnreadMailsCount()
        .pipe(
          map((response) => {
            return new GetUnreadMailsCountSuccess(response);
          }),
          catchError((error) => EMPTY)
        );
    }));

  @Effect()
  moveMailEffect: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.MOVE_MAIL),
    map((action: MoveMail) => action.payload),
    switchMap(payload => {
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
            return of(...updateFolderActions);

          }),
          catchError(err => of(new SnackErrorPush({ message: `Failed to move mail to ${payload.folder}.` })))
        );
    }));

  @Effect()
  deleteMailEffect: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.DELETE_MAIL),
    map((action: CreateMail) => action.payload),
    switchMap(payload => {
      return this.mailService.deleteMails(payload.ids)
        .pipe(
          switchMap(res => of(new DeleteMailSuccess(payload))),
          catchError(err => of(new SnackErrorPush({ message: 'Failed to delete mail.' })))
        );
    }));

  @Effect()
  readMailEffect: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.READ_MAIL),
    map((action: ReadMail) => action.payload),
    switchMap(payload => {
      return this.mailService.markAsRead(payload.ids, payload.read)
        .pipe(
          switchMap(res => of(new ReadMailSuccess(payload), new GetUnreadMailsCount())),
          catchError(err => of(new SnackErrorPush({ message: 'Failed to mark mail as read.' })))
        );
    }));

  @Effect()
  starMailEffect: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.STAR_MAIL),
    map((action: ReadMail) => action.payload),
    mergeMap(payload => {
      return this.mailService.markAsStarred(payload.ids, payload.starred)
        .pipe(
          switchMap(res => of(new StarMailSuccess(payload))),
          catchError(err => of(new SnackErrorPush({ message: 'Failed to mark as starred.' })))
        );
    }));

  @Effect()
  getMailDetailEffect: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.GET_MAIL_DETAIL),
    map((action: GetMailDetail) => action.payload),
    switchMap(payload => {
      return this.mailService.getMessage(payload)
        .pipe(
          switchMap(res => of(new GetMailDetailSuccess(res)))
        );
    }));

  @Effect()
  undoDeleteDraftMailEffect: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.UNDO_DELETE_MAIL),
    map((action: UndoDeleteMail) => action.payload),
    switchMap(payload => {
      return this.mailService.moveMail(payload.ids, payload.sourceFolder)
        .pipe(
          switchMap(res => of(new UndoDeleteMailSuccess(payload))),
          catchError(err => of(new SnackErrorPush({ message: `Failed to move mail to ${payload.folder}.` })))
        );
    }));

  @Effect()
  emptyTrashEffect: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.EMPTY_TRASH),
    map((action: EmptyTrash) => action.payload),
    switchMap(payload => {
      return this.mailService.emptyTrash()
        .pipe(
          switchMap(res => of(new EmptyTrashSuccess(res))),
          catchError(err => of(
            new SnackErrorPush({message: `Failed to delete all messages.`}),
            new EmptyTrashFailure(err.error)
          ))
        );
    }));

}
