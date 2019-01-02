// Custom Action
import { AuthActionAll, AuthActionTypes } from '../actions';
// Model
import { AuthState, PaymentMethod, PaymentType } from '../datatypes';
import { REFFERAL_CODE_KEY } from '../../shared/config';

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  errorMessage: null,
  inProgress: false,
  signupState: {
    username: null, password: null, recaptcha: null,
    payment_type: PaymentType.MONTHLY,
    payment_method: PaymentMethod.STRIPE,
    currency: 'USD'
  },
  resetPasswordErrorMessage: null,
  isRecoveryCodeSent: false
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
    case AuthActionTypes.LOGIN_SUCCESS: {
      localStorage.setItem('token', action.payload.token);
      localStorage.removeItem(REFFERAL_CODE_KEY);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        errorMessage: null,
        inProgress: false
      };
    }
    case AuthActionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        errorMessage: action.payload || 'Incorrect username or password.',
        inProgress: false
      };
    }
    case AuthActionTypes.SIGNUP_SUCCESS: {
      return {
        ...state,
        user: action.payload,
        errorMessage: null,
        inProgress: false,
        signupState: { ...state.signupState, inProgress: false }
      };
    }
    case AuthActionTypes.SIGNUP_FAILURE: {

      let error = 'Failed to signup, please try again.';
      if (action.payload.length > 0) {
        error = action.payload[0];
      }

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
        resetPasswordErrorMessage: 'Failed to send recovery email, please try again.',
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
    case AuthActionTypes.LOGOUT: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
