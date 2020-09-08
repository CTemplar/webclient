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
  AuthActionTypes,
  ChangePassword,
  ChangePasswordFailed,
  ChangePasswordSuccess,
  CheckUsernameAvailability,
  CheckUsernameAvailabilityError,
  CheckUsernameAvailabilitySuccess,
  DeleteAccount,
  DeleteAccountFailure,
  DeleteAccountSuccess,
  Update2FA,
  Update2FASuccess,
  ExpireSession,
  Get2FASecret,
  Get2FASecretSuccess,
  GetCaptcha,
  GetCaptchaSuccess,
  GetInvoices,
  LogIn,
  LogInFailure,
  LogInSuccess,
  Logout,
  RecoverPassword,
  RecoverPasswordFailure,
  RecoverPasswordSuccess,
  ResetPassword,
  ResetPasswordFailure,
  ResetPasswordSuccess,
  SignUp,
  SignUpFailure,
  SignUpSuccess,
  SnackErrorPush,
  SnackPush,
  UpgradeAccount,
  UpgradeAccountFailure,
  UpgradeAccountSuccess,
  VerifyCaptcha,
  VerifyCaptchaSuccess,
  SettingsUpdateSuccess,
  GetMailboxes,
  RefreshToken
} from '../actions';
import { PlanType, SignupState } from '../datatypes';
import { NotificationService } from '../services/notification.service';
import { of } from 'rxjs/internal/observable/of';
import { EMPTY } from 'rxjs/internal/observable/empty';

