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
  EXPIRE_SESSION = '[Auth] EXPIRE SESSION',
  GET_STATUS = '[Auth] GetStatus',
  UPDATE_SIGNUP_DATA = '[Auth] Update Signup Data',
  CHECK_USERNAME_AVAILABILITY = '[Auth] Check Username Availability',
  CHECK_USERNAME_AVAILABILITY_SUCCESS = '[Auth] Check Username Availability Success',
  CHECK_USERNAME_AVAILABILITY_ERROR = '[Auth] Check Username Availability Error',
  RECOVER_PASSWORD = '[Auth] Recover Password',
  RECOVER_PASSWORD_SUCCESS = '[Auth] Recover Password Success',
  RECOVER_PASSWORD_FAILURE = '[Auth] Recover Password Failure',
  RESET_PASSWORD = '[Auth] Reset Password',
  RESET_PASSWORD_SUCCESS = '[Auth] Reset Password Success',
  RESET_PASSWORD_FAILURE = '[Auth] Reset Password Failure',
  UPGRADE_ACCOUNT = '[Auth] Upgrade Account',
  UPGRADE_ACCOUNT_SUCCESS = '[Auth] Upgrade Account Success',
  UPGRADE_ACCOUNT_FAILURE = '[Auth] Upgrade Account Failure',
  CHANGE_PASSWORD = '[Auth] Change Password',
  CHANGE_PASSWORD_SUCCESS = '[Auth] Change Password Success',
  CHANGE_PASSWORD_FAILED = '[Auth] Change Password Failed',
  CHANGE_PASSPHRASE_SUCCESS = '[Auth] Change Passphrase in keys Success',
  DELETE_ACCOUNT = '[Auth] Delete Account',
  DELETE_ACCOUNT_SUCCESS = '[Auth] Delete Account Success',
  DELETE_ACCOUNT_FAILURE = '[Auth] Delete Account Failure',
  CLEAR_SIGNUP_STATE = '[Auth] Clear Signup State',
  CLEAR_AUTH_ERROR_MESSAGE = '[Auth] Clear Auth Error',
  GET_CAPTCHA = '[Auth] Get Captcha',
  GET_CAPTCHA_SUCCESS = '[Auth] Get Captcha Success',
  VERIFY_CAPTCHA = '[Auth] Verify Captcha',
  VERIFY_CAPTCHA_SUCCESS = '[Auth] Verify Captcha Success',
  VERIFY_CAPTCHA_FAILURE = '[Auth] Verify Captcha Failure',
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

  constructor(public payload: any = {}) {}
}

export class GetStatus implements Action {
  readonly type = AuthActionTypes.GET_STATUS;
}

export class UpdateSignupData implements Action {
  readonly type = AuthActionTypes.UPDATE_SIGNUP_DATA;

  constructor(public payload?: any) {}
}

export class CheckUsernameAvailability implements Action {
  readonly type = AuthActionTypes.CHECK_USERNAME_AVAILABILITY;

  constructor(public payload: any) {}
}

export class CheckUsernameAvailabilitySuccess implements Action {
  readonly type = AuthActionTypes.CHECK_USERNAME_AVAILABILITY_SUCCESS;

  constructor(public payload: any) {}
}

export class CheckUsernameAvailabilityError implements Action {
  readonly type = AuthActionTypes.CHECK_USERNAME_AVAILABILITY_ERROR;

  constructor(public payload?: any) {}
}

export class RecoverPassword implements Action {
  readonly type = AuthActionTypes.RECOVER_PASSWORD;

  constructor(public payload: any) {
  }
}

export class RecoverPasswordSuccess implements Action {
  readonly type = AuthActionTypes.RECOVER_PASSWORD_SUCCESS;

  constructor(public payload: any) {
  }
}

export class RecoverPasswordFailure implements Action {
  readonly type = AuthActionTypes.RECOVER_PASSWORD_FAILURE;

  constructor(public payload: any) {
  }
}

export class ResetPassword implements Action {
  readonly type = AuthActionTypes.RESET_PASSWORD;

  constructor(public payload: any) {
  }
}

