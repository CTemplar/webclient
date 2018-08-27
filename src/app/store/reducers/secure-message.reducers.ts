import { SecureMessageActions, SecureMessageActionTypes } from '../actions';
import { SecureMessageState } from '../datatypes';

export function reducer(state: SecureMessageState = {
  message: null,
  inProgress: false
}, action: SecureMessageActions): SecureMessageState {
  switch (action.type) {
    case SecureMessageActionTypes.GET_MESSAGE_SUCCESS: {
      return { ...state, message: action.payload, inProgress: false, errorMessage: null };
    }
    case SecureMessageActionTypes.GET_MESSAGE_FAILURE: {
      return { ...state, message: null, inProgress: false, errorMessage: 'Unable to load message.' };
    }
    default: {
      return state;
    }
  }
}
