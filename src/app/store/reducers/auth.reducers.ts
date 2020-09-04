// Custom Action
import { AuthActionAll, AuthActionTypes } from '../actions';
// Model
import { Auth2FA, AuthState, PaymentMethod, PaymentType } from '../datatypes';
import { REFFERAL_CODE_KEY } from '../../shared/config';

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  errorMessage: null,
  inProgress: false,
  signupState: {
    username: null, password: null, recaptcha: null,
    currency: 'USD'
  },
  resetPasswordErrorMessage: null,
  isRecoveryCodeSent: false,
  captcha: {},
  auth2FA: {},
  saveDraftOnLogout: false,
};

export function logoutReducer(reducerAction: any) {
  return function (state, action) {
    return reducerAction(action.type === AuthActionTypes.LOGOUT ? undefined : state, action);
  };
}


export function reducer(state = initialState, action: AuthActionAll): AuthState {
  switch (action.type) {

    case AuthActionTypes.LOGIN: {
      return {
        ...state,
        errorMessage: null,
        inProgress: true,
      };
    }
    case AuthActionTypes.SAVE_DRAFT_ON_LOGOUT: {
      return {
        ...state,
        saveDraftOnLogout: true,
      };
    }
    case AuthActionTypes.LOGIN_SUCCESS: {
      if (action.payload.token) {
        localStorage.removeItem(REFFERAL_CODE_KEY);
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload,
          errorMessage: null,
          inProgress: false,
          auth2FA: { is_2fa_enabled: action.payload.is_2fa_enabled, show2FALogin: false },
          anti_phishing_phrase: action.payload.is_2fa_enabled ? '' : action.payload.anti_phishing_phrase
        };
      } else if (action.payload.is_2fa_enabled) {
        return {
          ...state,
          inProgress: false,
          errorMessage: null,
          auth2FA: { is_2fa_enabled: true, show2FALogin: true },
          anti_phishing_phrase: action.payload.anti_phishing_phrase
        };
      }
      return { ...state };
    }
    case AuthActionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        errorMessage: action.payload || 'Incorrect username or password.',
        inProgress: false
      };
    }
    case AuthActionTypes.SET_AUTHENTICATED: {
      if (state.isAuthenticated) {
        return { ...state };
      } else {
        return {
          ...state,
          isAuthenticated: action.payload.isAuthenticated
        }
      }
    }
    case AuthActionTypes.SIGNUP_SUCCESS: {
      return {
        ...state,
        user: action.payload,
        errorMessage: null,
        inProgress: false,
        signupState: { ...state.signupState, inProgress: false },
        recovery_key: action.payload.recovery_key
      };
    }
    case AuthActionTypes.SIGNUP_FAILURE: {

      const error = action.payload ? action.payload : 'Failed to signup, please try again.';

      return {
        ...state,
        errorMessage: error,
        inProgress: false,
        signupState: { ...state.signupState, inProgress: false }
      };
    }
    case AuthActionTypes.SIGNUP: {
      return {
        ...state, inProgress: true, signupState: { ...state.signupState, inProgress: true }
      };
    }
    case AuthActionTypes.UPDATE_SIGNUP_DATA: {
      return {
        ...state,
        signupState: { ...state.signupState, ...action.payload },
      };
    }
    case AuthActionTypes.CHECK_USERNAME_AVAILABILITY: {
      return {
        ...state,
        signupState: { ...state.signupState, inProgress: true },
      };
    }
    case AuthActionTypes.CHECK_USERNAME_AVAILABILITY_SUCCESS: {
      return {
        ...state,
        signupState: { ...state.signupState, usernameExists: action.payload.exists, inProgress: false },
      };
    }

    case AuthActionTypes.CHECK_USERNAME_AVAILABILITY_ERROR: {
      return {
        ...state,
        signupState: { ...state.signupState, usernameExists: null, inProgress: false },
      };
    }

    case AuthActionTypes.RECOVER_PASSWORD: {
      return {
        ...state,
        errorMessage: null,
        inProgress: true,
        resetPasswordErrorMessage: null,
        isRecoveryCodeSent: false
      };
    }

    case AuthActionTypes.RECOVER_PASSWORD_SUCCESS: {
      return {
        ...state,
        inProgress: false,
        resetPasswordErrorMessage: null,
        isRecoveryCodeSent: true
      };
    }

    case AuthActionTypes.RECOVER_PASSWORD_FAILURE: {
      return {
        ...state,
        inProgress: false,
        resetPasswordErrorMessage: action.payload || 'Failed to send recovery email, please try again.',
        isRecoveryCodeSent: false
      };
    }

    case AuthActionTypes.RESET_PASSWORD: {
      return {
        ...state,
        errorMessage: null,
        inProgress: true,
        isRecoveryCodeSent: true,
        resetPasswordErrorMessage: null
      };
    }

    case AuthActionTypes.RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        inProgress: false,
        resetPasswordErrorMessage: null
      };
    }

    case AuthActionTypes.RESET_PASSWORD_FAILURE: {
      return {
        ...state,
        inProgress: false,
        resetPasswordErrorMessage: 'Failed to reset password, please try again.'
      };
    }
    case AuthActionTypes.UPGRADE_ACCOUNT: {
      return {
        ...state,
        errorMessage: null,
        inProgress: true
      };
    }
    case AuthActionTypes.UPGRADE_ACCOUNT_SUCCESS: {
      return {
        ...state,
        errorMessage: null,
        inProgress: false
      };
    }
    case AuthActionTypes.UPGRADE_ACCOUNT_FAILURE: {
      return {
        ...state,
        errorMessage: 'Failed to upgrade account. Please try again.',
        inProgress: false
      };
    }
    case AuthActionTypes.DELETE_ACCOUNT: {
      return {
        ...state,
        inProgress: true
      };
    }
    case AuthActionTypes.DELETE_ACCOUNT_SUCCESS:
    case AuthActionTypes.DELETE_ACCOUNT_FAILURE: {
      return {
        ...state,
        inProgress: false
      };
    }
    case AuthActionTypes.CLEAR_SIGNUP_STATE: {
      return {
        ...state, signupState: initialState.signupState
      };
    }
    case AuthActionTypes.CLEAR_AUTH_ERROR_MESSAGE: {
      return {
        ...state, errorMessage: null
      };
    }
    case AuthActionTypes.CHANGE_PASSPHRASE_SUCCESS: {
      return {
        ...state,
        updatedPrivateKeys: action.payload,
      };
    }
    case AuthActionTypes.CHANGE_PASSWORD: {
      return {
        ...state,
        inProgress: true,
        isChangePasswordError: false,
      };

    }
    case AuthActionTypes.CHANGE_PASSWORD_SUCCESS: {
      if (localStorage.getItem('user_key')) {
        localStorage.setItem('user_key', btoa(action.payload.password));
      }
      return {
        ...state,
        inProgress: false,
        isChangePasswordError: false,
      };
    }
    case AuthActionTypes.CHANGE_PASSWORD_FAILED: {
      return {
        ...state,
        inProgress: false,
        isChangePasswordError: true,
      };
    }
    case AuthActionTypes.GET_CAPTCHA: {
      return {
        ...state,
        captcha: { ...state.captcha, inProgress: true },
      };
    }
    case AuthActionTypes.GET_CAPTCHA_SUCCESS: {
      return {
        ...state,
        captcha: { ...state.captcha, ...action.payload, inProgress: false },
      };
    }

    case AuthActionTypes.VERIFY_CAPTCHA: {
      return {
        ...state,
        captcha: { ...state.captcha, isInvalid: null, inProgress: true },
      };
    }
    case AuthActionTypes.VERIFY_CAPTCHA_SUCCESS: {
      return {
        ...state,
        captcha: {
          ...state.captcha, inProgress: false,
          isInvalid: !action.payload.status,
          verified: action.payload.status,
          value: action.payload.status ? state.captcha.value : '',
        },
      };
    }

    case AuthActionTypes.GET_2FA_SECRET: {
      return { ...state, auth2FA: { inProgress: true } };
    }


    case AuthActionTypes.GET_2FA_SECRET_SUCCESS: {
      return { ...state, auth2FA: new Auth2FA({ ...action.payload, inProgress: false }) };
    }

    case AuthActionTypes.LOGOUT: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
