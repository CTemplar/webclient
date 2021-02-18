import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

import {
  GetMessage,
  GetMessageFailure,
  GetMessageSuccess,
  GetSecureMessageUserKeys,
  GetSecureMessageUserKeysSuccess,
  SecureMessageActionTypes,
  SendSecureMessageReply,
  SendSecureMessageReplySuccess,
  SnackErrorPush,
  SnackPush,
} from '../actions';
import { MailService } from '../services';

@Injectable()
export class SecureMessageEffects {
  constructor(private actions: Actions, private mailService: MailService) {}

  @Effect()
  getMessageEffect: Observable<any> = this.actions.pipe(
    ofType(SecureMessageActionTypes.GET_MESSAGE),
    map((action: GetMessage) => action.payload),
    switchMap(payload => {
      return this.mailService.getSecureMessage(payload.hash, payload.secret).pipe(
        switchMap(res => of(new GetMessageSuccess(res))),
        catchError(error => of(new GetMessageFailure({ error: error.error }))),
      );
    }),
  );

  @Effect()
  sendReplyEffect: Observable<any> = this.actions.pipe(
    ofType(SecureMessageActionTypes.SEND_SECURE_MESSAGE_REPLY),
    map((action: SendSecureMessageReply) => action.payload),
    switchMap(payload => {
      return this.mailService.secureReply(payload.hash, payload.secret, payload.message).pipe(
        switchMap(res => {
          return of(
            new SendSecureMessageReplySuccess({ data: payload, response: res }),
            new SnackPush({
              message: `Reply sent successfully`,
            }),
          );
        }),
        catchError(error => of(new SnackErrorPush({ message: 'Failed to send reply.' }))),
      );
    }),
  );

  @Effect()
  getUsersKeysEffect: Observable<any> = this.actions.pipe(
    ofType(SecureMessageActionTypes.GET_SECURE_MESSAGE_USERS_KEYS),
    map((action: GetSecureMessageUserKeys) => action.payload),
    mergeMap((payload: any) => {
      return this.mailService.getSecureMessageKeys(payload.hash, payload.secret).pipe(
        switchMap(keys => of(new GetSecureMessageUserKeysSuccess(keys))),
        catchError(error => of(new SnackErrorPush({ message: 'Failed to get secure message user keys' }))),
      );
    }),
  );
}
