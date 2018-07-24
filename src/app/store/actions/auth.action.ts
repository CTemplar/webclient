// Ngrx
import { Action } from '@ngrx/store';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',
  SIGNUP = '[Auth] Signup',
  SIGNUP_SUCCESS = '[Auth] Signup Success',
  SIGNUP_FAILURE = '[Auth] Signup Failure',
  LOGOUT = '[Auth] Logout',
  GET_STATUS = '[Auth] GetStatus',
  UPDATE_SIGNUP_DATA = '[Auth] Update Signup Data',
  CHECK_USERNAME_AVAILABILITY = '[Auth] Check Username Availability',
  CHECK_USERNAME_AVAILABILITY_SUCCESS = '[Auth] Check Username Availability Success',
}

export class LogIn implements Action {
  readonly type = AuthActionTypes.LOGIN;

  constructor(public payload: any) {}
}

export class LogInSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;

  constructor(public payload: any) {}
}

export class LogInFailure implements Action {
  readonly type = AuthActionTypes.LOGIN_FAILURE;

  constructor(public payload: any) {}
}

export class SignUp implements Action {
  readonly type = AuthActionTypes.SIGNUP;

  constructor(public payload: any) {}
}

export class SignUpSuccess implements Action {
  readonly type = AuthActionTypes.SIGNUP_SUCCESS;

  constructor(public payload: any) {}
}

export class SignUpFailure implements Action {
  readonly type = AuthActionTypes.SIGNUP_FAILURE;

  constructor(public payload?: any) {}
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LOGOUT;
}

export class GetStatus implements Action {
  readonly type = AuthActionTypes.GET_STATUS;
}

export class UpdateSignupData implements Action {
  readonly type = AuthActionTypes.UPDATE_SIGNUP_DATA;

  constructor(public payload?: any) {}
}

export class CheckUsernameAvailability {
  readonly type = AuthActionTypes.CHECK_USERNAME_AVAILABILITY;

  constructor(public payload: any) {}
}

export class CheckUsernameAvailabilitySuccess {
  readonly type = AuthActionTypes.CHECK_USERNAME_AVAILABILITY_SUCCESS;

  constructor(public payload: any) {}
}

export type AuthActionAll =
  | LogIn
  | LogInSuccess
  | LogInFailure
  | SignUp
  | SignUpSuccess
  | SignUpFailure
  | Logout
  | GetStatus
  | UpdateSignupData
  | CheckUsernameAvailability
  | CheckUsernameAvailabilitySuccess;
