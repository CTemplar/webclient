// Ngrx
import { Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { OrganizationUser } from './models';
import { UsersService } from './services';
import { SnackErrorPush } from './actions';

export enum OrganizationActionTypes {
  GET_ORGANIZATION_USERS = '[ORGANIZATION] GET USERS',
  GET_ORGANIZATION_USERS_SUCCESS = '[ORGANIZATION] GET USERS SUCCESS',
  GET_ORGANIZATION_USERS_FAILURE = '[ORGANIZATION] GET USERS FAILURE',
  ADD_ORGANIZATION_USER = '[ORGANIZATION] ADD USER',
  ADD_ORGANIZATION_USER_SUCCESS = '[ORGANIZATION] ADD USER SUCCESS',
  ADD_ORGANIZATION_USER_FAILURE = '[ORGANIZATION] ADD USER FAILURE',
  DELETE_ORGANIZATION_USER = '[ORGANIZATION] DELETE USER',
  DELETE_ORGANIZATION_USER_SUCCESS = '[ORGANIZATION] DELETE USER SUCCESS',
  DELETE_ORGANIZATION_USER_FAILURE = '[ORGANIZATION] DELETE USER FAILURE',
}

export class GetOrganizationUsers implements Action {
  readonly type = OrganizationActionTypes.GET_ORGANIZATION_USERS;

  constructor(public payload: any = {}) {}
}

export class GetOrganizationUsersSuccess implements Action {
  readonly type = OrganizationActionTypes.GET_ORGANIZATION_USERS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetOrganizationUsersFailure implements Action {
  readonly type = OrganizationActionTypes.GET_ORGANIZATION_USERS_FAILURE;

  constructor(public payload: any) {}
}

export class AddOrganizationUser implements Action {
  readonly type = OrganizationActionTypes.ADD_ORGANIZATION_USER;

  constructor(public payload: any) {}
}

export class AddOrganizationUserSuccess implements Action {
  readonly type = OrganizationActionTypes.ADD_ORGANIZATION_USER_SUCCESS;

  constructor(public payload: any) {}
}

export class AddOrganizationUserFailure implements Action {
  readonly type = OrganizationActionTypes.ADD_ORGANIZATION_USER_FAILURE;

  constructor(public payload: any) {}
}


export class DeleteOrganizationUser implements Action {
  readonly type = OrganizationActionTypes.DELETE_ORGANIZATION_USER;

  constructor(public payload: any) {}
}

export class DeleteOrganizationUserSuccess implements Action {
  readonly type = OrganizationActionTypes.DELETE_ORGANIZATION_USER_SUCCESS;

  constructor(public payload: any) {}
}

export class DeleteOrganizationUserFailure implements Action {
  readonly type = OrganizationActionTypes.DELETE_ORGANIZATION_USER_FAILURE;

  constructor(public payload: any) {}
}

export type OrganizationActionAll =
  | GetOrganizationUsers
  | GetOrganizationUsersSuccess
  | GetOrganizationUsersFailure
  | AddOrganizationUser
  | AddOrganizationUserSuccess
  | AddOrganizationUserFailure
  | DeleteOrganizationUser
  | DeleteOrganizationUserSuccess
  | DeleteOrganizationUserFailure;


@Injectable()
export class OrganizationEffects {

  constructor(private actions: Actions,
              private userService: UsersService) {
  }

  @Effect()
  getOrganizationUsers: Observable<any> = this.actions
    .pipe(
      ofType(OrganizationActionTypes.GET_ORGANIZATION_USERS),
      map((action: GetOrganizationUsers) => action.payload),
      switchMap(payload => {
        return this.userService.getOrganizationUsers(payload.limit, payload.offset)
          .pipe(
            switchMap((response: any) => {
              return of(new GetOrganizationUsersSuccess(response.results));
            }),
            catchError((response) => of(
              new GetOrganizationUsersFailure(response.error),
              new SnackErrorPush({ message: 'Failed to load organization users.' }),
            ))
          );
      })
    );

  @Effect()
  addOrganizationUser: Observable<any> = this.actions
    .pipe(
      ofType(OrganizationActionTypes.ADD_ORGANIZATION_USER),
      map((action: AddOrganizationUser) => action.payload),
      switchMap(payload => {
        return this.userService.addOrganizationUser(payload)
          .pipe(
            switchMap((response: any) => {
              return of(
                new AddOrganizationUserSuccess({ ...payload, ...response }),
                new SnackErrorPush({ message: `User '${payload.username}' added successfully.` }),
              );
            }),
            catchError((response) => of(new AddOrganizationUserFailure(response.error)))
          );
      })
    );


  @Effect()
  deleteOrganizationUser: Observable<any> = this.actions
    .pipe(
      ofType(OrganizationActionTypes.DELETE_ORGANIZATION_USER),
      map((action: DeleteOrganizationUser) => action.payload),
      switchMap(payload => {
        return this.userService.deleteOrganizationUser(payload)
          .pipe(
            switchMap((response: any) => {
              return of(
                new DeleteOrganizationUserSuccess(payload),
                new SnackErrorPush({ message: `User '${payload.username}' deleted successfully.` }),
              );
            }),
            catchError((response) => of(new DeleteOrganizationUserFailure(response.error)))
          );
      })
    );
}

export interface OrganizationState {
  users: OrganizationUser[];
  inProgress?: boolean;
  isAddingUserInProgress?: boolean;
  isDeleteInProgress?: boolean;
  isError?: boolean;
  error?: string;
}

export function reducer(state: OrganizationState = { users: [] }, action: OrganizationActionAll) {
  switch (action.type) {
    case OrganizationActionTypes.GET_ORGANIZATION_USERS: {
      return { ...state, inProgress: true };
    }

    case OrganizationActionTypes.GET_ORGANIZATION_USERS_SUCCESS: {
      return { ...state, inProgress: false, users: action.payload };
    }

    case OrganizationActionTypes.GET_ORGANIZATION_USERS_FAILURE: {
      return { ...state, inProgress: false };
    }

    case OrganizationActionTypes.ADD_ORGANIZATION_USER: {
      return { ...state, isAddingUserInProgress: true, isError: false };
    }

    case OrganizationActionTypes.ADD_ORGANIZATION_USER_SUCCESS: {
      return { ...state, isAddingUserInProgress: false, users: [...state.users, action.payload], isError: false };
    }

    case OrganizationActionTypes.ADD_ORGANIZATION_USER_FAILURE: {
      return { ...state, isAddingUserInProgress: false, error: action.payload, isError: true };
    }

    case OrganizationActionTypes.DELETE_ORGANIZATION_USER: {
      return { ...state, isDeleteInProgress: true };
    }

    case OrganizationActionTypes.DELETE_ORGANIZATION_USER_SUCCESS: {
      return { ...state, isDeleteInProgress: false, users: state.users.filter(user => user.username !== action.payload.username) };
    }

    case OrganizationActionTypes.DELETE_ORGANIZATION_USER: {
      return { ...state, isDeleteInProgress: false };
    }

    default: {
      return state;
    }
  }
}

