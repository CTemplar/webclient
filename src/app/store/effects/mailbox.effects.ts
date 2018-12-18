// Angular
import { Injectable } from '@angular/core';
// Ngrx
import { Actions, Effect } from '@ngrx/effects';
// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { switchMap, catchError } from 'rxjs/operators';
// Services
import { MailService } from '../../store/services';
// Custom Actions
import {
  CreateMailbox,
  CreateMailboxFailure,
  CreateMailboxSuccess,
  GetMailboxes,
  GetMailboxesSuccess,
  MailActionTypes,
  SetDefaultMailbox, SetDefaultMailboxSuccess
} from '../actions';
import { Mailbox } from '../models';
import { UserMailbox } from '../models/users.model';
import { MailboxSettingsUpdate, MailboxSettingsUpdateSuccess } from '../actions/mail.actions';
import { SettingsUpdateSuccess, SnackErrorPush } from '../actions/users.action';


@Injectable()
export class MailboxEffects {

  constructor(private actions: Actions,
              private mailService: MailService) {}

  @Effect()
  getMailboxesEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.GET_MAILBOXES)
    .map((action: GetMailboxes) => action.payload)
    .switchMap(payload => {
      return this.mailService.getMailboxes(payload.limit, payload.offset)
        .pipe(
          switchMap((mails) => {
            return [new GetMailboxesSuccess(mails)];
          }),
          catchError((error) => [])
        );
    });

  @Effect()
  mailboxSettingsUpdate: Observable<any> = this.actions
    .ofType(MailActionTypes.MAILBOX_SETTINGS_UPDATE)
    .map((action: MailboxSettingsUpdate) => action.payload)
    .switchMap((payload: Mailbox) => {
      return this.mailService.updateMailBoxSettings(payload)
        .pipe(
          switchMap(res => {
            return [new MailboxSettingsUpdateSuccess(res)];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to update email address settings.'})]),
        );
    });

  @Effect()
  createMailbox: Observable<any> = this.actions
    .ofType(MailActionTypes.CREATE_MAILBOX)
    .map((action: CreateMailbox) => action.payload)
    .switchMap((payload: any) => {
      return this.mailService.createMailbox(payload)
        .pipe(
          switchMap(res => {
            return [new CreateMailboxSuccess(res)];
          }),
          catchError(err => [
            new CreateMailboxFailure(err.error),
            new SnackErrorPush({message: 'Failed to create new email address.'})
            ]),
        );
    });

  @Effect()
  setDefaultMailbox: Observable<any> = this.actions
    .ofType(MailActionTypes.SET_DEFAULT_MAILBOX)
    .map((action: SetDefaultMailbox) => action.payload)
    .switchMap((payload: Mailbox) => {
      return this.mailService.updateMailBoxSettings({ ...payload, is_default: true })
        .pipe(
          switchMap(res => {
            return [new SetDefaultMailboxSuccess(res)];
          }),
          catchError(err => [
            new SnackErrorPush({ message: 'Failed to set email address as default.' })
          ]),
        );
    });

}
