// Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// Ngrx
import { Actions, Effect, ofType } from '@ngrx/effects';
// Rxjs
import { Observable } from 'rxjs';


import { catchError, map, switchMap, tap } from 'rxjs/operators';
// Service
import { UsersService } from '../../store/services';
// Custom Actions
import {
  AccountDetailsGet,
  AuthActionTypes, ChangePassword, ChangePasswordFailed, ChangePasswordSuccess,
  CheckUsernameAvailability, CheckUsernameAvailabilitySuccess, DeleteAccount, DeleteAccountFailure, DeleteAccountSuccess,
  LogIn,
  LogInFailure,
  LogInSuccess, Logout,
  RecoverPassword, RecoverPasswordFailure,
  RecoverPasswordSuccess,
  ResetPassword,
  ResetPasswordFailure, ResetPasswordSuccess,
  SignUp,
  SignUpFailure,
  SignUpSuccess,
  SnackErrorPush, SnackPush, UpgradeAccount, UpgradeAccountFailure, UpgradeAccountSuccess
} from '../actions';
import { SignupState } from '../datatypes';
import { NotificationService } from '../services/notification.service';
import { of } from 'rxjs/internal/observable/of';


@Injectable()
export class AuthEffects {

  constructor(
    private actions: Actions,
    private authService: UsersService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  @Effect()
  LogIn: Observable<any> = this.actions
    .pipe(
      ofType(AuthActionTypes.LOGIN),
      map((action: LogIn) => action.payload),
      switchMap(payload => {
        return this.authService.signIn(payload)
          .pipe(
            map((user) => new LogInSuccess(user)),
            catchError((errorResponse: any) => of(new LogInFailure(errorResponse.error)))
          );
      }));


  @Effect({ dispatch: false })
  LogInSuccess: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_SUCCESS),
    tap((user) => {
      this.router.navigateByUrl('/mail');
    })
  );

  @Effect({ dispatch: false })
  LogInFailure: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_FAILURE)
  );

  @Effect()
  SignUp: Observable<any> = this.actions
    .pipe(
      ofType(AuthActionTypes.SIGNUP),
      map((action: SignUp) => action.payload),
      switchMap((payload: SignupState) => {
        delete payload.monthlyPrice;
        delete payload.annualPricePerMonth;
        delete payload.annualPriceTotal;

        return this.authService.signUp(payload)
          .pipe(
            switchMap((user) => of(
              new SignUpSuccess(user),
              new LogInSuccess(user)
            )),
            catchError((errorResponse) => of(new SignUpFailure(errorResponse.error),
              new SnackErrorPush({ message: 'Failed to signup, please try again.' })))
          );
      }));

  @Effect({ dispatch: false })
  public LogOut: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGOUT),
    tap((action) => {
      this.authService.signOut();
    })
  );


  @Effect()
  checkUsernameAvailability: Observable<any> = this.actions
    .pipe(
      ofType(AuthActionTypes.CHECK_USERNAME_AVAILABILITY),
      map((action: CheckUsernameAvailability) => action.payload),
      switchMap(payload => {
        if (!payload) {
          return of(new CheckUsernameAvailabilitySuccess({ exists: true }));
        }
        return this.authService.checkUsernameAvailability(payload)
          .pipe(
            map((response) => new CheckUsernameAvailabilitySuccess(response)),
            catchError((error) => of(new SnackErrorPush({ message: 'Failed to check username availability.' })))
          );
      }));

  @Effect()
  RecoverPassword: Observable<any> = this.actions
    .pipe(
      ofType(AuthActionTypes.RECOVER_PASSWORD),
      map((action: RecoverPassword) => action.payload),
      switchMap(payload => {
        return this.authService.recoverPassword(payload)
          .pipe(
            switchMap((res) => of(new RecoverPasswordSuccess(res))),
            catchError((error) => of(new RecoverPasswordFailure(error.error)))
          );
      }));

  @Effect()
  ResetPassword: Observable<any> = this.actions
    .pipe(
      ofType(AuthActionTypes.RESET_PASSWORD),
      map((action: ResetPassword) => action.payload),
      switchMap(payload => {
        return this.authService.resetPassword(payload)
          .pipe(
            switchMap((user) => of(
              new LogInSuccess(user),
              new ResetPasswordSuccess(user)
            )),
            catchError((error) => of(new ResetPasswordFailure(error.error)))
          );
      })
    );

  @Effect()
  UpgradeAccount: Observable<any> = this.actions
    .pipe(
      ofType(AuthActionTypes.UPGRADE_ACCOUNT),
      map((action: UpgradeAccount) => action.payload),
      switchMap(payload => {
        return this.authService.upgradeAccount(payload)
          .pipe(
            switchMap((res) => {
              return of(new UpgradeAccountSuccess(res), new AccountDetailsGet());
            }),
            catchError((error) => of(new UpgradeAccountFailure(error.error),
              new SnackErrorPush({ message: 'Failed to upgrade account, please try again.' })))
          );
      })
    );

  @Effect()
  ChangePassword: Observable<any> = this.actions
    .pipe(
      ofType(AuthActionTypes.CHANGE_PASSWORD),
      map((action: ChangePassword) => action.payload),
      switchMap(payload => {
        return this.authService.changePassword(payload)
          .pipe(
            switchMap((user) => of(
              new ChangePasswordSuccess(payload),
              new SnackPush({ message: 'Password changed successfully.' })
            )),
            catchError((response: any) => of(
              new SnackErrorPush({ message: `Failed to change password, ${response.error}` }),
              new ChangePasswordFailed(response),
            ))
          );
      })
    );

  @Effect()
  DeleteAccount: Observable<any> = this.actions
    .pipe(
      ofType(AuthActionTypes.DELETE_ACCOUNT),
      map((action: DeleteAccount) => action.payload),
      switchMap(payload => {
        return this.authService.deleteAccount(payload)
          .pipe(
            switchMap((user) => of(
              new DeleteAccountSuccess(),
              new SnackPush({ message: 'Account deleted successfully.' }),
              new Logout()
            )),
            catchError((errorResponse) => of(
              new DeleteAccountFailure(errorResponse.error),
              new SnackErrorPush({
                message: errorResponse.error && errorResponse.error.detail ? errorResponse.error.detail :
                  'Failed to delete account, please try again.'
              })
            ))
          );
      })
    );

}
