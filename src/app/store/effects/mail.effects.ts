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
import {
  CreateMail, CreateMailSuccess, DeleteMailSuccess, GetMails,
  GetMailsSuccess, MailActionTypes, SnackErrorPush,
  GetMailboxes, GetMailboxesSuccess
} from '../actions';


@Injectable()
export class MailEffects {

  constructor(private actions: Actions,
              private mailService: MailService) {}

  @Effect()
  getMailsEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.GET_MAILS)
    .map((action: GetMails) => action.payload)
    .switchMap(payload => {
      return this.mailService.getMessages(payload.limit, payload.offset)
        .map((mails) => {
          return new GetMailsSuccess(mails);
        });
    });

    @Effect()
    getMailboxesEffect: Observable<any> = this.actions
      .ofType(MailActionTypes.GET_MAILBOXES)
      .map((action: GetMailboxes) => action.payload)
      .switchMap(payload => {
        return this.mailService.getMailboxes(payload.limit, payload.offset)
          .map((mails) => {
            return new GetMailboxesSuccess(mails);
          });
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
  deleteMailEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.DELETE_MAIL)
    .map((action: CreateMail) => action.payload)
    .switchMap(payload => {
      return this.mailService.deleteMail(payload)
        .pipe(
          switchMap(res => {
            return [
              new DeleteMailSuccess(null),
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to discard mail.' })]),
        );
    });

}
