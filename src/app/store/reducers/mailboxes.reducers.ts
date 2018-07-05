// Custom Action
import { MailActions, MailActionTypes } from '../actions';
// Model
import { MailBoxesState } from '../datatypes';

export const initialState: MailBoxesState = {
  mailboxes: []
};

export function reducer(state = initialState, action: MailActions): MailBoxesState {
  switch (action.type) {

    case MailActionTypes.GET_MAILBOXES_SUCCESS: {
      return {
        ...state,
        mailboxes: action.payload
      };
    }

    default: {
      return state;
    }
  }
}
