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
  RECOVER_PASSWORD = '[Auth] Recover Password',
  RECOVER_PASSWORD_SUCCESS = '[Auth] Recover Password Success',
  RESET_PASSWORD = '[Auth] Reset Password',
  RESET_PASSWORD_SUCCESS = '[Auth] Reset Password Success',
  RESET_PASSWORD_FAILURE = '[Auth] Reset Password Failure',
  UPGRADE_ACCOUNT = '[Auth] Upgrade Account',
  UPGRADE_ACCOUNT_SUCCESS = '[Auth] Upgrade Account Success',
  UPGRADE_ACCOUNT_FAILURE = '[Auth] Upgrade Account Failure'
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

export class RecoverPassword {
  readonly type = AuthActionTypes.RECOVER_PASSWORD;

  constructor(public payload: any) {
  }
}

export class RecoverPasswordSuccess {
  readonly type = AuthActionTypes.RECOVER_PASSWORD_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ResetPassword {
  readonly type = AuthActionTypes.RESET_PASSWORD;

  constructor(public payload: any) {
  }
}

export class ResetPasswordSuccess {
  readonly type = AuthActionTypes.RESET_PASSWORD_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ResetPasswordFailure {
  readonly type = AuthActionTypes.RESET_PASSWORD_FAILURE;

  constructor(public payload: any) {
  }
}

export class UpgradeAccount {
  readonly type = AuthActionTypes.UPGRADE_ACCOUNT;

  constructor(public payload: any) {
  }
}

export class UpgradeAccountSuccess {
  readonly type = AuthActionTypes.UPGRADE_ACCOUNT_SUCCESS;

  constructor(public payload: any) {
  }
}

export class UpgradeAccountFailure {
  readonly type = AuthActionTypes.UPGRADE_ACCOUNT_FAILURE;

  constructor(public payload: any) {
  }
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
  | CheckUsernameAvailabilitySuccess
  | RecoverPassword
  | RecoverPasswordSuccess
  | ResetPassword
  | ResetPasswordSuccess
  | ResetPasswordFailure
  | UpgradeAccount
  | UpgradeAccountSuccess
  | UpgradeAccountFailure;
