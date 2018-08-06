// Custom Action
import { AuthActionAll, AuthActionTypes } from '../actions';
// Model
import { AuthState } from '../datatypes';

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  errorMessage: null,
  inProgress: false,
  signupState: { username: null, password: null, recaptcha: null }
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
      sessionStorage.setItem('token', action.payload.token);
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
        errorMessage: 'Incorrect username or password.',
        inProgress: false
      };
    }
    case AuthActionTypes.SIGNUP_SUCCESS: {
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        errorMessage: null,
        inProgress: false,
      };
    }
    case AuthActionTypes.SIGNUP_FAILURE: {
      return {
        ...state,
        errorMessage: 'Username already exist',
        inProgress: false
      };
    }
    case AuthActionTypes.SIGNUP: {
      return {
        ...state, inProgress: true
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
    case AuthActionTypes.RESET_PASSWORD: {
      return {
        ...state,
        errorMessage: null,
        inProgress: true,
      };
    }
    case AuthActionTypes.RESET_PASSWORD_FAILURE: {
      return {
        ...state,
        errorMessage: 'Incorrect reset code or username.',
        inProgress: false
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
    case AuthActionTypes.LOGOUT: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
