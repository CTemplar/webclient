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
import { switchMap } from 'rxjs/operators';
// Services
import { MailService } from '../../store/services';
import { GetUsersKeys, GetUsersKeysSuccess, SetFolders } from '../actions/mail.actions';
// Custom Actions
import { GetMailboxes, GetMailboxesSuccess, MailActionTypes } from '../actions';


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
            return [
              new GetMailboxesSuccess(mails),
              new SetFolders(mails[0].folders)
            ];
          })
        );
    });

  @Effect()
  getUsersKeysEffect: Observable<any> = this.actions
    .ofType(MailActionTypes.GET_USERS_KEYS)
    .map((action: GetUsersKeys) => action.payload)
    .switchMap(payload => {
      return this.mailService.getUsersPublicKeys(payload)
        .pipe(
          switchMap((keys) => {
            return [
              new GetUsersKeysSuccess(keys)
            ];
          })
        );
    });


}
