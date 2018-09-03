// Angular
import { Injectable } from '@angular/core';
// Ngrx
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { catchError, map, switchMap } from 'rxjs/operators';
// Service
import { UsersService } from '../../store/services';
// Custom Actions
import {
  AccountDetailsGetSuccess,
  Accounts,
  AccountsReadSuccess,
  BlackList,
  BlackListAdd,
  BlackListAddError,
  BlackListAddSuccess,
  BlackListDelete,
  BlackListDeleteSuccess,
  BlackListsReadSuccess,
  ContactAddError,
  ContactAddSuccess,
  ContactDeleteSuccess,
  ContactGet,
  ContactGetSuccess, SettingsUpdate, SettingsUpdateSuccess,
  SnackErrorPush,
  SnackErrorPushSuccess,
  SnackPush,
  SnackPushSuccess,
  UsersActionTypes,
  WhiteList,
  WhiteListAdd,
  WhiteListAddError,
  WhiteListAddSuccess,
  WhiteListDelete,
  WhiteListDeleteSuccess,
  WhiteListsReadSuccess
} from '../actions';
import { NotificationService } from '../services/notification.service';
import { Settings } from '../datatypes';


@Injectable()
export class UsersEffects {
  constructor(
    private actions: Actions,
    private userService: UsersService,
    private notificationService: NotificationService
  ) {
  }

  @Effect()
  Accounts: Observable<any> = this.actions
    .ofType(UsersActionTypes.ACCOUNTS)
    .map((action: Accounts) => action.payload)
    .switchMap(payload => {
      return this.userService.getAccounts('34324').map(user => {
        return new AccountsReadSuccess(user);
      });
    });

  @Effect()
  AccountDetails: Observable<any> = this.actions
    .ofType(UsersActionTypes.ACCOUNT_DETAILS_GET)
    .map((action: Accounts) => action.payload)
    .switchMap(payload => {
      return this.userService.getAccountDetails().map(user => {
        return new AccountDetailsGetSuccess(user[0]);
      });
    });

  @Effect()
  WhiteLists: Observable<any> = this.actions
    .ofType(UsersActionTypes.WHITELIST)
    .map((action: WhiteList) => action.payload)
    .switchMap(payload => {
      return this.userService.getWhiteList().map(whiteList => {
        return new WhiteListsReadSuccess(whiteList.results);
      });
    });

  @Effect()
  WhiteListAdd: Observable<any> = this.actions
    .ofType(UsersActionTypes.WHITELIST_ADD)
    .map((action: WhiteListAdd) => action.payload)
    .switchMap(payload => {
      return this.userService.addWhiteList(payload.email, payload.name)
        .pipe(
          switchMap(contact => {
            contact.isUpdating = payload.id;
            return [new WhiteListAddSuccess(contact)];
          }),
          catchError(err => [new WhiteListAddError(err)]),
        );
    });

  @Effect()
  WhiteListDelete: Observable<any> = this.actions
    .ofType(UsersActionTypes.WHITELIST_DELETE)
    .map((action: WhiteListDelete) => action.payload)
    .switchMap(payload => {
      return this.userService.deleteWhiteList(payload)
        .pipe(
          switchMap(res => {
            return [
              new WhiteListDeleteSuccess(payload),
              new SnackPush({ message: 'Whitelist contact deleted successfully.' })
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to delete whitelist contact' })]),
        );
    });

  @Effect()
  BlackLists: Observable<any> = this.actions
    .ofType(UsersActionTypes.BLACKLIST)
    .map((action: BlackList) => action.payload)
    .switchMap(payload => {
      return this.userService.getBlackList().map(blackList => {
        return new BlackListsReadSuccess(blackList.results);
      });
    });

  @Effect()
  BlackListAdd: Observable<any> = this.actions
    .ofType(UsersActionTypes.BLACKLIST_ADD)
    .map((action: BlackListAdd) => action.payload)
    .switchMap(payload => {
      return this.userService.addBlackList(payload.email, payload.name)
        .pipe(
          switchMap(contact => {
            contact.isUpdating = payload.id;
            return [new BlackListAddSuccess(contact)];
          }),
          catchError(err => [new BlackListAddError(err)]),
        );
    });

  @Effect()
  BlackListDelete: Observable<any> = this.actions
    .ofType(UsersActionTypes.BLACKLIST_DELETE)
    .map((action: BlackListDelete) => action.payload)
    .switchMap(payload => {
      return this.userService.deleteBlackList(payload)
        .pipe(
          switchMap(res => {
            return [
              new BlackListDeleteSuccess(payload),
              new SnackPush({ message: 'Blacklist contact deleted successfully.' })
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to delete blacklist contact' })]),
        );
    });

  @Effect()
  settingsUpdate: Observable<any> = this.actions
    .ofType(UsersActionTypes.SETTINGS_UPDATE)
    .map((action: SettingsUpdate) => action.payload)
    .switchMap((payload: Settings) => {
      return this.userService.updateSettings(payload)
        .pipe(
          switchMap(res => {
            return [new SettingsUpdateSuccess(payload)];
          }),
          catchError(err => [new SnackErrorPush(err)]),
        );
    });

  @Effect()
  Contact: Observable<any> = this.actions
    .ofType(UsersActionTypes.CONTACT_GET)
    .map((action: ContactGet) => action.payload)
    .switchMap(payload => {
      return this.userService.getContact().map(contact => {
        return new ContactGetSuccess(contact.results);
      });
    });


  @Effect()
  ContactAdd: Observable<any> = this.actions.ofType(UsersActionTypes.CONTACT_ADD)
    .pipe(
      switchMap((action: Accounts) =>
        this.userService.addContact(action.payload)
          .pipe(
            switchMap(contact => {
              contact.isUpdating = action.payload.id;
              return [new ContactAddSuccess(contact)];
            }),
            catchError(err => [new ContactAddError()]),
          ))
    );

  @Effect()
  ContactDelete: Observable<any> = this.actions
    .ofType(UsersActionTypes.CONTACT_DELETE)
    .map((action: Accounts) => action.payload)
    .switchMap(payload => {
      return this.userService.deleteContact(payload).map(contact => {
        return new ContactDeleteSuccess(payload);
      });
    });

  @Effect()
  requestSnacks$: Observable<Action> = this.actions
    .ofType(UsersActionTypes.SNACK_PUSH)
    .pipe(
      map((action: SnackPush) => {
        if (action.payload) {
          if (action.payload.message) {
            if (action.payload.ids && action.payload.allowUndo) {
              this.notificationService.showUndo(action.payload);
            } else {
              this.notificationService.showSnackBar(action.payload.message);
            }
          } else {
            let message = 'An error has occured';
            if (action.payload.type) {
              message = action.payload.type + ' ' + message;
            }
            this.notificationService.showSnackBar(message);
          }
        } else {
          this.notificationService.showSnackBar('An error has occured');
        }
        return new SnackPushSuccess();
      }),
    );

  @Effect()
  requestErrorSnacks$: Observable<Action> = this.actions
    .ofType(UsersActionTypes.SNACK_ERROR_PUSH)
    .pipe(
      map((snackPushAction: SnackErrorPush) => {
        if (snackPushAction.payload && snackPushAction.payload.message) {
          this.notificationService.showSnackBar(snackPushAction.payload.message);
        } else {
          let message = 'An error has occured';
          if (snackPushAction.payload && snackPushAction.payload.type) {
            message = snackPushAction.payload.type + ' ' + message;
          }
          this.notificationService.showSnackBar(message);
        }
        return new SnackErrorPushSuccess();
      }),
    );

}
