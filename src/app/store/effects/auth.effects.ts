// Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Ngrx
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { tap } from 'rxjs/operators';

// Service
import { UsersService } from '../../providers/users.service';

// Custom Actions
import {
  AuthActionTypes,
  LogIn, LogInSuccess, LogInFailure,
  SignUp, SignUpSuccess, SignUpFailure,
  LogOut,
} from '../actions/auth.action';


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
        .map((user) => {
          return new LogInSuccess(user);
        })
        .catch((error) => {
          return Observable.of(new LogInFailure({ error: error }));
        });
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
        .map((user) => {
          return new SignUpSuccess(user);
        })
        .catch((error) => {
          return Observable.of(new SignUpFailure({ error: error }));
        });
    });

  @Effect({ dispatch: false })
  SignUpSuccess: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.SIGNUP_SUCCESS),
    tap((user) => {
      sessionStorage.setItem('token', user.payload.token);
      this.authService.setTokenExpiration();
      // this.router.navigateByUrl('/');
    })
  );

  @Effect({ dispatch: false })
  SignUpFailure: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.SIGNUP_FAILURE)
  );

  @Effect({ dispatch: false })
  public LogOut: Observable<any> = this.actions.pipe(
    ofType(AuthActionTypes.LOGOUT),
    tap((user) => {
      this.authService.signOut();
    })
  );

  // @Effect({ dispatch: false })
  // GetStatus: Observable<any> = this.actions
  //   .ofType(AuthActionTypes.GET_STATUS)
  //   .switchMap(payload => {
  //     return this.authService.getStatus();
  //   });

}
