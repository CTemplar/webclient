// Custom Action
import { MailActionTypes, MailActionAll } from '../actions';

// Model
import { MailState } from '../datatypes';

export const initialState: MailState = {
  mails: [],
  folders: []
};

export function reducer(state = initialState, action: MailActionAll): MailState {
  switch (action.type) {
    case MailActionTypes.GET_MAILS_SUCCESS: {
      return {
        ...state,
        mails: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
