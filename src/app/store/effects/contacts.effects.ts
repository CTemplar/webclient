import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { of } from 'rxjs/internal/observable/of';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import { OpenPgpService, UsersService, MailService } from '../services';
import {
  Accounts,
  ContactAddError,
  ContactAddSuccess,
  ContactDeleteSuccess,
  ContactGetFailure,
  ContactNotifySuccess,
  ContactNotifyFailure,
  ContactGetSuccess,
  ContactImport,
  ContactImportFailure,
  ContactImportSuccess,
  ContactsActionTypes,
  ContactsGet,
  GetEmailContacts,
  GetEmailContactsSuccess,
  SnackErrorPush,
  SnackPush,
  UpdateBatchContacts,
  UpdateBatchContactsSuccess,
  EmptyOnlyFolder,
} from '../actions';
import { Contact } from '../datatypes';

@Injectable()
export class ContactsEffects {
  constructor(
    private actions: Actions,
    private openPgpService: OpenPgpService,
    private userService: UsersService,
    private mailService: MailService,
  ) {}

  @Effect()
  Contact: Observable<any> = this.actions.pipe(
    ofType(ContactsActionTypes.CONTACT_GET),
    map((action: ContactsGet) => action.payload),
    switchMap(payload => {
      return this.userService.getContact(payload.limit, payload.offset, payload.q).pipe(
        map(response => {
          if (payload.isDecrypting) {
            response.isDecrypting = true;
            return new ContactGetSuccess(response);
          }
          let count = 0;
          const contacts: Contact[] = response.results;
          contacts.forEach(contact => {
            if (contact.is_encrypted) {
              contact.is_decryptionInProgress = true;
              count += 1;
              setTimeout(() => {
                this.openPgpService.decryptContact(contact.encrypted_data, contact.id);
              }, count * 300);
            }
          });

          return new ContactGetSuccess(response);
        }),
        catchError(error => of(new ContactGetFailure())),
      );
    }),
  );

  @Effect()
  ContactAdd: Observable<any> = this.actions.pipe(
    ofType(ContactsActionTypes.CONTACT_ADD),
    switchMap((action: Accounts) =>
      this.userService.addContact(action.payload).pipe(
        switchMap(contact => {
          contact.isUpdating = action.payload.id;
          if (contact.is_encrypted) {
            setTimeout(() => {
              this.openPgpService.decryptContact(contact.encrypted_data, contact.id);
            }, 150);
          }
          return of(
            new ContactAddSuccess(contact),
            new SnackPush({ message: `Contact ${action.payload.id ? 'updated' : 'saved'} successfully.` }),
          );
        }),
        catchError(error =>
          of(
            new ContactAddError(),
            new SnackErrorPush({ message: `Failed to ${action.payload.id ? 'update' : 'save'} contact.` }),
          ),
        ),
      ),
    ),
  );

  @Effect()
  ContactDelete: Observable<any> = this.actions.pipe(
    ofType(ContactsActionTypes.CONTACT_DELETE),
    map((action: Accounts) => action.payload),
    switchMap(payload => {
      return this.userService.deleteContact(payload).pipe(
        switchMap(contact => {
          return of(new ContactDeleteSuccess(payload), new SnackPush({ message: 'Contacts deleted successfully.' }));
        }),
        catchError(error => of(new SnackErrorPush({ message: 'Failed to delete contacts.' }))),
      );
    }),
  );

  @Effect()
  ContactNotify: Observable<any> = this.actions.pipe(
    ofType(ContactsActionTypes.CONTACT_NOTIFY),
    map((action: Accounts) => action.payload),
    switchMap(payload => {
      return this.userService.notifyContact(payload).pipe(
        switchMap(res => {
          if (res && res.length === 0) {
            return of(new SnackErrorPush({ message: 'Failed to notify' }), new ContactNotifyFailure({}));
          }
          return of(
            new EmptyOnlyFolder({ folder: 'sent' }),
            new ContactNotifySuccess(payload),
            new SnackPush({ message: 'Notification emails have been sent successfully.' }),
          );
        }),
        catchError(error => {
          return of(
            new SnackErrorPush({ message: error.error.msg ? error.error.msg : 'Failed to notify' }),
            new ContactNotifyFailure(error.error),
          );
        }),
      );
    }),
  );

  @Effect()
  ContactImport: Observable<any> = this.actions.pipe(
    ofType(ContactsActionTypes.CONTACT_IMPORT),
    map((action: ContactImport) => action.payload),
    switchMap(payload => {
      return this.userService.importContacts(payload).pipe(
        mergeMap(event => {
          if (event instanceof HttpResponse) {
            const result: any = event.body;
            var message = '';
            if (result.detail === 'success') {
              message = result.success_count + ' contacts imported, ' + result.fail_count + ' contacts failed';
            } else {
              message = 'Failed to import contacts.';
            }
            return of(
              new ContactImportSuccess(event.body),
              new ContactsGet({ limit: 50, offset: 0 }),
              new SnackPush({ message: message }),
            );
          }
          return EMPTY;
        }),
        catchError(error => {
          return of(
            new SnackErrorPush({ message: 'Failed to import contacts.' }),
            new ContactImportFailure(error.error),
          );
        }),
      );
    }),
  );

  @Effect()
  getEmailsContactsEffect: Observable<any> = this.actions.pipe(
    ofType(ContactsActionTypes.GET_EMAIL_CONTACTS),
    map((action: GetEmailContacts) => action.payload),
    switchMap(payload => {
      return this.userService.getEmailContacts().pipe(
        switchMap(res => of(new GetEmailContactsSuccess(res.results))),
        catchError(error => of(new SnackErrorPush({ message: 'Failed to get email contacts.' }))),
      );
    }),
  );

  @Effect()
  updateBatchContacts: Observable<any> = this.actions.pipe(
    ofType(ContactsActionTypes.CONTACT_BATCH_UPDATE),
    map((action: UpdateBatchContacts) => action.payload),
    switchMap(payload => {
      return this.userService.updateBatchContacts(payload).pipe(
        switchMap(res => of(new UpdateBatchContactsSuccess(payload))),
        catchError(error => of(new SnackErrorPush({ message: 'Failed to update batch contacts.' }))),
      );
    }),
  );
}
