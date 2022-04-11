import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { SnackErrorPush, GetDomains } from '../actions';
import {
  AddOrganization,
  AddOrganizationFailure,
  AddOrganizationSuccess,
  AddOrganizationUser,
  AddOrganizationUserFailure,
  AddOrganizationUserSuccess,
  DeleteOrganizationFailure,
  DeleteOrganizationSuccess,
  DeleteOrganizationUser,
  DeleteOrganizationUserFailure,
  DeleteOrganizationUserSuccess,
  GetOrganizations,
  GetOrganizationsFailure,
  GetOrganizationsSuccess,
  GetOrganizationUsers,
  GetOrganizationUsersFailure,
  GetOrganizationUsersSuccess,
  OrganizationActionTypes,
  UpdateOrganizationFailure,
  UpdateOrganizationSuccess,
  UpdateOrganizationUser,
  UpdateOrganizationUserFailure,
  UpdateOrganizationUserSuccess,
} from '../actions/organization.action';
import { UsersService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class OrganizationEffects {
  constructor(private actions: Actions, private userService: UsersService) {}

  @Effect()
  getOrganizations: Observable<any> = this.actions.pipe(
    ofType(OrganizationActionTypes.GET_ORGANIZATIONS),
    map((action: GetOrganizations) => action),
    switchMap(() => {
      return this.userService.getOrganizations().pipe(
        switchMap((response: any) => {
          return of(new GetOrganizationsSuccess(response.results));
        }),
        catchError(response =>
          of(
            new GetOrganizationsFailure(response.error),
            new SnackErrorPush({ message: 'Failed to load organizations.' }),
          ),
        ),
      );
    }),
  );

  @Effect()
  addOrganization: Observable<any> = this.actions.pipe(
    ofType(OrganizationActionTypes.ADD_ORGANIZATION),
    map((action: AddOrganization) => action.payload),
    switchMap(payload => {
      return this.userService.addOrganization(payload).pipe(
        switchMap((response: any) => {
          return of(new AddOrganizationSuccess(response));
        }),
        catchError(response =>
          of(
            new AddOrganizationFailure(response.error),
            new SnackErrorPush({ message: 'Failed to add organization.' }),
          ),
        ),
      );
    }),
  );

  @Effect()
  updateOrganization: Observable<any> = this.actions.pipe(
    ofType(OrganizationActionTypes.UPDATE_ORGANIZATION),
    switchMap(({ id, payload }) => {
      return this.userService.updateOrganization(id, payload).pipe(
        switchMap((response: any) => {
          return of(new UpdateOrganizationSuccess(response));
        }),
        catchError(response =>
          of(
            new UpdateOrganizationFailure(response.error),
            new SnackErrorPush({ message: 'Failed to update organization.' }),
          ),
        ),
      );
    }),
  );

  @Effect()
  deleteOrganization: Observable<any> = this.actions.pipe(
    ofType(OrganizationActionTypes.DELETE_ORGANIZATION),
    switchMap(({ payload }) => {
      return this.userService.deleteOrganization(payload).pipe(
        switchMap((response: any) => {
          return of(
            new SnackErrorPush({ message: 'Organization deleted successfully.' }),
            new DeleteOrganizationSuccess(response),
          );
        }),
        catchError(response =>
          of(
            new DeleteOrganizationFailure(response.error),
            new SnackErrorPush({ message: 'Failed to delete organization.' }),
          ),
        ),
      );
    }),
  );

  @Effect()
  getOrganizationUsers: Observable<any> = this.actions.pipe(
    ofType(OrganizationActionTypes.GET_ORGANIZATION_USERS),
    map((action: GetOrganizationUsers) => action.payload),
    switchMap(payload => {
      return this.userService.getOrganizationUsers(payload.limit, payload.offset).pipe(
        switchMap((response: any) => {
          return of(new GetOrganizationUsersSuccess(response.results));
        }),
        catchError(response =>
          of(
            new GetOrganizationUsersFailure(response.error),
            new SnackErrorPush({ message: 'Failed to load organization users.' }),
          ),
        ),
      );
    }),
  );

  @Effect()
  addOrganizationUser: Observable<any> = this.actions.pipe(
    ofType(OrganizationActionTypes.ADD_ORGANIZATION_USER),
    map((action: AddOrganizationUser) => action.payload),
    switchMap(payload => {
      return this.userService.addOrganizationUser(payload).pipe(
        switchMap((response: any) => {
          return of(
            new AddOrganizationUserSuccess({ ...payload, ...response }),
            new SnackErrorPush({ message: `User '${payload.username}' added successfully.` }),
            new GetDomains(),
          );
        }),
        catchError(response => of(new AddOrganizationUserFailure(response.error))),
      );
    }),
  );

  @Effect()
  deleteOrganizationUser: Observable<any> = this.actions.pipe(
    ofType(OrganizationActionTypes.DELETE_ORGANIZATION_USER),
    map((action: DeleteOrganizationUser) => action.payload),
    switchMap(payload => {
      return this.userService.deleteOrganizationUser(payload).pipe(
        switchMap(() => {
          return of(
            new DeleteOrganizationUserSuccess(payload),
            new SnackErrorPush({ message: `User '${payload.username}' deleted successfully.` }),
            new GetDomains(),
          );
        }),
        catchError(response => of(new DeleteOrganizationUserFailure(response.error))),
      );
    }),
  );

  @Effect()
  updateOrganizationUser: Observable<any> = this.actions.pipe(
    ofType(OrganizationActionTypes.UPDATE_ORGANIZATION_USER),
    map((action: UpdateOrganizationUser) => action.payload),
    switchMap(payload => {
      return this.userService.updateOrganizationUser(payload).pipe(
        switchMap(() => {
          return of(
            new UpdateOrganizationUserSuccess(payload),
            new SnackErrorPush({ message: `Recovery email for user: '${payload.username}', updated successfully.` }),
          );
        }),
        catchError(response =>
          of(
            new UpdateOrganizationUserFailure({ user: payload, error: response.error }),
            new SnackErrorPush({ message: `Failed to update recovery email. ${response.error}` }),
          ),
        ),
      );
    }),
  );
}
