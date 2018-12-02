import { HttpResponse } from '@angular/common/http';
// Angular
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
// Ngrx
import { Action } from '@ngrx/store';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
// Rxjs
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
// Service
import { MailService, UsersService } from '../../store/services';
// Custom Actions
import {
  AccountDetailsGet,
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
  ContactGetSuccess,
  ContactImport,
  ContactImportFailure,
  ContactImportSuccess,
  CreateFilter,
  CreateFilterFailure,
  CreateFilterSuccess,
  CreateFolder,
  CreateFolderSuccess,
  DeleteFilter,
  DeleteFilterFailure,
  DeleteFilterSuccess,
  DeleteFolder,
  DeleteFolderSuccess,
  GetFilters,
  GetFiltersSuccess,
  SettingsUpdate,
  SettingsUpdateSuccess,
  SnackErrorPush,
  SnackErrorPushSuccess,
  SnackPush,
  SnackPushSuccess,
  UpdateFilter,
  UpdateFilterFailure,
  UpdateFilterSuccess,
  UsersActionTypes,
  WhiteList,
  WhiteListAdd,
  WhiteListAddError,
  WhiteListAddSuccess,
  WhiteListDelete,
  WhiteListDeleteSuccess,
  WhiteListsReadSuccess,
  EmailDomainsGet,
  EmailDomainsGetSuccess,
  EmailCreateDomain,
  EmailCreateDomainSuccess,
  EmailCreateDomainFailure,
  EmailReadDomain,
  EmailReadDomainSuccess,
  EmailReadDomainFailure,
} from '../actions';
import { Settings } from '../datatypes';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class UsersEffects {
  constructor(
    private actions: Actions,
    private userService: UsersService,
    private notificationService: NotificationService,
    private mailService: MailService,
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
      return this.userService.getAccountDetails()
        .pipe(
          map(user => {
            return new AccountDetailsGetSuccess(user[0]);
          }),
          catchError((error) => [])
        );
    });

  @Effect()
  WhiteLists: Observable<any> = this.actions
    .ofType(UsersActionTypes.WHITELIST)
    .map((action: WhiteList) => action.payload)
    .switchMap(payload => {
      return this.userService.getWhiteList()
        .pipe(
          map(whiteList => {
            return new WhiteListsReadSuccess(whiteList.results);
          }),
          catchError((error) => [])
        );
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
            return [new WhiteListAddSuccess(contact), new AccountDetailsGet()];
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
      return this.userService.getBlackList()
        .pipe(
          map(blackList => {
            return new BlackListsReadSuccess(blackList.results);
          }),
          catchError((error) => [])
        );
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
            return [new BlackListAddSuccess(contact), new AccountDetailsGet()];
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
      return this.userService.getContact()
        .pipe(
          map(contact => {
            return new ContactGetSuccess(contact.results);
          }),
          catchError((error) => [])
        );
    });


  @Effect()
  ContactAdd: Observable<any> = this.actions.ofType(UsersActionTypes.CONTACT_ADD)
    .pipe(
      switchMap((action: Accounts) =>
        this.userService.addContact(action.payload)
          .pipe(
            switchMap(contact => {
              contact.isUpdating = action.payload.id;
              return [
                new ContactAddSuccess(contact),
                new SnackPush({ message: `Contact ${action.payload.id ? 'updated' : 'saved'} successfully.` })
              ];
            }),
            catchError(err => [
              new ContactAddError(),
              new SnackErrorPush({ message: `Failed to ${action.payload.id ? 'update' : 'save'} contact.` })
            ]),
          ))
    );

  @Effect()
  ContactDelete: Observable<any> = this.actions
    .ofType(UsersActionTypes.CONTACT_DELETE)
    .map((action: Accounts) => action.payload)
    .switchMap(payload => {
      return this.userService.deleteContact(payload)
        .pipe(
          switchMap(contact => {
            return [
              new ContactDeleteSuccess(payload),
              new SnackPush({ message: 'Contacts deleted successfully.' })
            ];
          }),
          catchError((error) => [])
        );
    });

  @Effect()
  ContactImport: Observable<any> = this.actions
    .ofType(UsersActionTypes.CONTACT_IMPORT)
    .map((action: ContactImport) => action.payload)
    .switchMap(payload => {
      return this.userService.importContacts(payload)
        .pipe(
          mergeMap(event => {
            if (event instanceof HttpResponse) {
              return [
                new ContactImportSuccess(event.body),
                new ContactGet({}),
                new SnackPush({ message: 'Contacts imported successfully' })
              ];
            } else {
              return [];
            }
          }),
          catchError(error => {
            return [
              new SnackErrorPush({ message: 'Failed to import contacts' }),
              new ContactImportFailure(error)
            ];
          })
        );
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
          this.notificationService.showSnackBar(snackPushAction.payload.message, snackPushAction.payload.action || 'CLOSE',
            {duration: snackPushAction.payload.duration || 5000});
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

  @Effect()
  createFolderEffect: Observable<any> = this.actions
    .ofType(UsersActionTypes.CREATE_FOLDER)
    .map((action: CreateFolder) => action.payload)
    .switchMap(payload => {
      return this.mailService.createFolder(payload)
        .pipe(
          switchMap(res => {
            return [
              new CreateFolderSuccess(res)
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to create folder.' })])
        );
    });

  @Effect()
  deleteFolderEffect: Observable<any> = this.actions
    .ofType(UsersActionTypes.DELETE_FOLDER)
    .map((action: DeleteFolder) => action.payload)
    .switchMap(folder => {
      return this.mailService.deleteFolder(folder.id)
        .pipe(
          switchMap(res => {
            return [
              new DeleteFolderSuccess(folder)
            ];
          }),
          catchError(err => [new SnackErrorPush({ message: 'Failed to delete folder.' })])
        );
    });

  @Effect()
  getFiltersEffect: Observable<any> = this.actions
    .ofType(UsersActionTypes.GET_FILTERS)
    .map((action: GetFilters) => action.payload)
    .switchMap(payload => {
      return this.userService.getFilters(payload)
        .pipe(
          switchMap(res => {
            return [new GetFiltersSuccess(res.results)];
          }),
          catchError(err => [])
        );
    });

  @Effect()
  createFilterEffect: Observable<any> = this.actions
    .ofType(UsersActionTypes.CREATE_FILTER)
    .map((action: CreateFilter) => action.payload)
    .switchMap(payload => {
      return this.userService.createFilter(payload)
        .pipe(
          switchMap(res => {
            return [new CreateFilterSuccess(res)];
          }),
          catchError(errorResponse => [
            new CreateFilterFailure(errorResponse.error)
          ])
        );
    });

  @Effect()
  updateFilterEffect: Observable<any> = this.actions
    .ofType(UsersActionTypes.UPDATE_FILTER)
    .map((action: UpdateFilter) => action.payload)
    .switchMap(payload => {
      return this.userService.createFilter(payload)
        .pipe(
          switchMap(res => {
            return [new UpdateFilterSuccess(res)];
          }),
          catchError(errorResponse => [
            new UpdateFilterFailure(errorResponse.error)
          ])
        );
    });

  @Effect()
  deleteFilterEffect: Observable<any> = this.actions
    .ofType(UsersActionTypes.DELETE_FILTER)
    .map((action: DeleteFilter) => action.payload)
    .switchMap(filter => {
      return this.userService.deleteFilter(filter.id)
        .pipe(
          switchMap(res => {
            return [new DeleteFilterSuccess(filter)];
          }),
          catchError(errorResponse => [
            new SnackErrorPush({ message: 'Failed to delete filter.' }),
            new DeleteFilterFailure(errorResponse.error)
          ])
        );
    });

  @Effect()
  EmailDomains: Observable<any> = this.actions
    .ofType(UsersActionTypes.EMAIL_DOMAINS_GET)
    .map((action: EmailDomainsGet) => action.payload)
    .switchMap(payload => {
      return this.userService.getEmailDomains()
        .pipe(
          map(emailDomains => {
            return new EmailDomainsGetSuccess(emailDomains.results);
          }),
          catchError((error) => [])
        );
    });

  @Effect()
  EmailCreateDomainEffect: Observable<any> = this.actions
    .ofType(UsersActionTypes.EMAIL_CREATE_DOMAIN)
    .map((action: EmailCreateDomain) => action.payload)
    .switchMap(payload => {
      return this.userService.createEmailDomain(payload)
        .pipe(
          switchMap(res => {
            return [new EmailCreateDomainSuccess(res)];
          }),
          catchError(err => [
            new EmailCreateDomainFailure(err.error)
          ]),
        );
    });

  @Effect()
  EmailReadDomainEffect: Observable<any> = this.actions
    .ofType(UsersActionTypes.EMAIL_READ_DOMAIN)
    .map((action: EmailReadDomain) => action.payload)
    .switchMap(payload => {
      return this.userService.readEmailDomain(payload)
        .pipe(
          switchMap(res => {
            return [new EmailReadDomainSuccess(res)];
          }),
          catchError(err => [
            new EmailReadDomainFailure(err.error)
          ]),
        );
    });
}
