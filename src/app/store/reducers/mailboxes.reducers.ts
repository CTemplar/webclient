import { MailActions, MailActionTypes } from '../actions';
import { MailBoxesState, MailboxKey } from '../datatypes';
import { Mailbox } from '../models/mail.model';
import { SafePipe } from '../../shared/pipes/safe.pipe';

export function reducer(
  state: MailBoxesState = {
    mailboxes: [],
    currentMailbox: null,
    decryptKeyInProgress: false,
    encryptionInProgress: false,
    mailboxKeysMap: new Map(),
  },
  action: MailActions,
): MailBoxesState {
  switch (action.type) {
    case MailActionTypes.GET_MAILBOXES: {
      return {
        ...state,
        inProgress: true,
      };
    }
    case MailActionTypes.GET_MAILBOXES_SUCCESS: {
      const mailboxes = action.payload;
      // Filling up primary keys for multiple keys
      const mailboxKeysMap = new Map();
      mailboxes.forEach((mailbox: Mailbox) => {
        const primaryKey: MailboxKey = {};
        primaryKey.public_key = mailbox.public_key;
        primaryKey.private_key = mailbox.private_key;
        primaryKey.fingerprint = mailbox.fingerprint;
        primaryKey.key_type = mailbox.key_type;
        primaryKey.is_primary = true;
        mailboxKeysMap.set(mailbox.id, [ primaryKey ]);
      });
      return {
        ...state,
        mailboxes: action.payload.map((item, index) => {
          item.sort_order = item.sort_order ? item.sort_order : index + 1;
          item.display_name = SafePipe.processSanitization(item.display_name, false);
          item.signature = SafePipe.processSanitization(item.signature, false);
          return item;
        }),
        mailboxKeysMap,
        inProgress: false,
        currentMailbox: action.payload.find((item: Mailbox) => item.is_enabled),
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

    case MailActionTypes.MAILBOX_SETTINGS_UPDATE_SUCCESS: {
      const updatedCurrentMailBox: Mailbox = action.payload;
      updatedCurrentMailBox.inProgress = false;
      let { mailboxes } = state;

      mailboxes = mailboxes.map(mailbox => {
        if (mailbox.id === updatedCurrentMailBox.id) {
          return { ...updatedCurrentMailBox };
        }
        return mailbox;
      });

      if (updatedCurrentMailBox.id === state.currentMailbox.id) {
        state.currentMailbox = { ...updatedCurrentMailBox };
      }

      return {
        ...state,
        mailboxes,
        inProgress: false,
      };
    }

    case MailActionTypes.MAILBOX_SETTINGS_UPDATE_FAILURE: {
      return {
        ...state,
        mailboxes: state.mailboxes.map(mailbox => {
          if (mailbox.id === action.payload.id) {
            mailbox.inProgress = false;
          }
          return mailbox;
        }),
      };
    }

    case MailActionTypes.CREATE_MAILBOX: {
      return { ...state, inProgress: true };
    }

    case MailActionTypes.CREATE_MAILBOX_SUCCESS: {
      state.mailboxes = [...state.mailboxes, action.payload];
      return { ...state, inProgress: false };
    }

    case MailActionTypes.CREATE_MAILBOX_FAILURE: {
      return { ...state, inProgress: false };
    }

    case MailActionTypes.SET_DEFAULT_MAILBOX_SUCCESS: {
      const updatedCurrentMailBox: Mailbox = action.payload;
      const previousDefaultMailBox = state.mailboxes.find(mailbox => !!mailbox.is_default);
      let { mailboxes } = state;
      mailboxes = mailboxes.map(mailbox => {
        if (mailbox.id === updatedCurrentMailBox.id) {
          return { ...updatedCurrentMailBox };
        }
        if (mailbox.id === previousDefaultMailBox.id) {
          return { ...mailbox, is_default: false };
        }
        return mailbox;
      });

      if (updatedCurrentMailBox.id === state.currentMailbox.id) {
        state.currentMailbox = { ...updatedCurrentMailBox };
      } else if (previousDefaultMailBox.id === state.currentMailbox.id) {
        state.currentMailbox = { ...state.currentMailbox, is_default: false };
      }

      return {
        ...state,
        mailboxes,
      };
    }

    case MailActionTypes.UPDATE_MAILBOX_ORDER: {
      return { ...state, isUpdatingOrder: true };
    }

    case MailActionTypes.UPDATE_MAILBOX_ORDER_SUCCESS: {
      return {
        ...state,
        mailboxes: action.payload.mailboxes,
        currentMailbox: action.payload.mailboxes[0],
        isUpdatingOrder: false,
      };
    }

    case MailActionTypes.DELETE_MAILBOX_SUCCESS: {
      return { ...state, mailboxes: state.mailboxes.filter(mailbox => mailbox.id !== action.payload.id) };
    }

    case MailActionTypes.FETCH_MAILBOX_KEYS: {
      return {
        ...state,
        mailboxKeyInProgress: true,
      }
    }

    case MailActionTypes.FETCH_MAILBOX_KEYS_SUCCESS: {
      const mailboxKeys = action.payload.results;
      const mailboxKeysMap = state.mailboxKeysMap;
      const mailboxes = state.mailboxes;
      if (mailboxKeys && mailboxKeys.length > 0) {
        mailboxes.forEach((mailbox: Mailbox) => {
          const specificKeys = mailboxKeys.filter(key => key.mailbox === mailbox.id);
          const originKeys = mailboxKeysMap.get(mailbox.id);
          mailboxKeysMap.set(mailbox.id, [ ...originKeys, ...specificKeys]);
        });
      }
      return {
        ...state,
        mailboxKeysMap,
        mailboxKeyInProgress: false,
      }
    }

    case MailActionTypes.FETCH_MAILBOX_KEYS_FAILURE: {
      return {
        ...state,
        mailboxKeyInProgress: false,
      }
    }

    case MailActionTypes.ADD_MAILBOX_KEYS: {
      return {
        ...state,
        mailboxKeyInProgress: true,
      }
    }

    case MailActionTypes.ADD_MAILBOX_KEYS_SUCCESS: {
      
      const newKey = action.payload;
      const mailboxKeysMap = state.mailboxKeysMap;
      if (mailboxKeysMap.has(newKey.mailbox)) {
        let originKeys = mailboxKeysMap.get(newKey.mailbox);
        mailboxKeysMap.set(newKey.mailbox, [ ...originKeys, newKey ]);
      } else {
        mailboxKeysMap.set(newKey.mailbox, [ newKey ]);
      }
      return {
        ...state,
        mailboxKeysMap,
        mailboxKeyInProgress: false,
      }
    }

    case MailActionTypes.ADD_MAILBOX_KEYS_FAILURE: {
      return {
        ...state,
        mailboxKeyInProgress: false,
      }
    }

    case MailActionTypes.DELETE_MAILBOX_KEYS: {
      return {
        ...state,
        mailboxKeyInProgress: true,
      }
    }

    case MailActionTypes.DELETE_MAILBOX_KEYS_SUCCESS: {
      const deletedKey = action.payload;
      const mailboxKeysMap = state.mailboxKeysMap;
      if (mailboxKeysMap.has(deletedKey.mailbox)) {
        let originKeys = mailboxKeysMap.get(deletedKey.mailbox);
        mailboxKeysMap.set(deletedKey.mailbox, originKeys.filter(key => deletedKey.id !== key.id));
      }
      return {
        ...state,
        mailboxKeysMap,
        mailboxKeyInProgress: false,
      }
    }

    case MailActionTypes.DELETE_MAILBOX_KEYS_FAILURE: {
      return {
        ...state,
        mailboxKeyInProgress: false,
      }
    }

    case MailActionTypes.SET_PRIMARY_MAILBOX_KEYS: {
      return {
        ...state,
        mailboxKeyInProgress: true,
      }
    }

    case MailActionTypes.SET_PRIMARY_MAILBOX_KEYS_SUCCESS: {
      const newPrimaryKey: MailboxKey = action.payload;
      // Update mailbox to set key info
      const mailboxes = state.mailboxes;
      mailboxes.forEach(mailbox => {
        mailbox.public_key = newPrimaryKey.public_key;
        mailbox.private_key = newPrimaryKey.private_key;
        mailbox.fingerprint = newPrimaryKey.fingerprint;
        mailbox.key_type = newPrimaryKey.key_type;
      });

      // Update mailbox key list
      const mailboxKeysMap = state.mailboxKeysMap;
      if (mailboxKeysMap.has(newPrimaryKey.mailbox) && mailboxKeysMap.get(newPrimaryKey.mailbox).length > 0) {
        mailboxKeysMap.get(newPrimaryKey.mailbox).forEach(key => {
          if (key.id === newPrimaryKey.id) {
            key.is_primary = true;
          } else {
            key.is_primary = false;
          }
        });
      }
      return {
        ...state,
        mailboxes,
        mailboxKeysMap,
        mailboxKeyInProgress: false,
      }
    }

    case MailActionTypes.SET_PRIMARY_MAILBOX_KEYS_FAILURE: {
      return {
        ...state,
        mailboxKeyInProgress: false,
      }
    }

    default: {
      return state;
    }
  }
}