@Injectable()
export class AuthEffects {
  constructor(
    private actions: Actions,
    private authService: UsersService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  @Effect()
  LogIn: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN),
    map((action: LogIn) => action.payload),
    switchMap(payload => {
      return this.authService.signIn(payload).pipe(
        map(response => new LogInSuccess(response)),
        catchError((errorResponse: any) => of(new LogInFailure(errorResponse.error)))
      );
    })
  );

  @Effect({ dispatch: false })
  LogInSuccess: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGIN_SUCCESS),
    tap(response => {
      if (response.payload.is_2fa_enabled || !response.payload.anti_phishing_phrase) {
        this.router.navigateByUrl('/mail');
      }
    })
  );

  @Effect({ dispatch: false })
  LogInFailure: Observable<any> = this.actions.pipe(ofType(AuthActionTypes.LOGIN_FAILURE));

  @Effect({ dispatch: false })
  RefreshToken: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.REFRESH_TOKEN),
    map((action: RefreshToken) => action.payload),
    switchMap(() => {
      return this.authService.refreshToken();
    })
  );

  @Effect()
  SignUp: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.SIGNUP),
    map((action: SignUp) => action.payload),
    switchMap((payload: SignupState) => {
      delete payload.monthlyPrice;
      delete payload.annualPricePerMonth;
      delete payload.annualPriceTotal;

      return this.authService.signUp(payload).pipe(
        switchMap(user => of(new SignUpSuccess(user), new LogInSuccess(user))),
        catchError(errorResponse =>
          of(
            new SignUpFailure(errorResponse.error),
            new SnackErrorPush({ message: 'Failed to signup, please try again.' })
          )
        )
      );
    })
  );

  @Effect({ dispatch: false })
  public LogOut: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGOUT),
    tap(action => {
      this.authService.signOut();
    })
  );

  @Effect()
  expireSession: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.EXPIRE_SESSION),
    map((action: ExpireSession) => action.payload),
    switchMap(payload => {
      return this.authService.expireSession().pipe(
        switchMap(res => EMPTY),
        catchError(error => of(new SnackErrorPush({ message: 'Failed to expire user session.' })))
      );
    })
  );

  @Effect()
  checkUsernameAvailability: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.CHECK_USERNAME_AVAILABILITY),
    map((action: CheckUsernameAvailability) => action.payload),
    switchMap(payload => {
      if (!payload) {
        return of(new CheckUsernameAvailabilitySuccess({ exists: true }));
      }
      return this.authService.checkUsernameAvailability(payload).pipe(
        map(response => new CheckUsernameAvailabilitySuccess(response)),
        catchError(error =>
          of(
            new SnackErrorPush({ message: `Failed to check username availability. ${error.error}` }),
            new CheckUsernameAvailabilityError()
          )
        )
      );
    })
  );

  @Effect()
  RecoverPassword: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.RECOVER_PASSWORD),
    map((action: RecoverPassword) => action.payload),
    switchMap(payload => {
      return this.authService.recoverPassword(payload).pipe(
        switchMap(res => of(new RecoverPasswordSuccess(res))),
        catchError(error => of(new RecoverPasswordFailure(error.error)))
      );
    })
  );

  @Effect()
  ResetPassword: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.RESET_PASSWORD),
    map((action: ResetPassword) => action.payload),
    switchMap(payload => {
      return this.authService.resetPassword(payload).pipe(
        switchMap(user => of(new LogInSuccess(user), new ResetPasswordSuccess(user))),
        catchError(error => of(new ResetPasswordFailure(error.error)))
      );
    })
  );

  @Effect()
  UpgradeAccount: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.UPGRADE_ACCOUNT),
    map((action: UpgradeAccount) => action.payload),
    switchMap(payload => {
      if (payload.plan_type === PlanType.FREE) {
        payload = { plan_type: PlanType.FREE };
      }
      return this.authService.upgradeAccount(payload).pipe(
        switchMap(res => {
          return of(new UpgradeAccountSuccess(res), new AccountDetailsGet(), new GetInvoices(), new GetMailboxes());
        }),
        catchError(error =>
          of(
            new UpgradeAccountFailure(error.error),
            new SnackErrorPush({ message: 'Failed to upgrade account, please try again.' })
          )
        )
      );
    })
  );

  @Effect()
  ChangePassword: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.CHANGE_PASSWORD),
    map((action: ChangePassword) => action.payload),
    switchMap(payload => {
      return this.authService.changePassword(payload).pipe(
        switchMap(user =>
          of(new ChangePasswordSuccess(payload), new SnackPush({ message: 'Password changed successfully.' }))
        ),
        catchError((response: any) =>
          of(
            new SnackErrorPush({ message: `Failed to change password, ${response.error}` }),
            new ChangePasswordFailed(response)
          )
        )
      );
    })
  );

  @Effect()
  DeleteAccount: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.DELETE_ACCOUNT),
    map((action: DeleteAccount) => action.payload),
    switchMap(payload => {
      return this.authService.deleteAccount(payload).pipe(
        switchMap(user =>
          of(new DeleteAccountSuccess(), new SnackPush({ message: 'Account deleted successfully.' }), new Logout())
        ),
        catchError(errorResponse =>
          of(
            new DeleteAccountFailure(errorResponse.error),
            new SnackErrorPush({
              message:
                errorResponse.error && errorResponse.error.detail
                  ? errorResponse.error.detail
                  : 'Failed to delete account, please try again.'
            })
          )
        )
      );
    })
  );

  @Effect()
  getCaptcha: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.GET_CAPTCHA),
    map((action: GetCaptcha) => action.payload),
    switchMap(payload => {
      return this.authService.getCaptcha().pipe(
        switchMap((response: any) => of(new GetCaptchaSuccess(response))),
        catchError(errorResponse =>
          of(
            new SnackErrorPush({
              message:
                errorResponse.error && errorResponse.error.detail
                  ? errorResponse.error.detail
                  : 'Failed to load Captcha.'
            })
          )
        )
      );
    })
  );

  @Effect()
  verifyCaptcha: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.VERIFY_CAPTCHA),
    map((action: VerifyCaptcha) => action.payload),
    switchMap(payload => {
      return this.authService.verifyCaptcha(payload).pipe(
        switchMap((response: any) => {
          const events: any[] = [new VerifyCaptchaSuccess(response)];
          if (response.status === false) {
            events.push(new GetCaptcha());
          }
          return of(...events);
        }),
        catchError(errorResponse =>
          of(
            new SnackErrorPush({
              message:
                errorResponse.error && errorResponse.error.detail
                  ? errorResponse.error.detail
                  : 'Failed to verify Captcha.'
            })
          )
        )
      );
    })
  );

  @Effect()
  get2FASecret: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.GET_2FA_SECRET),
    map((action: Get2FASecret) => action.payload),
    switchMap(payload => {
      return this.authService.get2FASecret().pipe(
        switchMap((response: any) => of(new Get2FASecretSuccess(response))),
        catchError(errorResponse =>
          of(
            new SnackErrorPush({
              message: `Failed to load secret, ${errorResponse.error}`
            })
          )
        )
      );
    })
  );

  @Effect()
  enable2FA: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.UPDATE_2FA),
    map((action: Update2FA) => action.payload),
    switchMap(payload => {
      return this.authService.update2FA(payload.data).pipe(
        switchMap((response: any) =>
          of(
            new Update2FASuccess(response),
            new SettingsUpdateSuccess(payload.settings),
            new SnackPush({
              message: `2 Factor authentication ${payload.data.enable_2fa ? 'enabled' : 'disabled'} successfully.`
            })
          )
        ),
        catchError(errorResponse =>
          of(
            new SnackErrorPush({
              message: `Failed to ${payload.data.enable_2fa ? 'enable' : 'disable'} 2FA, ${
                errorResponse.error
              } Please try again.`
            })
          )
        )
      );
    })
  );
}
