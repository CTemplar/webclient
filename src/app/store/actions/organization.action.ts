import { Action } from '@ngrx/store';

import { Organization } from '../datatypes';

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
  UPDATE_ORGANIZATION_USER = '[ORGANIZATION] UPDATE USER',
  UPDATE_ORGANIZATION_USER_SUCCESS = '[ORGANIZATION] UPDATE USER SUCCESS',
  UPDATE_ORGANIZATION_USER_FAILURE = '[ORGANIZATION] UPDATE USER FAILURE',

  GET_ORGANIZATIONS = '[ORGANIZATION] GET ORGANIZATIONS',
  GET_ORGANIZATIONS_SUCCESS = '[ORGANIZATION] GET ORGANIZATIONS SUCCESS',
  GET_ORGANIZATIONS_FAILURE = '[ORGANIZATION] GET ORGANIZATIONS FAILURE',

  ADD_ORGANIZATION = '[ORGANIZATION] ADD ORGANIZATION',
  ADD_ORGANIZATION_SUCCESS = '[ORGANIZATION] ADD ORGANIZATION SUCCESS',
  ADD_ORGANIZATION_FAILURE = '[ORGANIZATION] ADD ORGANIZATION FAILURE',

  UPDATE_ORGANIZATION = '[ORGANIZATION] UPDATE ORGANIZATION',
  UPDATE_ORGANIZATION_SUCCESS = '[ORGANIZATION] UPDATE ORGANIZATION SUCCESS',
  UPDATE_ORGANIZATION_FAILURE = '[ORGANIZATION] UPDATE ORGANIZATION FAILURE',

  DELETE_ORGANIZATION = '[ORGANIZATION] DELETE ORGANIZATION',
  DELETE_ORGANIZATION_SUCCESS = '[ORGANIZATION] DELETE ORGANIZATION SUCCESS',
  DELETE_ORGANIZATION_FAILURE = '[ORGANIZATION] DELETE ORGANIZATION FAILURE',
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

export class UpdateOrganizationUser implements Action {
  readonly type = OrganizationActionTypes.UPDATE_ORGANIZATION_USER;

  constructor(public payload: any) {}
}

export class UpdateOrganizationUserSuccess implements Action {
  readonly type = OrganizationActionTypes.UPDATE_ORGANIZATION_USER_SUCCESS;

  constructor(public payload: any) {}
}

export class UpdateOrganizationUserFailure implements Action {
  readonly type = OrganizationActionTypes.UPDATE_ORGANIZATION_USER_FAILURE;

  constructor(public payload: any) {}
}

export class AddOrganization implements Action {
  readonly type = OrganizationActionTypes.ADD_ORGANIZATION;

  constructor(public payload: Organization) {}
}

export class AddOrganizationSuccess implements Action {
  readonly type = OrganizationActionTypes.ADD_ORGANIZATION_SUCCESS;

  constructor(public payload: any) {}
}

export class AddOrganizationFailure implements Action {
  readonly type = OrganizationActionTypes.ADD_ORGANIZATION_FAILURE;

  constructor(public payload: any) {}
}

export class UpdateOrganization implements Action {
  readonly type = OrganizationActionTypes.UPDATE_ORGANIZATION;

  constructor(public id: number, public payload: Organization) {}
}

export class UpdateOrganizationSuccess implements Action {
  readonly type = OrganizationActionTypes.UPDATE_ORGANIZATION_SUCCESS;

  constructor(public payload: any) {}
}

export class UpdateOrganizationFailure implements Action {
  readonly type = OrganizationActionTypes.UPDATE_ORGANIZATION_FAILURE;

  constructor(public payload: any) {}
}

export class GetOrganizations implements Action {
  readonly type = OrganizationActionTypes.GET_ORGANIZATIONS;
}

export class GetOrganizationsSuccess implements Action {
  readonly type = OrganizationActionTypes.GET_ORGANIZATIONS_SUCCESS;

  constructor(public payload: Organization[]) {}
}

export class GetOrganizationsFailure implements Action {
  readonly type = OrganizationActionTypes.GET_ORGANIZATIONS_FAILURE;

  constructor(public payload: any) {}
}

export class DeleteOrganization implements Action {
  readonly type = OrganizationActionTypes.DELETE_ORGANIZATION;

  constructor(public payload: number) {}
}

export class DeleteOrganizationSuccess implements Action {
  readonly type = OrganizationActionTypes.DELETE_ORGANIZATION_SUCCESS;

  constructor(public payload: any) {}
}

export class DeleteOrganizationFailure implements Action {
  readonly type = OrganizationActionTypes.DELETE_ORGANIZATION_FAILURE;

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
  | DeleteOrganizationUserFailure
  | UpdateOrganizationUser
  | UpdateOrganizationUserSuccess
  | UpdateOrganizationUserFailure
  | AddOrganization
  | AddOrganizationSuccess
  | AddOrganizationFailure
  | UpdateOrganization
  | UpdateOrganizationSuccess
  | UpdateOrganizationFailure
  | DeleteOrganization
  | DeleteOrganizationSuccess
  | DeleteOrganizationFailure
  | GetOrganizations
  | GetOrganizationsSuccess
  | GetOrganizationsFailure;
