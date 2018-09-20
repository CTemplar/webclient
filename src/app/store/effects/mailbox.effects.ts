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
import { GetMailboxes, GetMailboxesSuccess, MailActionTypes } from '../actions';
import { UserMailbox } from '../models/users.model';
import { MailboxSettingsUpdate } from '../actions/mail.actions';
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
          })
        );
    });

  @Effect()
  mailboxSettingsUpdate: Observable<any> = this.actions
    .ofType(MailActionTypes.MAILBOX_SETTINGS_UPDATE)
    .map((action: MailboxSettingsUpdate) => action.payload)
    .switchMap((payload: UserMailbox) => {
      return this.mailService.updateMailBoxSettings(payload)
        .pipe(
          switchMap(res => {
            return [new SettingsUpdateSuccess(payload)];
          }),
          catchError(err => [new SnackErrorPush(err)]),
        );
    });

}
