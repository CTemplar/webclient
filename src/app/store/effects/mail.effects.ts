// Angular
import { Injectable } from '@angular/core';
// Ngrx
import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
// Rxjs
import { Observable } from 'rxjs/Observable';
import { catchError, switchMap } from 'rxjs/operators';
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
  UndoDeleteMailSuccess, UpdateFolder, UpdateFolderSuccess
} from '../actions';

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
        .map((mails) => {
          return new GetMailsSuccess({...payload, mails});
        });
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
             updateFolderActions.push(new UpdateFolder(payload.mailbox));
            }

            updateFolderActions.push( new MoveMailSuccess(payload));
            updateFolderActions.push( new SnackPush({
              message: `Mail moved to ${payload.folder}`,
              ids: payload.ids,
              folder: payload.folder,
              sourceFolder: payload.sourceFolder,
              mail: payload.mail,
              allowUndo: payload.allowUndo
            }));

            return updateFolderActions;

          }),
          catchError(err => [new SnackErrorPush({message: `Failed to move mail to ${payload.folder}.`})])
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
          catchError(err => [new SnackErrorPush({message: 'Failed to delete mail.'})])
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
          catchError(err => [new SnackErrorPush({message: 'Failed to mark mail as read.'})])
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
          catchError(err => [new SnackErrorPush({message: 'Failed to mark as starred.'})])
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
  updateFolderEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.UPDATE_FOLDER)
    .map((action: UpdateFolder) => action.payload)
    .switchMap(payload => {
      return this.mailService.updateFolder(payload)
        .pipe(
          switchMap(res => {
            return [
              new UpdateFolderSuccess(res.folders)
            ];
          }),
          catchError(err => [new SnackErrorPush({message: 'Failed to create folder.'})])
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
          catchError(err => [new SnackErrorPush({message: `Failed to move mail to ${payload.folder}.`})])
        );
    });

}