export class ResetPasswordSuccess implements Action {
  readonly type = AuthActionTypes.RESET_PASSWORD_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ResetPasswordFailure implements Action {
  readonly type = AuthActionTypes.RESET_PASSWORD_FAILURE;

  constructor(public payload: any) {
  }
}

export class UpgradeAccount implements Action {
  readonly type = AuthActionTypes.UPGRADE_ACCOUNT;

  constructor(public payload: any) {
  }
}

export class UpgradeAccountSuccess implements Action {
  readonly type = AuthActionTypes.UPGRADE_ACCOUNT_SUCCESS;

  constructor(public payload: any) {
  }
}

export class UpgradeAccountFailure implements Action {
  readonly type = AuthActionTypes.UPGRADE_ACCOUNT_FAILURE;

  constructor(public payload: any) {
  }
}

export class ChangePassword implements Action {
  readonly type = AuthActionTypes.CHANGE_PASSWORD;

  constructor(public payload: any) {
  }
}

export class ChangePasswordSuccess implements Action {
  readonly type = AuthActionTypes.CHANGE_PASSWORD_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ChangePasswordFailed implements Action {
  readonly type = AuthActionTypes.CHANGE_PASSWORD_FAILED;

  constructor(public payload?: any) {
  }
}

export class ChangePassphraseSuccess implements Action {
  readonly type = AuthActionTypes.CHANGE_PASSPHRASE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class DeleteAccount implements Action {
  readonly type = AuthActionTypes.DELETE_ACCOUNT;

  constructor(public payload: any) {
  }
}

export class DeleteAccountSuccess implements Action {
  readonly type = AuthActionTypes.DELETE_ACCOUNT_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class DeleteAccountFailure implements Action {
  readonly type = AuthActionTypes.DELETE_ACCOUNT_FAILURE;

  constructor(public payload: any) {
  }
}

export class ClearSignUpState implements Action {
  readonly type = AuthActionTypes.CLEAR_SIGNUP_STATE;

  constructor(public payload?: any) {
  }
}

export class ClearAuthErrorMessage implements Action {
  readonly type = AuthActionTypes.CLEAR_AUTH_ERROR_MESSAGE;

  constructor(public payload?: any) {
  }
}

export class GetCaptcha implements Action {
  readonly type = AuthActionTypes.GET_CAPTCHA;

  constructor(public payload?: any) {
  }
}

export class GetCaptchaSuccess implements Action {
  readonly type = AuthActionTypes.GET_CAPTCHA_SUCCESS;

  constructor(public payload: any) {
  }
}

export class VerifyCaptcha implements Action {
  readonly type = AuthActionTypes.VERIFY_CAPTCHA;

  constructor(public payload: any) {
  }
}

export class VerifyCaptchaSuccess implements Action {
  readonly type = AuthActionTypes.VERIFY_CAPTCHA_SUCCESS;

  constructor(public payload: any) {
  }
}

export class VerifyCaptchaFailure implements Action {
  readonly type = AuthActionTypes.VERIFY_CAPTCHA_FAILURE;

  constructor(public payload: any) {
  }
}

export class ExpireSession implements Action {
  readonly type = AuthActionTypes.EXPIRE_SESSION;

  constructor(public payload?: any) {
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
  | CheckUsernameAvailabilityError
  | RecoverPassword
  | RecoverPasswordSuccess
  | RecoverPasswordFailure
  | ResetPassword
  | ResetPasswordSuccess
  | ResetPasswordFailure
  | UpgradeAccount
  | UpgradeAccountSuccess
  | UpgradeAccountFailure
  | ChangePassword
  | ChangePasswordSuccess
  | ChangePasswordFailed
  | ChangePassphraseSuccess
  | DeleteAccount
  | DeleteAccountSuccess
  | DeleteAccountFailure
  | ClearSignUpState
  | ClearAuthErrorMessage
  | GetCaptcha
  | GetCaptchaSuccess
  | VerifyCaptcha
  | VerifyCaptchaSuccess
  | VerifyCaptchaFailure
  | ExpireSession;
