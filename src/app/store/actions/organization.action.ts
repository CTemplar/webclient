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

  // Using ORG to differentiate the actions from those of custom domain
  // TODO Refactor and rename to Organization after current actions are removed
  GET_ORG_USERS = '[ORG] GET USERS',
  GET_ORG_USERS_SUCCESS = '[ORG] GET USERS SUCCESS',
  GET_ORG_USERS_FAILURE = '[ORG] GET USERS FAILURE',

  ADD_ORG_USER = '[ORG] ADD USER',
  ADD_ORG_USER_SUCCESS = '[ORG] ADD USER SUCCESS',
  ADD_ORG_USER_FAILURE = '[ORG] ADD USER FAILURE',

  DELETE_ORG_USER = '[ORG] DELETE USER',
  DELETE_ORG_USER_SUCCESS = '[ORG] DELETE USER SUCCESS',
  DELETE_ORG_USER_FAILURE = '[ORG] DELETE USER FAILURE',

  UPDATE_ORG_USER = '[ORG] UPDATE USER',
  UPDATE_ORG_USER_SUCCESS = '[ORG] UPDATE USER SUCCESS',
  UPDATE_ORG_USER_FAILURE = '[ORG] UPDATE USER FAILURE',
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

export class GetOrgUsers implements Action {
  readonly type = OrganizationActionTypes.GET_ORG_USERS;

  constructor(public payload: number) {}
}

export class GetOrgUsersSuccess implements Action {
  readonly type = OrganizationActionTypes.GET_ORG_USERS_SUCCESS;

  constructor(public payload: any) {}
}

export class GetOrgUsersFailure implements Action {
  readonly type = OrganizationActionTypes.GET_ORG_USERS_FAILURE;

  constructor(public payload: any) {}
}

export class AddOrgUser implements Action {
  readonly type = OrganizationActionTypes.ADD_ORG_USER;

  constructor(public payload: any) {}
}

export class AddOrgUserSuccess implements Action {
  readonly type = OrganizationActionTypes.ADD_ORG_USER_SUCCESS;

  constructor(public payload: any) {}
}

export class AddOrgUserFailure implements Action {
  readonly type = OrganizationActionTypes.ADD_ORG_USER_FAILURE;

  constructor(public payload: any) {}
}

export class DeleteOrgUser implements Action {
  readonly type = OrganizationActionTypes.DELETE_ORG_USER;

  constructor(public payload: any) {}
}

export class DeleteOrgUserSuccess implements Action {
  readonly type = OrganizationActionTypes.DELETE_ORG_USER_SUCCESS;

  constructor(public payload: any) {}
}

export class DeleteOrgUserFailure implements Action {
  readonly type = OrganizationActionTypes.DELETE_ORG_USER_FAILURE;

  constructor(public payload: any) {}
}

export class UpdateOrgUser implements Action {
  readonly type = OrganizationActionTypes.UPDATE_ORG_USER;

  constructor(public id: number, public payload: any, public unmodifiedUser: any) {}
}

export class UpdateOrgUserSuccess implements Action {
  readonly type = OrganizationActionTypes.UPDATE_ORG_USER_SUCCESS;

  constructor(public payload: any) {}
}

export class UpdateOrgUserFailure implements Action {
  readonly type = OrganizationActionTypes.UPDATE_ORG_USER_FAILURE;

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
  | GetOrganizationsFailure
  | GetOrgUsers
  | GetOrgUsersSuccess
  | GetOrgUsersFailure
  | AddOrgUser
  | AddOrgUserSuccess
  | AddOrgUserFailure
  | DeleteOrgUser
  | DeleteOrgUserSuccess
  | DeleteOrgUserFailure
  | UpdateOrgUser
  | UpdateOrgUserSuccess
  | UpdateOrgUserFailure;
