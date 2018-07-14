// Custom Action
import { MailActions, MailActionTypes } from '../actions';
// Model
import { MailState } from '../datatypes';

export const initialState: MailState = {
  mails: [],
  mailDetail: null,
  folders: [],
  inProgress: false,
  draft: null,
  encryptedContent: null,
  decryptedContent: null,
  isPGPInProgress: false,
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

    case MailActionTypes.MOVE_MAIL_SUCCESS: {
      // TODO: use immutable version of remove items from array, with modifying the state directly

      // Uncomment after payload has been fixed
      // state.mails = state.mails.filter(item=> item.id !== action.payload.id);
      return {...state, inProgress: false};
    }

    case MailActionTypes.READ_MAIL_SUCCESS: {
      // TODO: use immutable version of remove items from array, with modifying the state directly

      // Uncomment after payload has been fixed
      // state.mails = state.mails.filter(item=> item.id !== action.payload.id);
      return {...state, inProgress: false};
    }

    case MailActionTypes.STAR_MAIL_SUCCESS: {
        // TODO: use immutable version of remove items from array, with modifying the state directly

        // Uncomment after payload has been fixed
        // state.mails = state.mails.filter(item=> item.id !== action.payload.id);
        return {...state, inProgress: false};
    }

    case MailActionTypes.DELETE_MAIL_SUCCESS: {
      state.mails.splice(state.mails.indexOf(state.mails.filter(item => item.id === action.payload.id)[0]), 1);
      return { ...state, inProgress: false };
    }

    case MailActionTypes.CREATE_MAIL_SUCCESS: {
      let newEntry: boolean = true;
      state.mails.map((mail, index) => {
        if (mail.id === action.payload.id) {
          state.mails[index] = action.payload;
          newEntry = false;
        }
      });
      if (newEntry) {
        state.mails.push(action.payload);
      }
      return { ...state, inProgress: false, draft: action.payload };
    }

    case MailActionTypes.UPDATE_LOCAL_DRAFT: {
      return { ...state, draft: action.payload, isPGPInProgress: true };
    }

    case MailActionTypes.UPDATE_PGP_CONTENT: {
      return {
        ...state,
        isPGPInProgress: action.payload.isPGPInProgress,
        encryptedContent: action.payload.encryptedContent,
        decryptedContent: action.payload.decryptedContent,
      };
    }

    case MailActionTypes.CLOSE_MAILBOX: {
      return { ...state, inProgress: false, draft: null };
    }

    case MailActionTypes.GET_MAIL_DETAIL_SUCCESS: {
      return {
        ...state,
        mailDetail: action.payload
      };
    }

    default: {
      return state;
    }
  }
}
