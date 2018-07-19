import { HttpEventType, HttpResponse } from '@angular/common/http';
// Angular
import { Injectable } from '@angular/core';
// Ngrx
import { Actions, Effect } from '@ngrx/effects';
import { Subscription } from 'rxjs';
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
  CreateFolder,
  CreateFolderSuccess,
  DeleteAttachment,
  DeleteAttachmentSuccess,
  GetMailDetail,
  GetMailDetailSuccess,
  MoveMail,
  MoveMailSuccess,
  ReadMail,
  ReadMailSuccess,
  SendMail,
  SendMailSuccess,
  SetFolders,
  StarMailSuccess,
  UndoDeleteMail,
  UndoDeleteMailSuccess,
  UploadAttachment,
  UploadAttachmentProgress,
  UploadAttachmentRequest,
  UploadAttachmentSuccess
} from '../actions/mail.actions';
// Custom Actions
import {
  CreateMail,
  CreateMailSuccess,
  DeleteMailSuccess,
  GetMailboxes,
  GetMailboxesSuccess,
  GetMails,
  GetMailsSuccess,
  MailActionTypes,
  SnackErrorPush,
  SnackPush
} from '../actions';
import { Mail, MailFolderType } from '../models';


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
        .pipe(
          switchMap((mails) => {
            return [
              new GetMailboxesSuccess(mails),
              new SetFolders(mails[0].folders)
            ];
          })
        );
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
    .switchMap((payload: Mail) => {
      if (payload.dead_man_timer || payload.delayed_delivery || payload.destruct_date) {
        payload.send = false;
        return this.mailService.moveMail(`${payload.id}`, MailFolderType.OUTBOX)
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
      }
      payload.send = true;
      return this.mailService.moveMail(`${payload.id}`, MailFolderType.SENT)
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

}
