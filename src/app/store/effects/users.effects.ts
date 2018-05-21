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
import {
  Accounts,
  UsersActionTypes,
  AccountsReadSuccess,
  WhiteList,
  WhiteListsReadSuccess,
  WhiteListAdd,
  WhiteListAddSuccess,
  WhiteListDeleteSuccess,
  BlackList,
  BlackListAddSuccess,
  BlackListDeleteSuccess,
  BlackListsReadSuccess,
  ContactDelete,
  WhiteListDelete,
  BlackListAdd,
  BlackListDelete,
  Contact,
  ContactAdd,
  ContactAddSuccess,
  ContactDeleteSuccess,
  ContactReadSuccess
} from '../actions';


@Injectable()
export class UsersEffects {
  constructor(
    private actions: Actions,
    private userService: UsersService,
    private router: Router
  ) {}

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
      return this.userService.addWhiteList(payload.email, payload.name).map(whiteList => {
        return new WhiteListAddSuccess(whiteList);
      });
    });

  @Effect()
  WhiteListDelete: Observable<any> = this.actions
    .ofType(UsersActionTypes.WHITELIST_DELETE)
    .map((action: WhiteListDelete) => action.payload)
    .switchMap(payload => {
      return this.userService.deleteWhiteList(payload).map(whiteList => {
        return new WhiteListDeleteSuccess(whiteList);
      });
    });

    @Effect()
    BlackLists: Observable < any > = this.actions
      .ofType(UsersActionTypes.BLACKLIST)
      .map((action: BlackList) => action.payload)
      .switchMap(payload => {
        return this.userService.getBlackList().map(blackList => {
          return new BlackListsReadSuccess(blackList.results);
        });
      });

    @Effect()
    BlackListAdd: Observable < any > = this.actions
      .ofType(UsersActionTypes.BLACKLIST_ADD)
      .map((action: BlackListAdd) => action.payload)
      .switchMap(payload => {
        return this.userService.addBlackList(payload.email, payload.name).map(blackList => {
          return new BlackListAddSuccess(blackList);
        });
      });

    @Effect()
    BlackListDelete: Observable < any > = this.actions
      .ofType(UsersActionTypes.BLACKLIST_DELETE)
      .map((action: BlackListDelete) => action.payload)
      .switchMap(payload => {
        return this.userService.deleteBlackList(payload).map(blackList => {
          return new BlackListDeleteSuccess(blackList);
        });
      });
  @Effect()
  Contact: Observable<any> = this.actions
    .ofType(UsersActionTypes.CONTACT)
    .map((action: Contact) => action.payload)
    .switchMap(payload => {
      return this.userService.getContact().map(contact => {
        return new ContactReadSuccess(contact.results);
      });
    });

  @Effect()
  ContactAdd: Observable<any> = this.actions
    .ofType(UsersActionTypes.CONTACT_ADD)
    .map((action: ContactAdd) => action.payload)
    .switchMap(payload => {
      return this.userService.addContact(payload).map(contact => {
        return new ContactAddSuccess(contact);
      });
    });

  @Effect()
  ContactDelete: Observable<any> = this.actions
    .ofType(UsersActionTypes.CONTACT_DELETE)
    .map((action: Accounts) => action.payload)
    .switchMap(payload => {
      return this.userService.deleteContact(payload).map(contact => {
        return new ContactDeleteSuccess(contact);
      });
    });
  }
