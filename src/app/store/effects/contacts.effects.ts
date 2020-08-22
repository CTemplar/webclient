import { HttpResponse } from '@angular/common/http';
// Angular
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
// Ngrx
// Rxjs
import { Observable } from 'rxjs';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { of } from 'rxjs/internal/observable/of';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
// Service
import { OpenPgpService, UsersService, MailService } from '../../store/services';
// Custom Actions
import {
  Accounts,
  ContactAddError,
  ContactAddSuccess,
  ContactDeleteSuccess, ContactGetFailure,
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
  SnackPush, UpdateBatchContacts, UpdateBatchContactsSuccess, UpdateCurrentFolder
} from '../actions';
import { Contact } from '../datatypes';

@Injectable()
export class ContactsEffects {
  constructor(
    private actions: Actions,
    private openPgpService: OpenPgpService,
    private userService: UsersService,
    private mailService: MailService) {}

  @Effect()
  Contact: Observable<any> = this.actions.pipe(
    ofType(ContactsActionTypes.CONTACT_GET),
    map((action: ContactsGet) => action.payload),
    switchMap(payload => {
      return this.userService.getContact(payload.limit, payload.offset, payload.q)
        .pipe(
          map(response => {
            if (payload.isDecrypting) {
              response.isDecrypting = true;
              return new ContactGetSuccess(response);
            } else {
              let count = 0;
              const contacts: Contact[] = response.results;
              contacts.forEach((contact) => {
                if (contact.is_encrypted) {
                  contact.is_decryptionInProgress = true;
                  count = count + 1;
                  setTimeout(() => {
                    this.openPgpService.decryptContact(contact.encrypted_data, contact.id);
                  }, (count * 300));
                }
              });
            }
            return new ContactGetSuccess(response);
          }),
          catchError((error) => of(new ContactGetFailure()))
        );
    }));


  @Effect()
  ContactAdd: Observable<any> = this.actions
    .pipe(
      ofType(ContactsActionTypes.CONTACT_ADD),
      switchMap((action: Accounts) =>
        this.userService.addContact(action.payload)
          .pipe(
            switchMap(contact => {
              contact.isUpdating = action.payload.id;
              if (contact.is_encrypted) {
                setTimeout(() => {
                  this.openPgpService.decryptContact(contact.encrypted_data, contact.id);
                }, 150);
              }
              return of(
                new ContactAddSuccess(contact),
                new SnackPush({ message: `Contact ${action.payload.id ? 'updated' : 'saved'} successfully.` })
              );
            }),
            catchError(err => of(
              new ContactAddError(),
              new SnackErrorPush({ message: `Failed to ${action.payload.id ? 'update' : 'save'} contact.` })
            )),
          ))
    );

  @Effect()
  ContactDelete: Observable<any> = this.actions.pipe(
    ofType(ContactsActionTypes.CONTACT_DELETE),
    map((action: Accounts) => action.payload),
    switchMap(payload => {
      return this.userService.deleteContact(payload)
        .pipe(
          switchMap(contact => {
            return of(
              new ContactDeleteSuccess(payload),
              new SnackPush({ message: 'Contacts deleted successfully.' })
            );
          }),
          catchError((error) => EMPTY)
        );
    }));

  @Effect()
  ContactNotify: Observable<any> = this.actions.pipe(
    ofType(ContactsActionTypes.CONTACT_NOTIFY),
    map((action: Accounts) => action.payload),
    switchMap(payload => {
        return this.userService.notifyContact(payload)
        .pipe(
          switchMap(res => {
            return of(
              new UpdateCurrentFolder(res),
              new ContactNotifySuccess(payload),
              new SnackPush({ message: 'Notification emails have been sent successfully.' })
            );
          }),
          catchError(error => {
            return of(
              new SnackErrorPush({ message: error.error }),
              new ContactNotifyFailure(error.error),
            );
          })
        );
    }));

  @Effect()
  ContactImport: Observable<any> = this.actions.pipe(
    ofType(ContactsActionTypes.CONTACT_IMPORT),
    map((action: ContactImport) => action.payload),
    switchMap(payload => {
      return this.userService.importContacts(payload)
        .pipe(
          mergeMap(event => {
            if (event instanceof HttpResponse) {
              return of(
                new ContactImportSuccess(event.body),
                new ContactsGet({ limit: 50, offset: 0 }),
                new SnackPush({ message: 'Contacts imported successfully' })
              );
            } else {
              return EMPTY;
            }
          }),
          catchError(error => {
            return of(
              new SnackErrorPush({ message: 'Failed to import contacts' }),
              new ContactImportFailure(error.error)
            );
          })
        );
    }));

  @Effect()
  getEmailsContactsEffect: Observable<any> = this.actions.pipe(
    ofType(ContactsActionTypes.GET_EMAIL_CONTACTS),
    map((action: GetEmailContacts) => action.payload),
    switchMap(payload => {
      return this.userService.getEmailContacts()
        .pipe(
          switchMap(res => of(new GetEmailContactsSuccess(res.results))),
          catchError(err => EMPTY)
        );
    }));


  @Effect()
  updateBatchContacts: Observable<any> = this.actions.pipe(
    ofType(ContactsActionTypes.CONTACT_BATCH_UPDATE),
    map((action: UpdateBatchContacts) => action.payload),
    switchMap(payload => {
      return this.userService.updateBatchContacts(payload)
        .pipe(
          switchMap(res => of(new UpdateBatchContactsSuccess(payload))),
          catchError(err => EMPTY)
        );
    }));
}
