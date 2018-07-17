import { HttpEventType, HttpResponse } from '@angular/common/http';

// Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// Ngrx
import { Actions, Effect } from '@ngrx/effects';
// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { catchError, switchMap } from 'rxjs/operators';
// Services
import { MailService } from '../../store/services';
import {
  GetMailDetail,
  GetMailDetailSuccess,
  MoveMail,
  MoveMailSuccess,
  ReadMail,
  ReadMailSuccess,
  StarMailSuccess, UploadAttachment, UploadAttachmentProgress, UploadAttachmentSuccess,
  UndoDeleteMail, UndoDeleteMailSuccess
} from '../actions/mail.actions';
// Custom Actions
import {
  CreateMail, CreateMailSuccess, DeleteMailSuccess, GetMails,
  GetMailsSuccess, MailActionTypes, SnackErrorPush,
  GetMailboxes, GetMailboxesSuccess, SnackPush
} from '../actions';
import { map } from 'rxjs/operators/map';


@Injectable()
export class MailEffects {

  constructor(private actions: Actions,
              private mailService: MailService) {}

  @Effect()
  getMailsEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.GET_MAILS)
    .map((action: GetMails) => action.payload)
    .switchMap(payload => {
      return this.mailService.getMessages(payload.limit, payload.offset, payload.folder)
        .map((mails) => {
          return new GetMailsSuccess({ ...payload, mails });
        });
    });

  @Effect()
  getMailboxesEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.GET_MAILBOXES)
    .map((action: GetMailboxes) => action.payload)
    .switchMap(payload => {
      return this.mailService.getMailboxes(payload.limit, payload.offset)
        .map((mails) => {
          return new GetMailboxesSuccess(mails);
        });
    });


  @Effect()
  createMailEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.CREATE_MAIL)
    .map((action: CreateMail) => action.payload)
    .switchMap(payload => {
      return this.mailService.createMail(payload)
        .pipe(
          switchMap(res => {
            return [
              new CreateMailSuccess(res),
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to save mail.' })]),
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
            return [
              new MoveMailSuccess(payload),
              new SnackPush({message: `Mail moved to trash`, ids: payload.ids, folder: payload.folder, sourceFolder: payload.sourceFolder, mail: payload.mail})
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: `Failed to move mail to ${payload.folder}.` })]),
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
              new DeleteMailSuccess(payload),
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to delete mail.' })]),
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
              new ReadMailSuccess(payload),
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to mark mail as read.' })]),
        );
    });

  @Effect()
  starMailEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.STAR_MAIL)
    .map((action: ReadMail) => action.payload)
    .switchMap(payload => {
      return this.mailService.markAsStarred(payload.ids, payload.starred)
        .pipe(
          switchMap(res => {
            return [
              new StarMailSuccess(payload),
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to mark as starred.' })]),
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
  uploadAttachmentEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.UPLOAD_ATTACHMENT)
    .map((action: UploadAttachment) => action.payload)
    .switchMap(payload => {
      return Observable.create(observer => {
        this.mailService.uploadFile(payload)
          .finally(() => observer.complete())
          .subscribe((event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                const progress = Math.round(100 * event.loaded / event.total);
                observer.next(new UploadAttachmentProgress({ ...payload, progress }));
              } else if (event instanceof HttpResponse) {
                observer.next(new UploadAttachmentSuccess(event.body));
              }
            },
            err => observer.next(new SnackErrorPush({ message: 'Failed to upload attachment.' })));
      });
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
          catchError(err => [new SnackErrorPush({ message: `Failed to move mail to ${payload.folder}.` })]),
        );
    });

}
