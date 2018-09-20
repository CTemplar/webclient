// Custom Action
import { MailActions, MailActionTypes } from '../actions';
// Model
import { MailState } from '../datatypes';

export function reducer(
  state: MailState = {
    mails: [],
    mailDetail: null,
    folders: new Map(),
    loaded: false,
    decryptedContents: {}
  }, action: MailActions): MailState {
  switch (action.type) {
    case MailActionTypes.GET_MAILS: {
      const mails = state.folders.get(action.payload.folder);
      return {
        ...state,
        loaded: (mails && !action.payload.forceReload) ? true : false,
        mails: mails ? mails : [],
      };
    }

    case MailActionTypes.GET_MAILS_SUCCESS: {
      let mails = action.payload.mails;
      if (action.payload.read === false || action.payload.read === true) {
        const mailIDs = mails.map(item => item.id);
        mails = state.mails.filter(item => mailIDs.indexOf(item.id) < 0);
        mails = [...mails, ...action.payload.mails];
      }
      state.folders.set(action.payload.folder, mails);
      return {
        ...state,
        mails,
        loaded: true,
      };
    }

    case MailActionTypes.MOVE_MAIL: {
      return { ...state, inProgress: true };
    }

    case MailActionTypes.MOVE_MAIL_SUCCESS: {
      const listOfIDs = action.payload.ids.toString().split(',');
      state.mails = state.mails.filter(mail => !listOfIDs.includes(mail.id.toString()));
      if (action.payload.sourceFolder) {
        const oldMails = state.folders.get(action.payload.sourceFolder);
        state.folders.set(action.payload.sourceFolder, oldMails.filter(mail => !listOfIDs.includes(mail.id.toString())));
      }
      return { ...state, inProgress: false };
    }

    case MailActionTypes.UNDO_DELETE_MAIL_SUCCESS: {
      let mails = state.mails;
      if (action.payload.sourceFolder === state.currentFolder) {
        if (Array.isArray(action.payload.mail)) {
          mails = [...state.mails, ...action.payload.mail];
        }
        else {
          mails = [...state.mails, action.payload.mail];
        }
        state.folders.set(action.payload.sourceFolder, [...mails]);
      }
      return {
        ...state,
        mails: mails,
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
      if (state.mailDetail && listOfIDs.includes(state.mailDetail.id.toString())) {
        state.mailDetail = {...state.mailDetail, read: action.payload.read};
      }
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
      delete state.decryptedContents[action.payload.id];
      if (action.payload.children && action.payload.children.length > 0) {
        action.payload.children.forEach(child => {
          delete state.decryptedContents[child.id];
        });
      }
      return {
        ...state,
        mailDetail: null,
        decryptedContents: { ...state.decryptedContents },
      };
    }

    case MailActionTypes.SET_CURRENT_FOLDER: {
      return { ...state, currentFolder: action.payload };
    }

    case MailActionTypes.UPDATE_PGP_DECRYPTED_CONTENT: {
      if (!state.decryptedContents[action.payload.id]) {
        state.decryptedContents[action.payload.id] = {
          id: action.payload.id,
          content: action.payload.decryptedContent,
          inProgress: action.payload.isPGPInProgress
        };
      } else {
        state.decryptedContents[action.payload.id] = {
          ...state.decryptedContents[action.payload.id],
          content: action.payload.decryptedContent,
          inProgress: action.payload.isPGPInProgress
        };
      }
      return { ...state, decryptedContents: { ...state.decryptedContents } };
    }

    case MailActionTypes.UPDATE_CURRENT_FOLDER: {
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
      return { ...state, mails: [...state.mails] };
    }

    default: {
      return state;
    }
  }
}
