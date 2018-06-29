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
// Custom Actions
import { CreateMail, CreateMailSuccess, GetMails, GetMailsSuccess, MailActionTypes, SnackErrorPush, SnackPush } from '../actions';


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

  @Effect()
  CreateMailAction: Observable<any> = this.actions
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
          catchError(err => [new SnackErrorPush({ message: 'Failed to auto save mail.' })]),
        );
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
