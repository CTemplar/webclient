// Custom Action

import { UsersActionAll, UsersActionTypes } from '../actions';
// Model
import { UserState } from '../datatypes';
import { sortByString } from '../services';

export const initialState: UserState = {
  username: null,
  id: null,
  isPrime: false,
  whiteList: [],
  blackList: [],
  contact: [],
  totalContacts: 0,
  settings: {},
  membership: {},
  mailboxes: [],
  payment_transaction: {},
  customFolders: [],
  filters: [],
  customDomains: [],
  currentCreationStep: 0,
  invoices: []
};

export function reducer(state = initialState, action: UsersActionAll): UserState {
  switch (action.type) {
    case UsersActionTypes.ACCOUNTS_READ_SUCCESS: {
      return { ...state, id: action.payload.id, username: action.payload.username };
    }
    case UsersActionTypes.WHITELIST_READ_SUCCESS: {
      return { ...state, whiteList: action.payload };
    }

    case UsersActionTypes.WHITELIST_ADD:
    case UsersActionTypes.BLACKLIST_ADD:
    case UsersActionTypes.WHITELIST_DELETE:
    case UsersActionTypes.BLACKLIST_DELETE: {
      return { ...state, inProgress: true, isError: false, error: '' };
    }

    case UsersActionTypes.WHITELIST_ADD_SUCCESS: {
      if (!state.whiteList) {
        state.whiteList = [];
      }
      return {
        ...state,
        whiteList: state.whiteList.concat(action.payload),
        inProgress: false,
        isError: false,
        error: '',
      };
    }

    case UsersActionTypes.BLACKLIST_ADD_SUCCESS: {
      if (!state.blackList) {
        state.blackList = [];
      }
      return {
        ...state,
        blackList: state.blackList.concat(action.payload),
        inProgress: false,
        isError: false,
      };
    }

    case UsersActionTypes.WHITELIST_DELETE_SUCCESS: {
      state.whiteList.splice(
        state.whiteList.indexOf(state.whiteList.filter(item => item.id === action.payload)[0]),
        1);
      return {
        ...state,
        inProgress: false,
        isError: false,
        error: '',
      };
    }

    case UsersActionTypes.BLACKLIST_DELETE_SUCCESS: {
      state.blackList.splice(
        state.blackList.indexOf(state.blackList.filter(item => item.id === action.payload)[0]),
        1);
      return {
        ...state,
        inProgress: false,
        isError: false,
        error: '',
      };
    }

    case UsersActionTypes.WHITELIST_ADD_ERROR:
    case UsersActionTypes.BLACKLIST_ADD_ERROR: {
      return {
        ...state,
        inProgress: false,
        isError: true,
        error: action.payload.non_field_errors ? action.payload.non_field_errors[0] : '',
      };
    }

    case UsersActionTypes.BLACKLIST_READ_SUCCESS: {
      return { ...state, blackList: action.payload };
    }

    case UsersActionTypes.CONTACT_GET_SUCCESS: {
      return { ...state, contact: action.payload.results, totalContacts: action.payload.total_count };
    }
    case UsersActionTypes.CONTACT_DELETE:
    case UsersActionTypes.CONTACT_ADD: {
      return { ...state, inProgress: true, isError: false };
    }
    case UsersActionTypes.CONTACT_ADD_SUCCESS: {
      if (action.payload.isUpdating) {
        const contact = state.contact.filter(item => item.id === action.payload.id)[0];
        contact.note = action.payload.note;
        contact.address = action.payload.address;
        contact.phone = action.payload.phone;
        contact.phone2 = action.payload.phone2;
        contact.email = action.payload.email;
        contact.name = action.payload.name;
        return { ...state, inProgress: false, isError: false };
      }
      return { ...state, contact: sortByString(state.contact.concat([action.payload]), 'name'), inProgress: false, isError: false };
    }
    case UsersActionTypes.CONTACT_ADD_ERROR: {
      return { ...state, inProgress: false, isError: true };
    }

    case UsersActionTypes.CONTACT_DELETE_SUCCESS: {
      const ids = action.payload.split(',');
      const contacts = state.contact.filter(item => ids.indexOf(`${item.id}`) > -1);
      contacts.forEach(contact => {
        state.contact.splice(state.contact.indexOf(contact), 1);
      });

      return { ...state, inProgress: false, isError: false };
    }

    case UsersActionTypes.CONTACT_IMPORT: {
      return { ...state, inProgress: true };
    }

    case UsersActionTypes.CONTACT_IMPORT_SUCCESS: {
      return { ...state, inProgress: false };
    }

    case UsersActionTypes.CONTACT_IMPORT_FAILURE: {
      return { ...state, inProgress: false };
    }

    case UsersActionTypes.GET_EMAIL_CONTACTS: {
      return { ...state, emailContacts: [] };
    }

    case UsersActionTypes.GET_EMAIL_CONTACTS_SUCCESS: {
      return { ...state, emailContacts: action.payload };
    }

    case UsersActionTypes.ACCOUNT_DETAILS_GET: {
      return { ...state, isLoaded: false };
    }
    case UsersActionTypes.ACCOUNT_DETAILS_GET_SUCCESS: {
      return {
        ...state,
        id: action.payload.id,
        username: action.payload.username,
        isPrime: action.payload.is_prime,
        joinedDate: action.payload.joined_date,
        settings: action.payload.settings,
        mailboxes: action.payload.mailboxes.map((item, index) => {
          item.sort_order = item.sort_order || index + 1;
          return item;
        }),
        payment_transaction: action.payload.payment_transaction ? action.payload.payment_transaction : {},
        customFolders: action.payload.custom_folders.map((item, index) => {
          item.sort_order = item.sort_order || index + 1;
          return item;
        }),
        autoresponder: action.payload.autoresponder,
        isLoaded: true,
      };
    }

    case UsersActionTypes.SETTINGS_UPDATE_SUCCESS: {
      return {
        ...state,
        settings: action.payload,
      };
    }

    case UsersActionTypes.MEMBERSHIP_UPDATE: {
      return { ...state, membership: action.payload };
    }

    case UsersActionTypes.CREATE_FOLDER: {
      return {
        ...state,
        inProgress: true,
      };
    }

    case UsersActionTypes.CREATE_FOLDER_SUCCESS: {
      let index = -1;
      action.payload.sort_order = action.payload.sort_order || state.customDomains.length;
      state.customFolders.forEach((folder, i) => {
        if (folder.id === action.payload.id) {
          index = i;
        }
      });
      if (index > -1) {
        state.customFolders[index] = action.payload;
      } else {
        state.customFolders = [...state.customFolders, action.payload];
      }
      return {
        ...state,
        inProgress: false,
      };
    }

    case UsersActionTypes.DELETE_FOLDER: {
      return {
        ...state,
        inProgress: true,
      };
    }

    case UsersActionTypes.DELETE_FOLDER_SUCCESS: {
      state.customFolders = state.customFolders.filter(folder => folder.id !== action.payload.id);
      return {
        ...state,
        inProgress: false,
      };
    }

    case UsersActionTypes.UPDATE_FOLDER_ORDER: {
      return {
        ...state,
        inProgress: true,
      };
    }

    case UsersActionTypes.UPDATE_FOLDER_ORDER_SUCCESS: {
      return {
        ...state,
        inProgress: false,
        customFolders: action.payload.folders,
      };
    }

    case UsersActionTypes.GET_FILTERS_SUCCESS: {
      return { ...state, filters: action.payload };
    }

    case UsersActionTypes.CREATE_FILTER:
    case UsersActionTypes.UPDATE_FILTER:
    case UsersActionTypes.DELETE_FILTER: {
      return { ...state, inProgress: true, filtersError: null };
    }

    case UsersActionTypes.CREATE_FILTER_SUCCESS: {
      state.filters = [...state.filters, action.payload];
      return { ...state, inProgress: false, filtersError: null };
    }

    case UsersActionTypes.UPDATE_FILTER_SUCCESS: {
      state.filters = state.filters.map(filter => {
        if (filter.id === action.payload.id) {
          return { ...action.payload };
        }
        return filter;
      });
      return { ...state, inProgress: false, filtersError: null };
    }

    case UsersActionTypes.DELETE_FILTER_SUCCESS: {
      state.filters = state.filters.filter(filter => filter.id !== action.payload.id);
      return { ...state, inProgress: false, filtersError: null };
    }

    case UsersActionTypes.CREATE_FILTER_FAILURE:
    case UsersActionTypes.UPDATE_FILTER_FAILURE:
    case UsersActionTypes.DELETE_FILTER_FAILURE: {
      const error = Object.keys(action.payload).map(key => `${key}: ${action.payload[key]}`).join(', ');
      return { ...state, inProgress: false, filtersError: error };
    }

    case UsersActionTypes.GET_DOMAINS: {
      return {
        ...state,
        inProgress: true,
        isError: false,
        customDomainsLoaded: false,
        newCustomDomainError: null,
      };
    }
    case UsersActionTypes.GET_DOMAINS_SUCCESS: {
      return {
        ...state,
        customDomains: action.payload,
        customDomainsLoaded: true,
        inProgress: false,
      };
    }

    case UsersActionTypes.READ_DOMAIN:
    case UsersActionTypes.DELETE_DOMAIN:
    case UsersActionTypes.VERIFY_DOMAIN: {
      return {
        ...state,
        inProgress: true,
        isError: false,
        error: '',
        newCustomDomainError: null,
        currentCreationStep: action.payload.currentStep,
      };
    }

    case UsersActionTypes.CREATE_DOMAIN: {
      return {
        ...state,
        inProgress: true,
        isError: false,
        error: '',
        newCustomDomainError: null,
        currentCreationStep: 0
      };
    }

    case UsersActionTypes.UPDATE_DOMAIN: {
      return {
        ...state,
        inProgress: true
      };
    }

    case UsersActionTypes.UPDATE_DOMAIN_SUCCESS:
    case UsersActionTypes.UPDATE_DOMAIN_FAILURE: {
      return {
        ...state,
        inProgress: false
      };
    }

    case UsersActionTypes.READ_DOMAIN_SUCCESS: {
      return {
        ...state,
        inProgress: false,
        isError: false,
        newCustomDomain: action.payload,
      };
    }

    case UsersActionTypes.VERIFY_DOMAIN_SUCCESS: {
      const domain = action.payload.res;
      let isError: boolean = false;
      let step = action.payload.step;
      if ((step === 1 && domain.is_domain_verified)
        || step >= 2) {
        if (action.payload.gotoNextStep) {
          step++;
        }
      } else {
        isError = true;
      }
      return {
        ...state,
        isError,
        inProgress: false,
        newCustomDomain: action.payload.res,
        currentCreationStep: step
      };
    }

    case UsersActionTypes.CREATE_DOMAIN_SUCCESS: {
      state.customDomains = [...state.customDomains, action.payload];
      return {
        ...state,
        inProgress: false,
        isError: false,
        newCustomDomain: action.payload,
        currentCreationStep: 1
      };
    }

    case UsersActionTypes.CREATE_DOMAIN_FAILURE: {
      return {
        ...state,
        inProgress: false,
        isError: true,
        newCustomDomainError: action.payload,
        currentCreationStep: 0
      };
    }

    case UsersActionTypes.READ_DOMAIN_FAILURE:
    case UsersActionTypes.VERIFY_DOMAIN_FAILURE: {
      return {
        ...state,
        inProgress: false,
        isError: true,
        error: Object.keys(action.payload.err).map(key => `${key}: ${action.payload.err[key]}`).join(', '),
        currentCreationStep: action.payload.step
      };
    }

    case UsersActionTypes.DELETE_DOMAIN_SUCCESS: {
      state.customDomains = state.customDomains.filter(domain => domain.id !== action.payload);
      return {
        ...state,
        inProgress: false,
      };
    }

    case UsersActionTypes.DELETE_DOMAIN_FAILURE: {
      return {
        ...state,
        inProgress: false,
        isError: true,
        error: action.payload.detail,
      };
    }

    case UsersActionTypes.SEND_EMAIL_FORWARDING_CODE: {
      return { ...state, inProgress: true, emailForwardingErrorMessage: null, isForwardingVerificationCodeSent: false };
    }

    case UsersActionTypes.SEND_EMAIL_FORWARDING_CODE_SUCCESS: {
      return { ...state, inProgress: false, emailForwardingErrorMessage: null, isForwardingVerificationCodeSent: true };
    }

    case UsersActionTypes.SEND_EMAIL_FORWARDING_CODE_FAILURE:
    case UsersActionTypes.VERIFY_EMAIL_FORWARDING_CODE_FAILURE: {
      return { ...state, inProgress: false, emailForwardingErrorMessage: action.payload };
    }

    case UsersActionTypes.VERIFY_EMAIL_FORWARDING_CODE: {
      return { ...state, inProgress: true, emailForwardingErrorMessage: null, isForwardingVerificationCodeSent: true };
    }

    case UsersActionTypes.VERIFY_EMAIL_FORWARDING_CODE_SUCCESS: {
      return { ...state, inProgress: false, emailForwardingErrorMessage: null };
    }

    case UsersActionTypes.SAVE_AUTORESPONDER: {
      return { ...state, inProgress: true, autoresponder: action.payload, autoResponderErrorMessage: null };
    }

    case UsersActionTypes.SAVE_AUTORESPONDER_SUCCESS: {
      return { ...state, inProgress: false, autoresponder: action.payload, autoResponderErrorMessage: null };
    }

    case UsersActionTypes.SAVE_AUTORESPONDER_FAILURE: {
      return { ...state, inProgress: false, autoResponderErrorMessage: action.payload };
    }

    case UsersActionTypes.GET_INVOICES: {
      return { ...state, invoices: [], isInvoiceLoaded: false };
    }

    case UsersActionTypes.GET_INVOICES_SUCCESS: {
      return { ...state, invoices: action.payload, isInvoiceLoaded: true };
    }

    default: {
      return state;
    }
  }
}
