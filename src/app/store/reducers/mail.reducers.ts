// Custom Action
import { MailActionAll, MailActionTypes } from '../actions';
// Model
import { MailState } from '../datatypes';

export const initialState: MailState = {
  mails: [],
  folders: [],
  inProgress: false,
  draft: null,
};

export function reducer(state = initialState, action: MailActionAll): MailState {
  switch (action.type) {
    case MailActionTypes.GET_MAILS_SUCCESS: {
      return {
        ...state,
        mails: action.payload
      };
    }
    case MailActionTypes.CREATE_MAIL: {
      return { ...state, inProgress: true };
    }

    case MailActionTypes.CREATE_MAIL_SUCCESS: {
      return { ...state, inProgress: false, draft: action.payload };
    }

    default: {
      return state;
    }
  }
}
