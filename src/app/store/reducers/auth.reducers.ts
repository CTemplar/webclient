// Custom Action
import { AuthActionTypes, AuthActionAll } from '../actions';

// Model
import { AuthState } from '../datatypes';
import {ActionReducer} from '@ngrx/store';

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  errorMessage: null
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
        errorMessage: null
      };
    }
    case AuthActionTypes.SIGNUP_FAILURE: {
      return {
        ...state,
        errorMessage: 'That username is already in use.'
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
