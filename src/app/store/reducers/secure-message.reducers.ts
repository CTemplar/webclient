import { SecureMessageActions, SecureMessageActionTypes } from '../actions';
import { SecureMessageState } from '../datatypes';

export function reducer(
  state: SecureMessageState = {
    message: null,
    inProgress: false,
  },
  action: SecureMessageActions,
): SecureMessageState {
  switch (action.type) {
    case SecureMessageActionTypes.GET_MESSAGE_SUCCESS: {
      return { ...state, message: action.payload, inProgress: false, errorMessage: null };
    }
    case SecureMessageActionTypes.GET_MESSAGE_FAILURE: {
      return { ...state, message: null, inProgress: false, errorMessage: 'Unable to load message.' };
    }
    case SecureMessageActionTypes.UPDATE_SECURE_MESSAGE_KEY: {
      return {
        ...state,
        decryptedKey: action.payload.decryptedKey,
        isKeyDecryptionInProgress: action.payload.inProgress,
        errorMessage: action.payload.error ? 'Unable to decrypt message. Please try again.' : null,
      };
    }
    case SecureMessageActionTypes.UPDATE_SECURE_MESSAGE_CONTENT: {
      return {
        ...state,
        decryptedContent: action.payload.decryptedContent,
        isContentDecryptionInProgress: action.payload.inProgress,
      };
    }
    case SecureMessageActionTypes.UPDATE_SECURE_MESSAGE_ENCRYPTED_CONTENT: {
      return {
        ...state,
        isEncryptionInProgress: action.payload.inProgress,
        encryptedContent: action.payload.encryptedContent,
      };
    }
    case SecureMessageActionTypes.SEND_SECURE_MESSAGE_REPLY: {
      return { ...state, inProgress: true, errorMessage: null };
    }
    case SecureMessageActionTypes.SEND_SECURE_MESSAGE_REPLY_SUCCESS: {
      return { ...state, inProgress: false, errorMessage: null };
    }
    case SecureMessageActionTypes.SEND_SECURE_MESSAGE_REPLY_FAILURE: {
      return { ...state, inProgress: false, errorMessage: 'Unable to send secure reply.' };
    }
    case SecureMessageActionTypes.GET_SECURE_MESSAGE_USERS_KEYS: {
      return { ...state, inProgress: true, getUserKeyInProgress: true };
    }
    case SecureMessageActionTypes.GET_SECURE_MESSAGE_USERS_KEYS_SUCCESS: {
      return { ...state, inProgress: false, getUserKeyInProgress: false, usersKeys: action.payload };
    }
    default: {
      return state;
    }
  }
}
