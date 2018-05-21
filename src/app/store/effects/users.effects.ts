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
import { UsersService } from '../../store/services';

// Custom Actions
import { Accounts, UsersActionTypes, AccountsReadSuccess } from '../actions';


@Injectable()
export class UsersEffects {

  constructor(
    private actions: Actions,
    private userService: UsersService,
    private router: Router,
  ) {}

  @Effect()
  Accounts: Observable<any> = this.actions
      .ofType(UsersActionTypes.ACCOUNTS)
    .map((action: Accounts) => action.payload)
    .switchMap(payload => {
      return this.userService.accounts('34324')
        .map((user) => {
          return new AccountsReadSuccess(user);
        });
    });

}
