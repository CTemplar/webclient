import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { catchError, switchMap } from 'rxjs/operators';
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
  SnackPush
} from '../actions';
import { MailService } from '../services';

@Injectable()
export class SecureMessageEffects {

  constructor(private actions: Actions,
              private mailService: MailService) {
  }

  @Effect()
  getMessageEffect: Observable<any> = this.actions
    .ofType(SecureMessageActionTypes.GET_MESSAGE)
    .map((action: GetMessage) => action.payload)
    .switchMap(payload => {
      return this.mailService.getSecureMessage(payload.hash, payload.secret)
        .pipe(
          switchMap(res => {
            return [new GetMessageSuccess(res)];
          }),
          catchError(error => [new GetMessageFailure({ error })])
        );
    });

  @Effect()
  sendReplyEffect: Observable<any> = this.actions
    .ofType(SecureMessageActionTypes.SEND_SECURE_MESSAGE_REPLY)
    .map((action: SendSecureMessageReply) => action.payload)
    .switchMap(payload => {
      return this.mailService.secureReply(payload.hash, payload.secret, payload.message)
        .pipe(
          switchMap(res => {
            return [
              new SendSecureMessageReplySuccess({ data: payload, response: res }),
              new SnackPush({
                message: `Reply sent successfully`
              })
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to send reply.' })])
        );
    });

  @Effect()
  getUsersKeysEffect: Observable<any> = this.actions
    .ofType(SecureMessageActionTypes.GET_SECURE_MESSAGE_USERS_KEYS)
    .map((action: GetSecureMessageUserKeys) => action.payload)
    .mergeMap((payload: any) => {
      return this.mailService.getSecureMessageKeys(payload.hash, payload.secret)
        .pipe(
          switchMap((keys) => {
            return [
              new GetSecureMessageUserKeysSuccess(keys)
            ];
          }),
          catchError((error) => [])
        );
    });
}
