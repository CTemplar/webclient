import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

import { MailService } from '../services';
import {
  CreateMailbox,
  CreateMailboxFailure,
  CreateMailboxSuccess,
  DeleteMailbox,
  DeleteMailboxSuccess,
  GetDomains,
  GetMailboxes,
  GetMailboxesSuccess,
  MailActionTypes,
  MailboxSettingsUpdateFailure,
  SetDefaultMailbox,
  SetDefaultMailboxSuccess,
  UpdateMailboxOrder,
  UpdateMailboxOrderSuccess,
} from '../actions';
import { Mailbox } from '../models';
import { 
  FetchMailboxKeys, 
  FetchMailboxKeysFailure, 
  FetchMailboxKeysSuccess, 
  MailboxSettingsUpdate, 
  MailboxSettingsUpdateSuccess, 
  AddMailboxKeys, 
  AddMailboxKeysFailure, 
  AddMailboxKeysSuccess, 
  DeleteMailboxKeys, 
  DeleteMailboxKeysFailure, 
  DeleteMailboxKeysSuccess, 
  SetMailboxKeyPrimary,
  SetMailboxKeyPrimarySuccess,
  SetMailboxKeyPrimaryFailure
} from '../actions/mail.actions';
import { SnackErrorPush, SnackPush } from '../actions/users.action';
import { MailboxKey } from '../datatypes';

@Injectable()
export class MailboxEffects {
  constructor(private actions: Actions, private mailService: MailService) {}

  @Effect()
  getMailboxesEffect: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.GET_MAILBOXES),
    map((action: GetMailboxes) => action.payload),
    switchMap(payload => {
      return this.mailService.getMailboxes(payload.limit, payload.offset).pipe(
        switchMap(mails => of(
          new GetMailboxesSuccess(mails),
          new FetchMailboxKeys(),
        )),
        catchError(error => of(new SnackErrorPush({ message: 'Failed to get mailboxes.' }))),
      );
    }),
  );

  @Effect()
  mailboxSettingsUpdate: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.MAILBOX_SETTINGS_UPDATE),
    map((action: MailboxSettingsUpdate) => action.payload),
    switchMap((payload: any) => {
      payload.inProgress = false;
      return this.mailService.updateMailBoxSettings(payload).pipe(
        switchMap(res => {
          const actions: any[] = [new MailboxSettingsUpdateSuccess(res)];
          if (payload.successMsg) {
            actions.push(new SnackErrorPush({ message: payload.successMsg }));
          } else {
            actions.push(new SnackErrorPush({ message: 'Settings updated successfully.' }));
          }
          return of(...actions);
        }),
        catchError(error =>
          of(
            new SnackErrorPush({ message: error.error ? error.error : 'Failed to update mailbox settings.' }),
            new MailboxSettingsUpdateFailure(payload),
          ),
        ),
      );
    }),
  );

  @Effect()
  createMailbox: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.CREATE_MAILBOX),
    map((action: CreateMailbox) => action.payload),
    switchMap((payload: any) => {
      return this.mailService.createMailbox(payload).pipe(
        switchMap(res => of(new CreateMailboxSuccess(res), new GetDomains())),
        catchError(error =>
          of(
            new CreateMailboxFailure(error.error),
            new SnackErrorPush({ message: 'Failed to create new email address.' }),
          ),
        ),
      );
    }),
  );

  @Effect()
  setDefaultMailbox: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.SET_DEFAULT_MAILBOX),
    map((action: SetDefaultMailbox) => action.payload),
    switchMap((payload: Mailbox) => {
      return this.mailService.updateMailBoxSettings({ ...payload, is_default: true }).pipe(
        switchMap(res => of(new SetDefaultMailboxSuccess(res))),
        catchError(error => of(new SnackErrorPush({ message: 'Failed to set email address as default.' }))),
      );
    }),
  );

  @Effect()
  updateMailboxOrder: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.UPDATE_MAILBOX_ORDER),
    map((action: UpdateMailboxOrder) => action.payload),
    switchMap((payload: any) => {
      return this.mailService.updateMailboxOrder(payload.data).pipe(
        switchMap(res =>
          of(
            new SnackErrorPush({ message: 'Sort order saved successfully.' }),
            new UpdateMailboxOrderSuccess({ mailboxes: payload.mailboxes }),
          ),
        ),
        catchError(error => of(new SnackErrorPush({ message: 'Failed to update emails sort order.' }))),
      );
    }),
  );

  @Effect()
  deleteMailbox: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.DELETE_MAILBOX),
    map((action: DeleteMailbox) => action.payload),
    switchMap((payload: Mailbox) => {
      return this.mailService.deleteMailbox(payload.id).pipe(
        switchMap(res =>
          of(
            new SnackErrorPush({ message: `Alias '${payload.email}' deleted successfully.` }),
            new DeleteMailboxSuccess(payload),
          ),
        ),
        catchError(error => of(new SnackErrorPush({ message: `Failed to delete alias: ${error.error}` }))),
      );
    }),
  );

  @Effect()
  fetchMailboxKeys: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.FETCH_MAILBOX_KEYS),
    map((action: FetchMailboxKeys) => action.payload),
    switchMap(() => {
      return this.mailService.fetchMailboxKeys().pipe(
        switchMap(res =>
          of(
            new FetchMailboxKeysSuccess(res),
          ),
        ),
        catchError(error => of(new FetchMailboxKeysFailure())),
      );
    }),
  );

  @Effect()
  addMailboxKeys: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.ADD_MAILBOX_KEYS),
    map((action: AddMailboxKeys) => action.payload),
    switchMap((payload: MailboxKey) => {
      return this.mailService.addMailboxKeys(payload).pipe(
        switchMap(res =>
          of(
            new AddMailboxKeysSuccess({ ...res, private_key: payload.private_key }),
            new SnackPush({ message: 'Mailbox Key has been added successfully' }),
          ),
        ),
        catchError(error => of(
          new AddMailboxKeysFailure(),
          new SnackErrorPush({ message: 'Failed to add mailbox key' }),
          )),
      );
    }),
  );

  @Effect()
  deleteMailboxKeys: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.DELETE_MAILBOX_KEYS),
    map((action: DeleteMailboxKeys) => action.payload),
    switchMap((payload: MailboxKey) => {
      return this.mailService.deleteMailboxKeys(payload).pipe(
        switchMap(res =>
          of(
            new DeleteMailboxKeysSuccess(payload),
            new SnackPush({ message: 'Mailbox Key has been deleted successfully' }),
          ),
        ),
        catchError(error => of(
          new DeleteMailboxKeysFailure(),
          new SnackErrorPush({ message: 'Failed to delete mailbox key' }),
          )),
      );
    }),
  );

  @Effect()
  setPrimaryMailboxKeys: Observable<any> = this.actions.pipe(
    ofType(MailActionTypes.SET_PRIMARY_MAILBOX_KEYS),
    map((action: SetMailboxKeyPrimary) => action.payload),
    switchMap((payload: MailboxKey) => {
      return this.mailService.setPrimaryMailboxKeys(payload).pipe(
        switchMap(res =>
          of(
            new SetMailboxKeyPrimarySuccess(payload),
            new SnackPush({ message: 'Mailbox key has been updated successfully' }),
          ),
        ),
        catchError(error => of(
          new SetMailboxKeyPrimaryFailure(),
          new SnackErrorPush({ message: 'Failed to set mailbox key as primary' }),
          )),
      );
    }),
  );
}
