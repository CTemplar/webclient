import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, Subscription } from 'rxjs';
import { catchError, finalize, map, mergeMap, switchMap, concatMap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

import { MailService } from '../services';
import {
  ComposeMailActionTypes,
  CreateMail,
  CreateMailSuccess,
  DeleteAttachment,
  DeleteAttachmentFailure,
  DeleteAttachmentSuccess,
  DeleteMailSuccess,
  GetUnreadMailsCount,
  GetUsersKeys,
  GetUsersKeysSuccess,
  SendMail,
  SendMailFailure,
  SendMailSuccess,
  SnackErrorPush,
  SnackPush,
  UpdateCurrentFolder,
  UpdateMailDetailChildren,
  UploadAttachment,
  UploadAttachmentFailure,
  UploadAttachmentProgress,
  UploadAttachmentRequest,
  UploadAttachmentSuccess,
} from '../actions';
import { Draft } from '../datatypes';
import { MailFolderType } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ComposeMailEffects {
  constructor(private actions: Actions, private mailService: MailService) {}

  @Effect()
  createMailEffect: Observable<any> = this.actions.pipe(
    ofType(ComposeMailActionTypes.CREATE_MAIL),
    map((action: CreateMail) => action.payload),
    mergeMap(payload => {
      return this.mailService.createMail(payload.draft).pipe(
        switchMap(res =>
          of(
            new CreateMailSuccess({ draft: payload, response: res }),
            new UpdateCurrentFolder(res),
            new GetUnreadMailsCount(),
          ),
        ),
        catchError(() => of(new SnackErrorPush({ message: 'Failed to save mail.' }))),
      );
    }),
  );

  @Effect()
  uploadAttachmentEffect: Observable<any> = this.actions.pipe(
    ofType(ComposeMailActionTypes.UPLOAD_ATTACHMENT),
    map((action: UploadAttachment) => action.payload),
    mergeMap(payload => {
      // TODO: replace custom observable with switchMap
      return Observable.create((observer: any) => {
        const request: Subscription = this.mailService
          .uploadFile(payload)
          .pipe(finalize(() => observer.complete()))
          .subscribe(
            (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                const progress = Math.round((100 * event.loaded) / event.total);
                observer.next(new UploadAttachmentProgress({ ...payload, progress }));
              } else if (event instanceof HttpResponse) {
                observer.next(new UploadAttachmentSuccess({ data: payload, response: event.body }));
              }
            },
            error => {
              observer.next(new SnackErrorPush({ message: 'Failed to upload attachment.' }));
              observer.next(new UploadAttachmentFailure(payload));
            },
          );
        observer.next(new UploadAttachmentRequest({ ...payload, request }));
      });
    }),
  );

  @Effect()
  deleteAttachmentEffect: Observable<any> = this.actions.pipe(
    ofType(ComposeMailActionTypes.DELETE_ATTACHMENT),
    map((action: DeleteAttachment) => action.payload),
    mergeMap(payload => {
      if (payload.id) {
        return this.mailService.deleteAttachment(payload).pipe(
          switchMap(() => of(new DeleteAttachmentSuccess(payload))),
          catchError(() =>
            of(new SnackErrorPush({ message: 'Failed to delete attachment.' }), new DeleteAttachmentFailure(payload)),
          ),
        );
      }
      return of(new DeleteAttachmentSuccess(payload));
    }),
  );

  @Effect()
  sendMailEffect: Observable<any> = this.actions.pipe(
    ofType(ComposeMailActionTypes.SEND_MAIL),
    map((action: SendMail) => action.payload),
    mergeMap((payload: Draft) => {
      let message: string;
      if (payload.draft.dead_man_duration || payload.draft.delayed_delivery) {
        if (payload.draft.delayed_delivery === 'CancelSend') {
          payload.draft.delayed_delivery = null;
          payload.draft.send = false;
          payload.draft.folder = MailFolderType.DRAFT;
          message = `Delay delivery send cancelled and message reverted to draft.`;
        } else {
          payload.draft.send = false;
          payload.draft.folder = MailFolderType.OUTBOX;
          message = `Mail scheduled`;
        }
      } else {
        payload.draft.send = true;
        payload.draft.folder = MailFolderType.SENT;
        message = `Mail sent successfully`;
      }
      payload.draft.is_subject_encrypted = payload.draft.is_subject_encrypted && payload.draft.is_encrypted;
      return this.mailService.createMail(payload.draft).pipe(
        switchMap((res: any) => {
          res.last_action_data = {
            last_action: payload.draft.last_action,
            last_action_parent_id: payload.draft.last_action_parent_id,
          };
          res.folder = MailFolderType.SENT;
          const events: any[] = [
            new SendMailSuccess(payload),
            new UpdateCurrentFolder(res),
            new UpdateMailDetailChildren(res),
            new DeleteMailSuccess({ ids: `${res.id}`, isDraft: true, isMailDetailPage: payload.isMailDetailPage }),
            new SnackPush({
              message,
            }),
            new GetUnreadMailsCount(),
          ];
          return events;
        }),
        catchError(errorResponse =>
          of(
            new SnackErrorPush({
              message: errorResponse.error || 'Failed to send mail.',
              duration: 10000,
            }),
            new SendMailFailure(payload),
          ),
        ),
      );
    }),
  );

  @Effect()
  getUsersKeysEffect: Observable<any> = this.actions.pipe(
    ofType(ComposeMailActionTypes.GET_USERS_KEYS),
    map((action: GetUsersKeys) => action.payload),
    concatMap((payload: any) => {
      if (payload.emails.length > 0) {
        return this.mailService.getUsersPublicKeys(payload.emails).pipe(
          switchMap(keys =>
            of(new GetUsersKeysSuccess({ draftId: payload.draftId ? payload.draftId : 0, data: keys, isBlind: false })),
          ),
          catchError(() => of(new SnackErrorPush({ message: 'Failed to get public keys.' }))),
        );
      } else {
        return of(new GetUsersKeysSuccess({ draftId: payload.draftId ? payload.draftId : 0, isBlind: true }));
      }
    }),
  );
}
