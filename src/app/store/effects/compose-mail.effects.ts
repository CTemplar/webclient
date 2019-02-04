import { HttpEventType, HttpResponse } from '@angular/common/http';
// Angular
import { Injectable } from '@angular/core';
// Ngrx
import { Actions, Effect, ofType } from '@ngrx/effects';
// Rxjs
import { Observable, Subscription } from 'rxjs';

import { catchError, finalize, map, mergeMap, switchMap } from 'rxjs/operators';
// Services
import { MailService } from '../../store/services';
// Custom Actions
import {
  ComposeMailActionTypes,
  CreateMail,
  CreateMailSuccess,
  DeleteAttachment,
  DeleteAttachmentFailure,
  DeleteAttachmentSuccess,
  GetUsersKeys,
  GetUsersKeysSuccess,
  SendMail,
  SendMailSuccess,
  SnackErrorPush,
  SnackPush,
  UpdateCurrentFolder,
  UpdateMailDetailChildren,
  UploadAttachment,
  UploadAttachmentFailure,
  UploadAttachmentProgress,
  UploadAttachmentRequest,
  UploadAttachmentSuccess
} from '../actions';
import { Draft } from '../datatypes';
import { MailFolderType } from '../models';
import { of } from 'rxjs/internal/observable/of';
import { EMPTY } from 'rxjs/internal/observable/empty';

@Injectable()
export class ComposeMailEffects {

  constructor(private actions: Actions,
              private mailService: MailService) {
  }

  @Effect()
  createMailEffect: Observable<any> = this.actions
    .pipe(
      ofType(ComposeMailActionTypes.CREATE_MAIL),
      map((action: CreateMail) => action.payload),
      mergeMap(payload => {
        return this.mailService.createMail(payload.draft)
          .pipe(
            switchMap(res => of(
              new CreateMailSuccess({ draft: payload, response: res }),
              new UpdateCurrentFolder(res)
            )),
            catchError(err => of(new SnackErrorPush({ message: 'Failed to save mail.' })))
          );
      }));

  @Effect()
  uploadAttachmentEffect: Observable<any> = this.actions
    .pipe(
      ofType(ComposeMailActionTypes.UPLOAD_ATTACHMENT),
      map((action: UploadAttachment) => action.payload),
      mergeMap(payload => {
        // TODO: replace custom observable with switchMap
        return Observable.create(observer => {
          const request: Subscription = this.mailService.uploadFile(payload)
            .pipe(finalize(() => observer.complete()))
            .subscribe((event: any) => {
                if (event.type === HttpEventType.UploadProgress) {
                  const progress = Math.round(100 * event.loaded / event.total);
                  observer.next(new UploadAttachmentProgress({ ...payload, progress }));
                } else if (event instanceof HttpResponse) {
                  observer.next(new UploadAttachmentSuccess({ data: payload, response: event.body }));
                }
              },
              err => {
                observer.next(new SnackErrorPush({ message: 'Failed to upload attachment.' }));
                observer.next(new UploadAttachmentFailure(payload));
              });
          observer.next(new UploadAttachmentRequest({ ...payload, request }));
        });
      }));

  @Effect()
  deleteAttachmentEffect: Observable<any> = this.actions
    .pipe(
      ofType(ComposeMailActionTypes.DELETE_ATTACHMENT),
      map((action: DeleteAttachment) => action.payload),
      mergeMap(payload => {
        if (payload.id) {
          return this.mailService.deleteAttachment(payload)
            .pipe(
              switchMap(res => of(new DeleteAttachmentSuccess(payload))),
              catchError(err => of(
                new SnackErrorPush({ message: 'Failed to delete attachment.' }),
                new DeleteAttachmentFailure(payload)
              ))
            );
        } else {
          return of(new DeleteAttachmentSuccess(payload));
        }
      }));

  @Effect()
  sendMailEffect: Observable<any> = this.actions
    .pipe(
      ofType(ComposeMailActionTypes.SEND_MAIL),
      map((action: SendMail) => action.payload),
      mergeMap((payload: Draft) => {
        if (payload.draft.dead_man_duration || payload.draft.delayed_delivery) {
          payload.draft.send = false;
          payload.draft.folder = MailFolderType.OUTBOX;
        } else {
          payload.draft.send = true;
          payload.draft.folder = MailFolderType.SENT;
        }
        return this.mailService.createMail(payload.draft)
          .pipe(
            switchMap(res => {
              return of(
                new SendMailSuccess(payload),
                new UpdateCurrentFolder(res),
                new UpdateMailDetailChildren(res),
                new SnackPush({
                  message: `Mail sent successfully`
                })
              );
            }),
            catchError(errorResponse => of(new SnackErrorPush({
              message: errorResponse.error && errorResponse.error.detail ?
                errorResponse.error.detail : 'Failed to send mail.', duration: 10000
            })))
          );
      }));

  @Effect()
  getUsersKeysEffect: Observable<any> = this.actions
    .pipe(
      ofType(ComposeMailActionTypes.GET_USERS_KEYS),
      map((action: GetUsersKeys) => action.payload),
      mergeMap((payload: any) => {
        return this.mailService.getUsersPublicKeys(payload.emails)
          .pipe(
            switchMap((keys) => of(new GetUsersKeysSuccess({ draftId: payload.draftId, data: keys }))),
            catchError((error) => EMPTY)
          );
      }));

}
