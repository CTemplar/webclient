// Custom Action
import { MailActions, MailActionTypes } from '../actions';
// Model
import { MailState } from '../datatypes';

export const initialState: MailState = {
  mails: [],
  mailDetail: null,
  folders: new Map(),
  loaded: false,
  drafts: []
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
      state.drafts.forEach((draft, index) => {
        if (draft.id === action.payload.id) {
          state.drafts[index] = {...state.drafts[index], inProgress: true};
        }
      });
      return { ...state};
    }

    case MailActionTypes.SEND_MAIL_SUCCESS: {
      state.drafts.forEach((draft, index) => {
        if (draft.id === action.payload.id) {
          state.drafts[index] = {...state.drafts[index], inProgress: false};
        }
      });
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
      state.drafts.forEach((draft, index) => {
        if (draft.id === action.payload.draftState.id) {
          state.drafts[index] = {...state.drafts[index], inProgress: false, draft: action.payload.response};
        }
      });

      return { ...state, inProgress: false };
    }

    case MailActionTypes.UPDATE_LOCAL_DRAFT: {
      state.drafts.forEach((draft, index) => {
        if (draft.id === action.payload.id) {
          state.drafts[index] = {...state.drafts[index], draft: action.payload.draft, isPGPInProgress: true};
        }
      });
      return { ...state };
    }

    case MailActionTypes.UPDATE_PGP_CONTENT: {
      if (action.payload.draftId) {
        state.drafts.forEach((draft, index) => {
          if (draft.id === action.payload.draftId) {
            state.drafts[index] = {
              ...state.drafts[index],
              isPGPInProgress: action.payload.isPGPInProgress,
              encryptedContent: action.payload.encryptedContent
            };
          }
        });
      }
      return {
        ...state,
        isPGPInProgress: action.payload.isPGPInProgress,
        decryptedContent: action.payload.decryptedContent
      };
    }

    case MailActionTypes.CLOSE_MAILBOX: {
      state.drafts.forEach((draft, index) => {
        if (draft.id === action.payload.id) {
          state.drafts[index] = {...state.drafts[index], draft: null, inProgress: false};
        }
      });
      return { ...state };
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
      state.drafts.forEach((draft, index) => {
        if (draft.id === action.payload.draftId) {
          state.drafts[index].attachments = [...state.drafts[index].attachments, action.payload];
        }
      });

      return {
        ...state,
      };
    }

    case MailActionTypes.UPLOAD_ATTACHMENT_PROGRESS: {
      state.drafts.forEach((draft, index) => {
        if (draft.id === action.payload.draftId) {
          state.drafts[index].attachments.forEach((attachment, attachmentIndex) => {
            if (attachment.attachmentId === action.payload.attachmentId) {
              state.drafts[index].attachments[attachmentIndex].progress = action.payload.progress;
            }
          });
        }
      });
      return {
        ...state
      };
    }

    case MailActionTypes.UPLOAD_ATTACHMENT_REQUEST: {
      state.drafts.forEach((draft, index) => {
        if (draft.id === action.payload.draftId) {
          state.drafts[index].attachments.forEach((attachment, attachmentIndex) => {
            if (attachment.attachmentId === action.payload.attachmentId) {
              state.drafts[index].attachments[attachmentIndex].request = action.payload.request;
            }
          });
        }
      });
      return { ...state };
    }

    case MailActionTypes.UPLOAD_ATTACHMENT_SUCCESS: {
      state.drafts.forEach((draft, index) => {
        if (draft.id === action.payload.draftId) {
          state.drafts[index].attachments.forEach((attachment, attachmentIndex) => {
            if (attachment.attachmentId === action.payload.data.attachmentId) {
              if (attachment.hash === action.payload.response.hash) {
                state.drafts[index].attachments[attachmentIndex].id = action.payload.response.id;
                state.drafts[index].attachments[attachmentIndex].inProgress = false;
                state.drafts[index].attachments[attachmentIndex].request = null;
              }
            }
          });
        }
      });
      return {...state};
    }

    case MailActionTypes.DELETE_ATTACHMENT: {
      state.drafts.forEach((draft, index) => {
        if (draft.id === action.payload.draftId) {
          state.drafts[index].attachments = state.drafts[index].attachments.filter(attachment => {
            if (attachment.attachmentId === action.payload.attachmentId) {
              if (!attachment.id) {
                attachment.request.unsubscribe();
                return false;
              } else {
                return true;
              }
            }
          });
        }
      });
      return { ...state };
    }

    case MailActionTypes.DELETE_ATTACHMENT_SUCCESS: {
      state.drafts.forEach((draft, index) => {
        if (draft.id === action.payload.draftId) {
          state.drafts[index].attachments = state.drafts[index].attachments.filter(attachment => {
            return attachment.id !== action.payload.id;
          });
        }
      });
      return { ...state };
    }

    case MailActionTypes.SET_CURRENT_FOLDER: {
      return { ...state, currentFolder: action.payload };
    }

    case MailActionTypes.NEW_DRAFT: {
      state.drafts = [...state.drafts, action.payload];
      return {...state};
    }

    default: {
      return state;
    }
  }
}
