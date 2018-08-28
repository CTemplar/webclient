import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { catchError, switchMap } from 'rxjs/operators';
import { GetMessage, GetMessageFailure, GetMessageSuccess, SecureMessageActionTypes } from '../actions';
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
}
