import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { GetMessage, GetMessageSuccess, SecureMessageActionTypes } from '../actions';
import { MailService } from '../services';

@Injectable()
export class SecureMessageEffects {

  constructor(private actions: Actions,
              private mailService: MailService) {
  }

  @Effect()
  createMailEffect: Observable<any> = this.actions
    .ofType(SecureMessageActionTypes.GET_MESSAGE)
    .map((action: GetMessage) => action.payload)
    .switchMap(payload => {
      return [new GetMessageSuccess(null)];
    });
}
