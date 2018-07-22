import { HttpEventType, HttpResponse } from '@angular/common/http';
// Angular
import { Injectable } from '@angular/core';
// Ngrx
import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
// Rxjs
import { Observable } from 'rxjs/Observable';
import { catchError, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
// Services
import { MailService } from '../../store/services';
// Custom Actions
import {
  CreateMail,
  CreateMailSuccess,
  DeleteMailSuccess,
  GetMails,
  GetMailsSuccess,
  MailActionTypes,
  SnackErrorPush,
  SnackPush
} from '../actions';
import {
  CreateFolder,
  CreateFolderSuccess,
  DeleteAttachment,
  DeleteAttachmentSuccess,
  GetMailDetail,
  GetMailDetailSuccess, GetUsersKeys, GetUsersKeysSuccess,
  MoveMail,
  MoveMailSuccess,
  ReadMail,
  ReadMailSuccess,
  SendMail,
  SendMailSuccess,
  StarMailSuccess,
  UndoDeleteMail,
  UndoDeleteMailSuccess,
  UploadAttachment,
  UploadAttachmentProgress,
  UploadAttachmentRequest,
  UploadAttachmentSuccess
} from '../actions/mail.actions';
import { Draft, DraftState } from '../datatypes';
import { MailFolderType } from '../models';

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
  createMailEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.CREATE_MAIL)
    .map((action: CreateMail) => action.payload)
    .switchMap(payload => {
      return this.mailService.createMail(payload.draft)
        .pipe(
          switchMap(res => {
            return [
              new CreateMailSuccess({ draft: payload, response: res }),
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
              new SnackPush({
                message: `Mail moved to trash`,
                ids: payload.ids,
                folder: payload.folder,
                sourceFolder: payload.sourceFolder,
                mail: payload.mail
              })
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
      // TODO: replace custom observable with switchMap
      return Observable.create(observer => {
        const request: Subscription = this.mailService.uploadFile(payload)
          .finally(() => observer.complete())
          .subscribe((event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                const progress = Math.round(100 * event.loaded / event.total);
                observer.next(new UploadAttachmentProgress({ ...payload, progress }));
              } else if (event instanceof HttpResponse) {
                observer.next(new UploadAttachmentSuccess({ data: payload, response: event.body }));
              }
            },
            err => observer.next(new SnackErrorPush({ message: 'Failed to upload attachment.' })));
        observer.next(new UploadAttachmentRequest({ ...payload, request }));
      });
    });

  @Effect()
  deleteAttachmentEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.DELETE_ATTACHMENT)
    .map((action: DeleteAttachment) => action.payload)
    .switchMap(payload => {
      if (payload.id) {
        return this.mailService.deleteAttachment(payload)
          .pipe(
            switchMap(res => {
              return [new DeleteAttachmentSuccess(payload)];
            }),
            catchError(err => [new SnackErrorPush({ message: 'Failed to delete attachment.' })])
          );
      } else {
        return [new DeleteAttachmentSuccess(payload)];
      }
    });

  @Effect()
  createFolderEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.CREATE_FOLDER)
    .map((action: CreateFolder) => action.payload)
    .switchMap(payload => {
      return this.mailService.createFolder(payload)
        .pipe(
          switchMap(res => {
            return [
              new CreateFolderSuccess(res.folders),
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to create folder.' })]),
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
          catchError(err => [new SnackErrorPush({ message: `Failed to move mail to ${payload.folder}.` })]),
        );
    });

  @Effect()
  sendMailEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.SEND_MAIL)
    .map((action: SendMail) => action.payload)
    .switchMap((payload: Draft) => {
      if (payload.draft.dead_man_duration || payload.draft.delayed_delivery || payload.draft.destruct_date) {
        payload.draft.send = false;
        payload.draft.folder = MailFolderType.OUTBOX;
      } else {
        payload.draft.send = true;
        payload.draft.folder = MailFolderType.SENT;
      }
      return this.mailService.createMail(payload.draft)
        .pipe(
          switchMap(res => {
            return [
              new SendMailSuccess(payload),
              new SnackPush({
                message: `Mail sent successfully`,
              })
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: `Failed to send mail.` })]),
        );
    });

  @Effect()
  getUsersKeysEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.GET_USERS_KEYS)
    .map((action: GetUsersKeys) => action.payload)
    .switchMap((payload: any) => {
      return this.mailService.getUsersPublicKeys(payload.emails)
        .pipe(
          switchMap((keys) => {
            return [
              new GetUsersKeysSuccess({ draftId: payload.draftId, data: keys })
            ];
          })
        );
    });

}
