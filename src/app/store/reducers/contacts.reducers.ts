import { ContactKey, ContactsState } from '../datatypes';
import { ContactsActionAll, ContactsActionTypes } from '../actions/contacts.action';
import { sortByString } from '../services';

export const initialState: ContactsState = {
  contacts: [],
  totalContacts: 0,
  noOfDecryptedContacts: 0,
  loaded: false,
  contactsToDecrypt: [],
  selectedContactKeys: [],
};

export function reducer(state = initialState, action: ContactsActionAll): ContactsState {
  switch (action.type) {
    case ContactsActionTypes.CONTACT_GET: {
      return { ...state, loaded: false, inProgress: true, contactsToDecrypt: [] };
    }

    case ContactsActionTypes.CONTACT_GET_SUCCESS: {
      return {
        ...state,
        contacts: action.payload.results,
        contactsToDecrypt: action.payload.isDecrypting ? action.payload.results : [],
        totalContacts: action.payload.total_count,
        loaded: true,
        inProgress: false,
      };
    }

    case ContactsActionTypes.CONTACT_GET_FAILURE: {
      return {
        ...state,
        loaded: true,
        inProgress: false,
      };
    }

    case ContactsActionTypes.CLEAR_CONTACTS_TO_DECRYPT: {
      return {
        ...state,
        contactsToDecrypt: [],
        noOfDecryptedContacts: action.payload && action.payload.clearCount ? 0 : state.noOfDecryptedContacts,
      };
    }

    case ContactsActionTypes.CONTACT_BATCH_UPDATE: {
      return { ...state, noOfDecryptedContacts: state.noOfDecryptedContacts + action.payload.contact_list.length };
    }

    case ContactsActionTypes.CONTACT_NOTIFY:
    case ContactsActionTypes.CONTACT_DELETE:
    case ContactsActionTypes.CONTACT_ADD: {
      return { ...state, inProgress: true, isError: false };
    }
    case ContactsActionTypes.CONTACT_NOTIFY_SUCCESS:
    case ContactsActionTypes.CONTACT_NOTIFY_FAILURE: {
      return { ...state, inProgress: false, isError: false };
    }
    case ContactsActionTypes.CONTACT_ADD_SUCCESS: {
      if (action.payload.isUpdating) {
        const contact = state.contacts.find(item => item.id === action.payload.id);
        contact.note = action.payload.note;
        contact.address = action.payload.address;
        contact.phone = action.payload.phone;
        contact.phone2 = action.payload.phone2;
        contact.email = action.payload.email;
        contact.name = action.payload.name;
        contact.enabled_encryption = action.payload.enabled_encryption;
        // TODO should be updated to set public key list
        // contact.public_key = action.payload.public_key;
        return { ...state, inProgress: false, isError: false };
      }
      state.totalContacts += 1;

      return {
        ...state,
        contacts: sortByString(state.contacts.concat([action.payload]), 'name'),
        inProgress: false,
        isError: false,
      };
    }
    case ContactsActionTypes.CONTACT_ADD_ERROR: {
      return { ...state, inProgress: false, isError: true };
    }

    case ContactsActionTypes.CONTACT_DELETE_SUCCESS: {
      const ids = action.payload.split(',');
      const contacts = state.contacts.filter(item => ids.includes(`${item.id}`));
      contacts.forEach(contact => {
        state.contacts.splice(state.contacts.indexOf(contact), 1);
      });
      state.totalContacts -= ids.length;
      return { ...state, inProgress: false, isError: false };
    }

    case ContactsActionTypes.CONTACT_IMPORT: {
      return { ...state, inProgress: true };
    }

    case ContactsActionTypes.CONTACT_IMPORT_SUCCESS: {
      return { ...state, inProgress: false };
    }

    case ContactsActionTypes.CONTACT_IMPORT_FAILURE: {
      return { ...state, inProgress: false };
    }

    case ContactsActionTypes.GET_EMAIL_CONTACTS: {
      return { ...state, emailContacts: [] };
    }

    case ContactsActionTypes.GET_EMAIL_CONTACTS_SUCCESS: {
      return { ...state, emailContacts: action.payload };
    }

    case ContactsActionTypes.CONTACT_DECRYPT_SUCCESS: {
      const contacts = state.contacts.map(contact => {
        if (contact.id === action.payload.id) {
          contact = action.payload;
          contact.isDecryptedFrontend = true;
          contact.is_decryptionInProgress = false;
        }
        return contact;
      });
      return { ...state, contacts };
    }

    case ContactsActionTypes.CONTACT_FETCH_KEYS: {
      return { ...state, inProgress: true };
    }

    case ContactsActionTypes.CONTACT_FETCH_KEYS_SUCCESS: {
      const selectedContactKeys = action.payload.results;
      return { 
        ...state,
        selectedContactKeys,
        inProgress: false
      };
    }

    case ContactsActionTypes.CONTACT_FETCH_KEYS_FAILURE: {
      return { ...state, inProgress: false };
    }

    case ContactsActionTypes.CONTACT_ADD_KEYS: {
      return { ...state, inProgress: true };
    }

    case ContactsActionTypes.CONTACT_ADD_KEYS_SUCCESS: {
      const selectedContactKeys = state.selectedContactKeys;
      let filteredKeys = selectedContactKeys.filter(key => key.fingerprint !== action.payload.fingerprint);
      filteredKeys = [ ...filteredKeys, action.payload ];
      return { 
        ...state, 
        selectedContactKeys: filteredKeys,
        inProgress: false 
      };
    }

    case ContactsActionTypes.CONTACT_ADD_KEYS_FAILURE: {
      return { ...state, inProgress: false };
    }

    case ContactsActionTypes.CONTACT_REMOVE_KEYS: {
      return { ...state, inProgress: true };
    }

    case ContactsActionTypes.CONTACT_REMOVE_KEYS_SUCCESS: {
      const newContactKeys = state.selectedContactKeys.filter(key => key.fingerprint !== action.payload.fingerprint);
      return { 
        ...state, 
        selectedContactKeys: newContactKeys,
        inProgress: false };
    }

    case ContactsActionTypes.CONTACT_REMOVE_KEYS_FAILURE: {
      return { ...state, inProgress: false };
    }

    default: {
      return state;
    }
  }
}
