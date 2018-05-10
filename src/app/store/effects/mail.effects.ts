// Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Ngrx
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { tap } from 'rxjs/operators';

// Services
import { MailService } from '../../core/services';

// Custom Actions
import {
  MailActionTypes,
  GetMails, GetMailsSuccess
} from '../actions';


@Injectable()
export class MailEffects {

  constructor(
    private actions: Actions,
    private mailService: MailService,
    private router: Router,
  ) {}

  @Effect()
  GetMails: Observable<any> = this.actions
    .ofType(MailActionTypes.GET_MAILS)
    .map((action: GetMails) => action.payload)
    .switchMap(payload => {
      return this.mailService.getMessages(payload.limit, payload.offset)
        .map((mails) => {
          return new GetMailsSuccess(mails);
        });
    });

  // @Effect({ dispatch: false })
  // LogInSuccess: Observable<any> = this.actions.pipe(
  //   ofType(AuthActionTypes.LOGIN_SUCCESS),
  //   tap((user) => {
  //     localStorage.setItem('token', user.payload.token);
  //     // this.router.navigateByUrl('/');
  //   })
  // );
}
