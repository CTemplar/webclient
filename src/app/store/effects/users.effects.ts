// Angular
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
// Ngrx
import { Action } from '@ngrx/store';
// Rxjs
import { Observable } from 'rxjs';
import { EMPTY } from 'rxjs/internal/observable/empty';
import { of } from 'rxjs/internal/observable/of';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
// Service
import { MailService, SharedService, UsersService } from '../../store/services';
// Custom Actions
import {
  AccountDetailsGet,
  AccountDetailsGetSuccess,
  Accounts,
  AccountsReadSuccess,
  BlackListAdd,
  BlackListAddError,
  BlackListAddSuccess,
  BlackListDelete,
  BlackListDeleteSuccess,
  BlackListGet,
  BlackListsReadSuccess,
  CreateDomain,
  CreateDomainFailure,
  CreateDomainSuccess,
  CreateFilter,
  CreateFilterFailure,
  CreateFilterSuccess,
  CreateFolder,
  CreateFolderFailure,
  CreateFolderSuccess,
  DeleteDomain,
  DeleteDomainFailure,
  DeleteDomainSuccess,
  DeleteFilter,
  DeleteFilterFailure,
  DeleteFilterSuccess,
  DeleteFolder,
  DeleteFolderSuccess,
  GenerateInviteCode,
  GenerateInviteCodeFailure,
  GenerateInviteCodeSuccess,
  GetDomains,
  GetDomainsSuccess,
  GetFilters,
  GetFiltersSuccess,
  GetInviteCodes,
  GetInviteCodesSuccess,
  GetInvoices,
  GetInvoicesSuccess,
  GetNotification,
  GetNotificationSuccess,
  GetUnreadMailsCount,
  GetUpgradeAmount,
  GetUpgradeAmountSuccess,
  PaymentFailure,
  ReadDomain,
  ReadDomainFailure,
  ReadDomainSuccess,
  SaveAutoResponder,
  SaveAutoResponderFailure,
  SaveAutoResponderSuccess,
  SendEmailForwardingCode,
  SendEmailForwardingCodeFailure,
  SendEmailForwardingCodeSuccess,
  SettingsUpdate,
  SettingsUpdateSuccess,
  SnackErrorPush,
  SnackErrorPushSuccess,
  SnackPush,
  SnackPushSuccess,
  UpdateDomain,
  UpdateDomainFailure,
  UpdateDomainSuccess,
  UpdateFilter,
  UpdateFilterFailure,
  UpdateFilterSuccess,
  UpdateFolderOrder,
  UpdateFolderOrderSuccess,
  UsersActionTypes,
  ValidatePromoCode,
  ValidatePromoCodeSuccess,
  VerifyDomain,
  VerifyDomainFailure,
  VerifyDomainSuccess,
  VerifyEmailForwardingCode,
  VerifyEmailForwardingCodeFailure,
  VerifyEmailForwardingCodeSuccess,
  WhiteListAdd,
  WhiteListAddError,
  WhiteListAddSuccess,
  WhiteListDelete,
  WhiteListDeleteSuccess,
  WhiteListGet,
  WhiteListsReadSuccess,
  CardAdd,
  CardAddError,
  CardAddSuccess,
  CardDelete,
  CardDeleteSuccess,
  CardGet,
  CardReadSuccess,
  CardMakePrimary,
  CardMakePrimarySuccess
} from '../actions';

import { Settings } from '../datatypes';
import { NotificationService } from '../services/notification.service';
import { GetOrganizationUsers } from '../organization.store';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable()
export class UsersEffects {
  constructor(
    private actions: Actions,
    private userService: UsersService,
    private notificationService: NotificationService,
    private mailService: MailService,
    private sharedService: SharedService
  ) {}

