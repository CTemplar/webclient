// Custom Action
import { MailActions, MailActionTypes } from '../actions';
// Model
import { MailState } from '../datatypes';

export const initialState: MailState = {
  mails: [],
  mailDetail: null,
  folders: new Map(),
  loaded: false,
  drafts: {},
};

export function reducer(state = initialState, action: MailActions): MailState {
  switch (action.type) {
    case MailActionTypes.GET_MAILS: {
      const mails = state.folders.get(action.payload.folder);
      return {
        ...state,
        loaded: mails ? true : false,
        mails: mails ? mails : [],
      };
    }

    case MailActionTypes.GET_MAILS_SUCCESS: {
      state.folders.set(action.payload.folder, action.payload.mails);
      return {
        ...state,
        mails: action.payload.mails,
        loaded: true,
      };
    }

    case MailActionTypes.DELETE_MAIL:
    case MailActionTypes.SEND_MAIL:
    case MailActionTypes.CREATE_MAIL: {
      state.drafts[action.payload.id] = { ...state.drafts[action.payload.id], inProgress: true, shouldSend: false, shouldSave: false };
      return { ...state, drafts: { ...state.drafts } };
    }

    case MailActionTypes.SEND_MAIL_SUCCESS: {
      return {
        ...state,
        mails: (action.payload.draft.folder === state.currentFolder) ? [...state.mails, action.payload.draft] : state.mails,
      };
    }

    case MailActionTypes.MOVE_MAIL_SUCCESS: {
      const listOfIDs = action.payload.ids.toString().split(',');
      state.mails = state.mails.filter(mail => !listOfIDs.includes(mail.id.toString()));
      return { ...state, inProgress: false };
    }

    case MailActionTypes.UNDO_DELETE_MAIL_SUCCESS: {
      return {
        ...state,
        mails: (action.payload.sourceFolder === state.currentFolder) ? [...state.mails, action.payload.mail] : state.mails,
      };
    }

    case MailActionTypes.READ_MAIL_SUCCESS: {
      const listOfIDs = action.payload.ids.split(',');
      state.mails = state.mails.map(mail => {
        if (listOfIDs.includes(mail.id.toString())) {
          mail.read = action.payload.read;
        }
        return mail;
      });
      return { ...state, inProgress: false };
    }

    case MailActionTypes.STAR_MAIL_SUCCESS: {
      const listOfIDs = action.payload.ids.split(',');
      state.mails = state.mails.map(mail => {
        if (listOfIDs.includes(mail.id.toString())) {
          mail.starred = action.payload.starred;
        }
        return mail;
      });
      return { ...state, inProgress: false };
    }

    case MailActionTypes.DELETE_MAIL_SUCCESS: {
      const listOfIDs = action.payload.ids.split(',');
      state.mails = state.mails.filter(mail => !listOfIDs.includes(mail.id.toString()));
      return { ...state, inProgress: false };
    }

    case MailActionTypes.CREATE_MAIL_SUCCESS: {
      let newEntry: boolean = true;
      state.mails.map((mail, index) => {
        if (mail.id === action.payload.response.id) {
          state.mails[index] = action.payload.response;
          newEntry = false;
        }
      });
      if (newEntry && state.currentFolder === action.payload.response.folder) {
        state.mails = [...state.mails, action.payload.response];
      }
      state.drafts[action.payload.draft.id] = {
        ...state.drafts[action.payload.draft.id],
        inProgress: false,
        draft: action.payload.response,
        shouldSave: false,
      };
      return { ...state, inProgress: false, drafts: { ...state.drafts }, };
    }

    case MailActionTypes.UPDATE_LOCAL_DRAFT: {
      state.drafts[action.payload.id] = { ... state.drafts[action.payload.id], ...action.payload };
      return { ...state, drafts: { ...state.drafts }, };
    }

    case MailActionTypes.UPDATE_PGP_CONTENT: {
      if (action.payload.draftId) {
        state.drafts[action.payload.draftId] = {
          ...state.drafts[action.payload.draftId],
          isPGPInProgress: action.payload.isPGPInProgress,
          encryptedContent: action.payload.encryptedContent
        };
      }
      return {
        ...state,
        drafts: { ...state.drafts },
        isPGPInProgress: action.payload.isPGPInProgress,
        decryptedContent: action.payload.decryptedContent
      };
    }

    case MailActionTypes.CLOSE_MAILBOX: {
      state.drafts[action.payload.id].isClosed = true;
      return { ...state, drafts: { ...state.drafts }, };
    }

    case MailActionTypes.CLEAR_DRAFT: {
      delete state.drafts[action.payload.id];
      return { ...state, drafts: { ...state.drafts }, };
    }

    case MailActionTypes.GET_MAIL_DETAIL_SUCCESS: {
      return {
        ...state,
        mailDetail: action.payload
      };
    }

    case MailActionTypes.GET_MAIL_DETAIL: {
      return {
        ...state,
        mailDetail: null
      };
    }

    case MailActionTypes.CLEAR_MAIL_DETAIL: {
      return {
        ...state,
        mailDetail: null,
        isPGPInProgress: false,
        decryptedContent: null,
      };
    }

    case MailActionTypes.UPLOAD_ATTACHMENT: {
      state.drafts[action.payload.draftId].attachments = [...state.drafts[action.payload.draftId].attachments, action.payload];
      return { ...state, drafts: { ...state.drafts }, };
    }

    case MailActionTypes.UPLOAD_ATTACHMENT_PROGRESS: {
      state.drafts[action.payload.draftId].attachments.forEach((attachment, index) => {
        if (attachment.attachmentId === action.payload.attachmentId) {
          state.drafts[action.payload.draftId].attachments[index].progress = action.payload.progress;
        }
      });
      return { ...state, drafts: { ...state.drafts }, };
    }

    case MailActionTypes.UPLOAD_ATTACHMENT_REQUEST: {
      state.drafts[action.payload.draftId].attachments.forEach((attachment, index) => {
        if (attachment.attachmentId === action.payload.attachmentId) {
          state.drafts[action.payload.draftId].attachments[index].request = action.payload.request;
        }
      });
      return { ...state, drafts: { ...state.drafts }, };
    }

    case MailActionTypes.UPLOAD_ATTACHMENT_SUCCESS: {
      const data = action.payload.data;
      state.drafts[data.draftId].attachments.forEach((attachment, index) => {
        if (attachment.attachmentId === data.attachmentId) {
          state.drafts[data.draftId].attachments[index].id = action.payload.response.id;
          state.drafts[data.draftId].attachments[index].inProgress = false;
          state.drafts[data.draftId].attachments[index].request = null;
        }
      });
      return { ...state, drafts: { ...state.drafts }, };
    }

    case MailActionTypes.DELETE_ATTACHMENT_SUCCESS: {
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
      return { ...state, drafts: { ...state.drafts }, };
    }

    case MailActionTypes.SET_CURRENT_FOLDER: {
      return { ...state, currentFolder: action.payload };
    }

    case MailActionTypes.NEW_DRAFT: {
      state.drafts[action.payload.id] = action.payload;
      return { ...state, drafts: { ...state.drafts }, };
    }

    case MailActionTypes.GET_USERS_KEYS: {
      state.drafts[action.payload.draftId].getUserKeyInProgress = true;
      return { ...state, drafts: { ...state.drafts }, };
    }

    case MailActionTypes.GET_USERS_KEYS_SUCCESS: {
      state.drafts[action.payload.draftId].getUserKeyInProgress = false;
      state.drafts[action.payload.draftId].usersKeys = action.payload.data;
      return { ...state, drafts: { ...state.drafts }, };
    }

    default: {
      return state;
    }
  }
}
