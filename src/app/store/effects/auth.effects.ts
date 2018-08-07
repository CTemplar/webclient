// Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// Ngrx
import { Actions, Effect, ofType } from '@ngrx/effects';
// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
// Service
import { UsersService } from '../../store/services';
// Custom Actions
import {
  AccountDetailsGet,
  AuthActionTypes,
  CheckUsernameAvailability, CheckUsernameAvailabilitySuccess,
  LogIn,
  LogInFailure,
  LogInSuccess,
  RecoverPassword,
  RecoverPasswordSuccess,
  ResetPassword,
  ResetPasswordFailure,
  SignUp,
  SignUpFailure,
  SignUpSuccess,
  SnackErrorPush, UpgradeAccount, UpgradeAccountFailure, UpgradeAccountSuccess
} from '../actions';


@Injectable()
export class AuthEffects {

  constructor(
    private actions: Actions,
    private authService: UsersService,
    private router: Router,
  ) {}

  @Effect()
  LogIn: Observable<any> = this.actions
    .ofType(AuthActionTypes.LOGIN)
    .map((action: LogIn) => action.payload)
    .switchMap(payload => {
      return this.authService.signIn(payload)
        .pipe(
          map((user) => new LogInSuccess(user)),
          catchError((error) => [new LogInFailure({ error })])
        );
    });


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
    .ofType(AuthActionTypes.SIGNUP)
    .map((action: SignUp) => action.payload)
    .switchMap(payload => {
      return this.authService.signUp(payload)
        .pipe(
          map((user) => new LogInSuccess(user)),
          catchError((error) => [new SignUpFailure(error),
            new SnackErrorPush({ message: 'Failed to signup, please try again.' })])
        );
    });

  @Effect({ dispatch: false })
  SignUpSuccess: Observable<any> = this.actions
    .ofType(AuthActionTypes.SIGNUP_SUCCESS)
    .map((action: SignUpSuccess) => action.payload)
    .map(payload => {
      this.router.navigateByUrl('/mail');
    });

  @Effect({ dispatch: false })
  public LogOut: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGOUT),
    tap((user) => {
      this.authService.signOut();
    })
  );


  @Effect()
  checkUsernameAvailability: Observable<any> = this.actions
    .ofType(AuthActionTypes.CHECK_USERNAME_AVAILABILITY)
    .map((action: CheckUsernameAvailability) => action.payload)
    .switchMap(payload => {
      if (!payload) {
        return Observable.of(new CheckUsernameAvailabilitySuccess({ exists: true }));
      }
      return this.authService.checkUsernameAvailability(payload)
        .pipe(
          map((response) => new CheckUsernameAvailabilitySuccess(response)),
          catchError((error) => [new SnackErrorPush({ message: 'Failed to check username availability.' })])
        );
    });

  @Effect()
  RecoverPassword: Observable<any> = this.actions
    .ofType(AuthActionTypes.RECOVER_PASSWORD)
    .map((action: RecoverPassword) => action.payload)
    .switchMap(payload => {
      return this.authService.recoverPassword(payload)
        .pipe(
          map((res) => new RecoverPasswordSuccess(res)),
          catchError((error) => [
            new SnackErrorPush({ message: 'Failed to send recovery email, please try again.' })
          ])
        );
    });

  @Effect()
  ResetPassword: Observable<any> = this.actions
    .ofType(AuthActionTypes.RESET_PASSWORD)
    .map((action: ResetPassword) => action.payload)
    .switchMap(payload => {
      return this.authService.resetPassword(payload)
        .pipe(
          map((user) => new LogInSuccess(user)),
          catchError((error) => [new ResetPasswordFailure(error),
            new SnackErrorPush({ message: 'Failed to reset password, please try again.' })])
        );
    });

  @Effect()
  UpgradeAccount: Observable<any> = this.actions
    .ofType(AuthActionTypes.UPGRADE_ACCOUNT)
    .map((action: UpgradeAccount) => action.payload)
    .switchMap(payload => {
      return this.authService.upgradeAccount(payload)
        .pipe(
          switchMap((res) => {
            return [new UpgradeAccountSuccess(res), new AccountDetailsGet()];
          }),
          catchError((error) => [new UpgradeAccountFailure(error),
            new SnackErrorPush({ message: 'Failed to upgrade account, please try again.' })])
        );
    });
}
