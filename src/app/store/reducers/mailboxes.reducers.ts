// Custom Action
import { MailActions, MailActionTypes } from '../actions';
// Model
import { MailBoxesState } from '../datatypes';


export function reducer(
  state: MailBoxesState = {
    mailboxes: [],
    currentMailbox: null,
    decryptKeyInProgress: false,
    encryptionInProgress: false
  }, action: MailActions): MailBoxesState {
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

    case MailActionTypes.SET_FOLDERS: {
      state.currentMailbox.customFolders = [...state.currentMailbox.customFolders, action.payload];
      state.mailboxes = state.mailboxes.map((mailbox) => {
        if (mailbox.id === state.currentMailbox.id) {
          return { ...state.currentMailbox };
        }
        return mailbox;
      });
      return {
        ...state
      };
    }
    case MailActionTypes.CREATE_FOLDER: {
      return {
        ...state,
        inProgress: true,
      };
    }
    case MailActionTypes.CREATE_FOLDER_SUCCESS: {
      state.currentMailbox.customFolders = [...state.currentMailbox.customFolders, action.payload];
      state.mailboxes = state.mailboxes.map((mailbox) => {
        if (mailbox.id === state.currentMailbox.id) {
          return { ...state.currentMailbox };
        }
        return mailbox;
      });
      return {
        ...state,
        inProgress: false,
      };
    }

    default: {
      return state;
    }
  }
}
