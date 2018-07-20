// Custom Action
import { MailActions, MailActionTypes } from '../actions';
// Model
import { MailState } from '../datatypes';

export const initialState: MailState = {
  mails: [],
  mailDetail: null,
  folders: new Map(),
  inProgress: false,
  loaded: false,
  draft: null,
  encryptedContent: null,
  decryptedContent: null,
  isPGPInProgress: false,
  attachments: []
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
      return { ...state, inProgress: true };
    }

    case MailActionTypes.SEND_MAIL_SUCCESS: {
      return {
        ...state,
        inProgress: false,
        mails: (action.payload.folder === state.currentFolder) ? [...state.mails, action.payload] : state.mails,
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
        if (mail.id === action.payload.id) {
          state.mails[index] = action.payload;
          newEntry = false;
        }
      });
      if (newEntry && state.currentFolder === action.payload.folder) {
        state.mails = [...state.mails, action.payload];
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
        decryptedContent: action.payload.decryptedContent
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
        encryptedContent: null,
        decryptedContent: null,
      };
    }

    case MailActionTypes.UPLOAD_ATTACHMENT: {
      state.attachments = [...state.attachments, action.payload];
      return {
        ...state,
      };
    }

    case MailActionTypes.UPLOAD_ATTACHMENT_PROGRESS: {
      state.attachments.forEach((item, index) => {
        if (item.attachmentId === action.payload.attachmentId) {
          state.attachments[index].progress = action.payload.progress;
        }
      });
      return {
        ...state
      };
    }

    case MailActionTypes.UPLOAD_ATTACHMENT_REQUEST: {
      state.attachments.forEach((item, index) => {
        if (item.attachmentId === action.payload.attachmentId) {
          state.attachments[index].request = action.payload.request;
        }
      });
      return { ...state };
    }

    case MailActionTypes.UPLOAD_ATTACHMENT_SUCCESS: {
      state.attachments.forEach((item, index) => {
        if (item.attachmentId === action.payload.data.attachmentId) {
          if (item.hash === action.payload.response.hash) {
            state.attachments[index].id = action.payload.response.id;
            state.attachments[index].inProgress = false;
            state.attachments[index].request = null;
          }
        }
      });
      return {
        ...state
      };
    }

    case MailActionTypes.DELETE_ATTACHMENT: {
      const index = state.attachments.findIndex(attachment => attachment.attachmentId === action.payload.attachmentId);
      if (index > -1 && !state.attachments[index].id) {
        state.attachments[index].request.unsubscribe();
        state.attachments.splice(index, 1);
      }
      return { ...state };
    }

    case MailActionTypes.DELETE_ATTACHMENT_SUCCESS: {
      const index = state.attachments.findIndex(attachment => attachment.id === action.payload.id);
      if (index > -1) {
        state.attachments.splice(index, 1);
      }
      return { ...state };
    }

    case MailActionTypes.SET_CURRENT_FOLDER: {
      return { ...state, currentFolder: action.payload };
    }

    default: {
      return state;
    }
  }
}
