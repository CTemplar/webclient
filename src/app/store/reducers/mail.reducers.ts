// Custom Action
import { MailActions, MailActionTypes } from '../actions';
// Model
import { MailState } from '../datatypes';

export const initialState: MailState = {
  mails: [],
  folders: [],
  inProgress: false,
  draft: null,
};

export function reducer(state = initialState, action: MailActions): MailState {
  switch (action.type) {
    case MailActionTypes.GET_MAILS_SUCCESS: {
      return {
        ...state,
        mails: action.payload
      };
    }


    case MailActionTypes.DELETE_MAIL:
    case MailActionTypes.CREATE_MAIL: {
      return { ...state, inProgress: true };
    }

    case MailActionTypes.DELETE_MAIL_SUCCESS:
    case MailActionTypes.CREATE_MAIL_SUCCESS: {
      state.mails.map((mail, index) => {
        if (mail.id === action.payload.id) {
          state.mails[index] = action.payload;
        }
      });
      return { ...state, inProgress: false };
    }

    default: {
      return state;
    }
  }
}
