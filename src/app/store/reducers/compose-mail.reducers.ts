// Custom Action
import { ComposeMailActions, ComposeMailActionTypes } from '../actions';
// Model
import { ComposeMailState } from '../datatypes';

export function reducer(state: ComposeMailState = { drafts: {} }, action: ComposeMailActions): ComposeMailState {
  switch (action.type) {

    case ComposeMailActionTypes.SEND_MAIL:
    case ComposeMailActionTypes.CREATE_MAIL: {
      state.drafts[action.payload.id] = { ...state.drafts[action.payload.id], inProgress: true, shouldSend: false, shouldSave: false };
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.CREATE_MAIL_SUCCESS: {
      state.drafts[action.payload.draft.id] = {
        ...state.drafts[action.payload.draft.id],
        inProgress: false,
        draft: action.payload.response
      };
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.UPDATE_LOCAL_DRAFT: {
      state.drafts[action.payload.id] = { ... state.drafts[action.payload.id], ...action.payload };
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.UPDATE_PGP_ENCRYPTED_CONTENT: {
      if (action.payload.draftId) {
        state.drafts[action.payload.draftId] = {
          ...state.drafts[action.payload.draftId],
          isPGPInProgress: action.payload.isPGPInProgress,
          encryptedContent: action.payload.encryptedContent
        };
      }
      return {
        ...state,
        drafts: { ...state.drafts }
      };
    }

    case ComposeMailActionTypes.CLOSE_MAILBOX: {
      state.drafts[action.payload.id] = { ...state.drafts[action.payload.id], isClosed: true };
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.CLEAR_DRAFT: {
      delete state.drafts[action.payload.id];
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.UPLOAD_ATTACHMENT: {
      state.drafts[action.payload.draftId].attachments = [...state.drafts[action.payload.draftId].attachments, action.payload];
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.UPLOAD_ATTACHMENT_PROGRESS: {
      state.drafts[action.payload.draftId].attachments.forEach((attachment, index) => {
        if (attachment.attachmentId === action.payload.attachmentId) {
          state.drafts[action.payload.draftId].attachments[index] = {
            ...state.drafts[action.payload.draftId].attachments[index],
            progress: action.payload.progress
          };
        }
      });
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.UPLOAD_ATTACHMENT_REQUEST: {
      state.drafts[action.payload.draftId].attachments.forEach((attachment, index) => {
        if (attachment.attachmentId === action.payload.attachmentId) {
          state.drafts[action.payload.draftId].attachments[index] = {
            ...state.drafts[action.payload.draftId].attachments[index],
            request: action.payload.request
          };
        }
      });
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.UPLOAD_ATTACHMENT_SUCCESS: {
      const data = action.payload.data;
      state.drafts[data.draftId].attachments.forEach((attachment, index) => {
        if (attachment.attachmentId === data.attachmentId) {
          state.drafts[data.draftId].attachments[index] = {
            ...state.drafts[data.draftId].attachments[index],
            id: action.payload.response.id,
            inProgress: false,
            request: null
          };
        }
      });
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.UPLOAD_ATTACHMENT_FAILURE: {
      state.drafts[action.payload.draftId].attachments = state.drafts[action.payload.draftId].attachments
        .filter(attachment => attachment.attachmentId !== action.payload.attachmentId);
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.DELETE_ATTACHMENT: {
      state.drafts[action.payload.draftId].attachments.forEach((attachment, index) => {
        if (attachment.attachmentId === action.payload.attachmentId) {
          state.drafts[action.payload.draftId].attachments[index] = {
            ...state.drafts[action.payload.draftId].attachments[index],
            isRemoved: true
          };
        }
      });
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.DELETE_ATTACHMENT_SUCCESS: {
      state.drafts[action.payload.draftId].attachments = state.drafts[action.payload.draftId].attachments
        .filter(attachment => {
          if (attachment.attachmentId === action.payload.attachmentId) {
            if (!attachment.id) {
              attachment.request.unsubscribe();
            }
            return false;
          }
          return true;
        });
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.DELETE_ATTACHMENT_FAILURE: {
      state.drafts[action.payload.draftId].attachments.forEach((attachment, index) => {
        if (attachment.attachmentId === action.payload.attachmentId) {
          state.drafts[action.payload.draftId].attachments[index] = {
            ...state.drafts[action.payload.draftId].attachments[index],
            isRemoved: false
          };
        }
      });
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.NEW_DRAFT: {
      state.drafts[action.payload.id] = action.payload;
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.GET_USERS_KEYS: {
      state.drafts[action.payload.draftId] = { ...state.drafts[action.payload.draftId], getUserKeyInProgress: true };
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.GET_USERS_KEYS_SUCCESS: {
      state.drafts[action.payload.draftId] = {
        ...state.drafts[action.payload.draftId],
        getUserKeyInProgress: false,
        usersKeys: action.payload.data
      };
      return { ...state, drafts: { ...state.drafts } };
    }

    default: {
      return state;
    }
  }
}