  @Effect()
  Accounts: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.ACCOUNTS),
    map((action: Accounts) => action.payload),
    switchMap(payload => {
      return this.userService.getAccounts('34324').pipe(
        map(user => {
          return new AccountsReadSuccess(user);
        })
      );
    })
  );

  @Effect()
  AccountDetails: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.ACCOUNT_DETAILS_GET),
    map((action: Accounts) => action.payload),
    switchMap(payload => {
      return this.userService.getAccountDetails().pipe(
        map(user => {
          return new AccountDetailsGetSuccess(user[0]);
        }),
        catchError(error => EMPTY)
      );
    })
  );

  @Effect()
  WhiteLists: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.WHITELIST_GET),
    map((action: WhiteListGet) => action.payload),
    switchMap(payload => {
      return this.userService.getWhiteList().pipe(
        map(whiteList => {
          return new WhiteListsReadSuccess(whiteList.results);
        }),
        catchError(error => EMPTY)
      );
    })
  );

  @Effect()
  WhiteListAdd: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.WHITELIST_ADD),
    map((action: WhiteListAdd) => action.payload),
    switchMap(payload => {
      return this.userService.addWhiteList(payload.email, payload.name).pipe(
        switchMap(contact => {
          contact.isUpdating = payload.id;
          return of(
            new WhiteListAddSuccess(contact),
            new WhiteListGet(),
            new BlackListGet(),
            new SnackPush({ message: 'Email added to whitelist successfully.' })
          );
        }),
        catchError(err => of(new WhiteListAddError(err.error)))
      );
    })
  );

  @Effect()
  WhiteListDelete: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.WHITELIST_DELETE),
    map((action: WhiteListDelete) => action.payload),
    switchMap(payload => {
      return this.userService.deleteWhiteList(payload).pipe(
        switchMap(res => {
          return of(
            new WhiteListDeleteSuccess(payload),
            new SnackPush({ message: 'Whitelist contact deleted successfully.' })
          );
        }),
        catchError(err => of(new SnackErrorPush({ message: 'Failed to delete whitelist contact' })))
      );
    })
  );

  @Effect()
  CardLists: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.CARD_GET),
    map((action: CardGet) => action.payload),
    switchMap(payload => {
      return this.userService.getPaymentMethods().pipe(
        map(cardList => {
          return new CardReadSuccess(cardList);
        }),
        catchError(error => EMPTY)
      );
    })
  );

  @Effect()
  CardAdd: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.CARD_ADD),
    map((action: CardAdd) => action.payload),
    switchMap(payload => {
      return this.userService.addPaymentMethod(payload).pipe(
        switchMap(card => {
          return of(new CardAddSuccess(card), new SnackPush({ message: 'Payment method added successfully.' }));
        }),
        catchError(err => {
          return of(new CardAddError(err.error), new SnackPush({ message: err.error.msg || '' }));
        })
      );
    })
  );

  @Effect()
  CardDelete: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.CARD_DELETE),
    map((action: CardDelete) => action.payload),
    switchMap(payload => {
      return this.userService.deletePaymentMethod(payload).pipe(
        switchMap(res => {
          return of(new CardDeleteSuccess(payload), new SnackPush({ message: 'Payment method deleted successfully.' }));
        }),
        catchError(err => {
          return of(new SnackPush({ message: err.error.msg || '' }));
        })
      );
    })
  );

  @Effect()
  CardMakePrimary: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.CARD_MAKE_PRIMARY),
    map((action: CardMakePrimary) => action.payload),
    switchMap(payload => {
      return this.userService.makePaymentPrimary(payload).pipe(
        switchMap(res => {
          return of(
            new CardMakePrimarySuccess(payload),
            new SnackPush({ message: 'Primary card has been changed successfully.' })
          );
        }),
        catchError(err => {
          return of(new SnackPush({ message: err.error.msg || '' }));
        })
      );
    })
  );

  @Effect()
  BlackLists: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.BLACKLIST_GET),
    map((action: BlackListGet) => action.payload),
    switchMap(payload => {
      return this.userService.getBlackList().pipe(
        map(blackList => {
          return new BlackListsReadSuccess(blackList.results);
        }),
        catchError(error => EMPTY)
      );
    })
  );

  @Effect()
  BlackListAdd: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.BLACKLIST_ADD),
    map((action: BlackListAdd) => action.payload),
    switchMap(payload => {
      return this.userService.addBlackList(payload.email, payload.name).pipe(
        switchMap(contact => {
          contact.isUpdating = payload.id;
          return of(new BlackListAddSuccess(contact), new BlackListGet());
        }),
        catchError(err => of(new BlackListAddError(err)))
      );
    })
  );

  @Effect()
  BlackListDelete: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.BLACKLIST_DELETE),
    map((action: BlackListDelete) => action.payload),
    switchMap(payload => {
      return this.userService.deleteBlackList(payload).pipe(
        switchMap(res => {
          return of(
            new BlackListDeleteSuccess(payload),
            new SnackPush({ message: 'Blacklist contact deleted successfully.' })
          );
        }),
        catchError(err => of(new SnackErrorPush({ message: 'Failed to delete blacklist contact' })))
      );
    })
  );

  @Effect()
  settingsUpdate: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.SETTINGS_UPDATE),
    map((action: SettingsUpdate) => action.payload),
    switchMap((payload: Settings) => {
      return this.userService.updateSettings(payload).pipe(
        switchMap(res => {
          return of(new SettingsUpdateSuccess(payload));
        }),
        catchError(err => of(new SnackErrorPush({ message: `Failed to save changes, ${err.error}` })))
      );
    })
  );

  @Effect()
  requestSnacks$: Observable<Action> = this.actions.pipe(
    ofType(UsersActionTypes.SNACK_PUSH),
    map((action: SnackPush) => {
      if (action.payload) {
        if (action.payload.message) {
          if (action.payload.ids && action.payload.allowUndo) {
            this.notificationService.showUndo(action.payload);
          } else {
            const config: MatSnackBarConfig = { duration: 5000 };
            if (action.payload.duration) {
              config.duration = action.payload.duration;
            }
            this.notificationService.showSnackBar(action.payload.message, 'CLOSE', config);
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
    })
  );

  @Effect()
  requestErrorSnacks$: Observable<Action> = this.actions.pipe(
    ofType(UsersActionTypes.SNACK_ERROR_PUSH),
    map((snackPushAction: SnackErrorPush) => {
      if (snackPushAction.payload && snackPushAction.payload.message) {
        this.notificationService.showSnackBar(
          snackPushAction.payload.message,
          snackPushAction.payload.action || 'CLOSE',
          { duration: snackPushAction.payload.duration || 5000 }
        );
      } else {
        let message = 'An error has occured';
        if (snackPushAction.payload && snackPushAction.payload.type) {
          message = snackPushAction.payload.type + ' ' + message;
        }
        this.notificationService.showSnackBar(message);
      }
      return new SnackErrorPushSuccess();
    })
  );

  @Effect()
  createFolderEffect: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.CREATE_FOLDER),
    map((action: CreateFolder) => action.payload),
    switchMap(folder => {
      return this.mailService.createFolder(folder).pipe(
        switchMap(res => {
          const actions: any[] = [
            new CreateFolderSuccess(res),
            new SnackErrorPush({
              message: `'${folder.name}' folder ${folder.id ? 'updated' : 'created'} successfully.`
            })
          ];
          if (folder.id) {
            actions.push(new GetUnreadMailsCount(), new GetFilters());
          }
          return of(...actions);
        }),
        catchError(err =>
          of(
            new SnackErrorPush({ message: err.error ? err.error : 'Failed to create folder.' }),
            new CreateFolderFailure()
          )
        )
      );
    })
  );

  @Effect()
  deleteFolderEffect: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.DELETE_FOLDER),
    map((action: DeleteFolder) => action.payload),
    switchMap(folder => {
      return this.mailService.deleteFolder(folder.id).pipe(
        switchMap(res => {
          return of(
            new DeleteFolderSuccess(folder),
            new SnackErrorPush({ message: `'${folder.name}' folder deleted successfully.` })
          );
        }),
        catchError(err => of(new SnackErrorPush({ message: err.error ? err.error : 'Failed to delete folder.' })))
      );
    })
  );

  @Effect()
  updateFoldersOrder: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.UPDATE_FOLDER_ORDER),
    map((action: UpdateFolderOrder) => action.payload),
    switchMap(payload => {
      return this.mailService.updateFoldersOrder(payload.data).pipe(
        switchMap(res => {
          return of(
            new UpdateFolderOrderSuccess({ folders: payload.folders }),
            new SnackErrorPush({ message: 'Sort order saved successfully.' })
          );
        }),
        catchError(err =>
          of(new SnackErrorPush({ message: err.error ? err.error : 'Failed to update folders sort order.' }))
        )
      );
    })
  );

  @Effect()
  getFiltersEffect: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.GET_FILTERS),
    map((action: GetFilters) => action.payload),
    switchMap(payload => {
      return this.userService.getFilters(payload).pipe(
        switchMap(res => of(new GetFiltersSuccess(res.results))),
        catchError(err => EMPTY)
      );
    })
  );

  @Effect()
  createFilterEffect: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.CREATE_FILTER),
    map((action: CreateFilter) => action.payload),
    switchMap(payload => {
      return this.userService.createFilter(payload).pipe(
        switchMap(res =>
          of(
            new CreateFilterSuccess(res),
            new SnackErrorPush({ message: `The filter “${payload.name}” has been added.` })
          )
        ),
        catchError(errorResponse =>
          of(
            new CreateFilterFailure(errorResponse.error),
            new SnackErrorPush({
              message: errorResponse.error ? errorResponse.error : 'An error occurred, please try again.'
            })
          )
        )
      );
    })
  );

  @Effect()
  updateFilterEffect: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.UPDATE_FILTER),
    map((action: UpdateFilter) => action.payload),
    switchMap(payload => {
      return this.userService.createFilter(payload).pipe(
        switchMap(res =>
          of(
            new UpdateFilterSuccess(res),
            new SnackErrorPush({ message: `The filter “${payload.name}” has been updated.` })
          )
        ),
        catchError(errorResponse =>
          of(
            new UpdateFilterFailure(errorResponse.error),
            new SnackErrorPush({
              message: errorResponse.error ? errorResponse.error : 'An error occurred, please try again.'
            })
          )
        )
      );
    })
  );

  @Effect()
  deleteFilterEffect: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.DELETE_FILTER),
    map((action: DeleteFilter) => action.payload),
    switchMap(filter => {
      return this.userService.deleteFilter(filter.id).pipe(
        switchMap(res =>
          of(
            new DeleteFilterSuccess(filter),
            new SnackErrorPush({ message: `The filter “${filter.name}” has been deleted.` })
          )
        ),
        catchError(errorResponse =>
          of(
            new SnackErrorPush({ message: errorResponse.error ? errorResponse.error : 'Failed to delete filter.' }),
            new DeleteFilterFailure(errorResponse.error)
          )
        )
      );
    })
  );

  @Effect()
  Domains: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.GET_DOMAINS),
    map((action: GetDomains) => action.payload),
    switchMap(payload => {
      return this.userService.getDomains().pipe(
        map(emailDomains => {
          return new GetDomainsSuccess(emailDomains.results.sort((a, b) => a.id - b.id));
        }),
        catchError(error => EMPTY)
      );
    })
  );

  @Effect()
  DomainCreate: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.CREATE_DOMAIN),
    map((action: CreateDomain) => action.payload),
    switchMap(payload => {
      return this.userService.createDomain(payload).pipe(
        switchMap(res => of(new CreateDomainSuccess(res))),
        catchError(errorResponse => of(new CreateDomainFailure(errorResponse.error)))
      );
    })
  );

  @Effect()
  updateDomain: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.UPDATE_DOMAIN),
    map((action: UpdateDomain) => action.payload),
    switchMap(payload => {
      return this.userService.updateDomain(payload).pipe(
        switchMap(res => of(new UpdateDomainSuccess(res), new SnackPush({ message: `Domain updated successfully` }))),
        catchError(errorResponse =>
          of(
            new UpdateDomainFailure(errorResponse.error),
            new SnackPush({
              message: errorResponse.error ? errorResponse.error : 'Failed to update domain, please try again.'
            })
          )
        )
      );
    })
  );

  @Effect()
  DomainRead: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.READ_DOMAIN),
    map((action: ReadDomain) => action.payload),
    switchMap(payload => {
      return this.userService.readDomain(payload).pipe(
        switchMap(res => of(new ReadDomainSuccess(res))),
        catchError(errorResponse => of(new ReadDomainFailure({ err: errorResponse.error })))
      );
    })
  );

  @Effect()
  DomainDelete: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.DELETE_DOMAIN),
    map((action: DeleteDomain) => action.payload),
    switchMap(payload => {
      return this.userService.deleteDomain(payload).pipe(
        switchMap(res => of(new DeleteDomainSuccess(payload), new GetOrganizationUsers())),
        catchError(errorResponse => of(new DeleteDomainFailure(errorResponse.error)))
      );
    })
  );

  @Effect()
  DomainVerify: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.VERIFY_DOMAIN),
    map((action: VerifyDomain) => action.payload),
    switchMap(payload => {
      return this.userService.verifyDomain(payload.id).pipe(
        switchMap(res => {
          return of(
            new VerifyDomainSuccess({
              res,
              step: payload.currentStep,
              gotoNextStep: payload.gotoNextStep,
              reverify: payload.reverify
            })
          );
        }),
        catchError(errorResponse =>
          of(new VerifyDomainFailure({ err: errorResponse.error, step: payload.currentStep }))
        )
      );
    })
  );

  @Effect({ dispatch: false })
  paymentFailureEffect: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.PAYMENT_FAILURE),
    map((action: PaymentFailure) => action.payload),
    tap(payload => {
      this.sharedService.showPaymentFailureDialog();
    })
  );

  @Effect()
  SendEmailForwardingCode: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.SEND_EMAIL_FORWARDING_CODE),
    map((action: SendEmailForwardingCode) => action.payload),
    switchMap(payload => {
      return this.userService.sendEmailForwardingCode(payload.email).pipe(
        switchMap(res => of(new SendEmailForwardingCodeSuccess(res))),
        catchError(errorResponse => of(new SendEmailForwardingCodeFailure(errorResponse.error)))
      );
    })
  );

  @Effect()
  VerifyEmailForwardingCode: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.VERIFY_EMAIL_FORWARDING_CODE),
    map((action: VerifyEmailForwardingCode) => action.payload),
    switchMap(payload => {
      return this.userService.verifyEmailForwardingCode(payload.email, payload.code).pipe(
        switchMap(res => {
          return of(new AccountDetailsGet(), new VerifyEmailForwardingCodeSuccess(res));
        }),
        catchError(errorResponse => of(new VerifyEmailForwardingCodeFailure(errorResponse.error)))
      );
    })
  );

  @Effect()
  SaveAutoResponder: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.SAVE_AUTORESPONDER),
    map((action: SaveAutoResponder) => action.payload),
    switchMap(payload => {
      return this.userService.saveAutoResponder(payload).pipe(
        switchMap(res => {
          return of(new SnackPush({ message: `Saved successfully` }), new SaveAutoResponderSuccess(res));
        }),
        catchError(errorResponse =>
          of(
            new SnackErrorPush({ message: 'Failed to save autoresponder. Please try again.' }),
            new SaveAutoResponderFailure(errorResponse.error)
          )
        )
      );
    })
  );

  @Effect()
  getInvoicesEffect: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.GET_INVOICES),
    map((action: GetInvoices) => action.payload),
    switchMap(payload => {
      return this.userService.getInvoices().pipe(
        switchMap(res => of(new GetInvoicesSuccess(res.results))),
        catchError(err => EMPTY)
      );
    })
  );

  @Effect()
  getUpgradeAmountEffect: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.GET_UPGRADE_AMOUNT),
    map((action: GetUpgradeAmount) => action.payload),
    switchMap(payload => {
      return this.userService.getUpgradeAmount(payload).pipe(
        switchMap(res => of(new GetUpgradeAmountSuccess(res))),
        catchError(err => EMPTY)
      );
    })
  );

  @Effect()
  validatePromoCode: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.VALIDATE_PROMO_CODE),
    map((action: ValidatePromoCode) => action.payload),
    switchMap(payload => {
      return this.userService.validatePromoCode(payload).pipe(
        switchMap(res => of(new ValidatePromoCodeSuccess(res))),
        catchError(err => EMPTY)
      );
    })
  );

  @Effect()
  getInviteCodes: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.INVITE_CODE_GET),
    map((action: GetInviteCodes) => action.payload),
    switchMap(payload => {
      return this.userService.getInviteCodes().pipe(
        switchMap(res => of(new GetInviteCodesSuccess(res))),
        catchError(err => EMPTY)
      );
    })
  );

  @Effect()
  generateInviteCode: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.INVITE_CODE_GENERATE),
    map((action: GenerateInviteCode) => action.payload),
    switchMap(payload => {
      return this.userService.generateInviteCodes().pipe(
        switchMap(res => of(new GenerateInviteCodeSuccess(res))),
        catchError(errorResponse =>
          of(
            new SnackErrorPush({
              message: errorResponse.error
                ? errorResponse.error
                : 'Failed generate invite code, try again or contact support.'
            }),
            new GenerateInviteCodeFailure()
          )
        )
      );
    })
  );

  @Effect()
  GetNotificationsEffect: Observable<any> = this.actions.pipe(
    ofType(UsersActionTypes.GET_NOTIFICATION),
    map((action: GetNotification) => action.payload),
    switchMap(payload => {
      return this.userService.getUserNotifications().pipe(
        switchMap(resp => of(new GetNotificationSuccess(resp))),
        catchError(error => EMPTY)
      );
    })
  );
}
