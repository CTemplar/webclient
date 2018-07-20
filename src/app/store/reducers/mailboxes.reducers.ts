// Custom Action
import { MailActions, MailActionTypes } from '../actions';
// Model
import { MailBoxesState } from '../datatypes';

export const initialState: MailBoxesState = {
  mailboxes: [],
  customFolders: [],
  currentMailbox: null,
  decryptKeyInProgress: false,
  encryptionInProgress: false,
  getUserKeyInProgress: false,
  usersKeys: [],
};

export function reducer(state = initialState, action: MailActions): MailBoxesState {
  switch (action.type) {

    case MailActionTypes.GET_MAILBOXES_SUCCESS: {
      return {
        ...state,
        mailboxes: action.payload,
        currentMailbox: action.payload[0],
      };
    }

    case MailActionTypes.SET_DECRYPT_INPROGRESS: {
      return {
        ...state,
        decryptKeyInProgress: action.payload,
      };
    }

    case MailActionTypes.SET_DECRYPTED_KEY: {
      return {
        ...state,
        decryptKeyInProgress: false,
        decryptedKey: action.payload.decryptedKey,
      };
    }

    case MailActionTypes.SET_CURRENT_MAILBOX: {
      return {
        ...state,
        currentMailbox: action.payload,
      };
    }

    case MailActionTypes.SET_FOLDERS:
    case MailActionTypes.CREATE_FOLDER_SUCCESS: {
      return {
        ...state,
        customFolders: action.payload,
      };
    }
    case MailActionTypes.GET_USERS_KEYS: {
      return {
        ...state,
        getUserKeyInProgress: true,
      };
    }
    case MailActionTypes.GET_USERS_KEYS_SUCCESS: {
      return {
        ...state,
        usersKeys: action.payload,
        getUserKeyInProgress: false,
      };
    }

    default: {
      return state;
    }
  }
}
