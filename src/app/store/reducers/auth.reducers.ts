// Custom Action
import { AuthActionTypes, AuthActionAll, LogInSuccess } from '../actions';

// Model
import { AuthState } from '../datatypes';
import {ActionReducer} from '@ngrx/store';

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
    case AuthActionTypes.LOGIN_SUCCESS: {
      sessionStorage.setItem('token', action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        errorMessage: null
      };
    }
    case AuthActionTypes.LOGIN_FAILURE: {
      return {
        ...state,
        errorMessage: 'Incorrect username and/or password.'
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
        errorMessage: 'That username is already in use.',
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
