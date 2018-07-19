// Custom Action
import { AuthActionTypes, AuthActionAll, LogInSuccess } from '../actions';

// Model
import { AuthState } from '../datatypes';
import { ActionReducer } from '@ngrx/store';

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  errorMessage: null,
  inProgress: false
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
    case AuthActionTypes.LOGOUT: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
