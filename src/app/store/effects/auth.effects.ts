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
import { catchError, map, tap } from 'rxjs/operators';

// Service
import { UsersService } from '../../store/services';

// Custom Actions
import {
  AuthActionTypes,
  LogIn, LogInSuccess, LogInFailure,
  SignUp, SignUpSuccess, SignUpFailure,
} from '../actions';
import { of } from 'rxjs/observable/of';


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
          catchError((error) => of(new LogInFailure({ error })))
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
          catchError((error) => [new SignUpFailure(error)])
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

}
