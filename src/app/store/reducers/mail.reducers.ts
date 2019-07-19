// Custom Action
import { MailActions, MailActionTypes } from '../actions';
// Model
import { MailState } from '../datatypes';
import { EmailDisplay, Mail, MailFolderType } from '../models';

export function reducer(
  state: MailState = {
    mails: [],
    total_mail_count: 0,
    mailDetail: null,
    folders: new Map(),
    loaded: false,
    decryptedContents: {},
    unreadMailsCount: { inbox: 0 },
    noUnreadCountChange: true,
    canGetUnreadCount: true,
  }, action: MailActions): MailState {
  switch (action.type) {
    case MailActionTypes.GET_MAILS: {
      const mails = state.folders.get(action.payload.folder);
      return {
        ...state,
        loaded: (mails && !action.payload.forceReload) ? true : false,
        inProgress: action.payload.inProgress ? true : false,
        currentFolder: action.payload.folder as MailFolderType,
        mails: mails ? mails : [],
        noUnreadCountChange: true,
      };
    }

    case MailActionTypes.GET_MAILS_SUCCESS: {
      let mails = action.payload.mails;
      state.total_mail_count = action.payload.total_mail_count;
      if (action.payload.read === false || action.payload.read === true) {
        const mailIDs = mails.map(item => item.id);
        mails = state.mails.filter(item => mailIDs.indexOf(item.id) < 0);
        mails = [...mails, ...action.payload.mails];
      }
      mails = mails.map((mail: Mail) => {
        mail.receiver_list = mail.receiver_display.map((item: EmailDisplay) => item.name).join(', ');
        mail.thread_count = mail.children_count + ((action.payload.folder !== MailFolderType.TRASH
          || (action.payload.folder === MailFolderType.TRASH && mail.folder === MailFolderType.TRASH)) ? 1 : 0);
        return mail;
      });
      state.folders.set(action.payload.folder, mails);
      if (state.currentFolder !== action.payload.folder) {
        if (action.payload.folders && action.payload.folders.indexOf(state.currentFolder) > -1) {
          mails = state.mails.filter(item => item.id !== action.payload.mails[0].id);
          mails = [...mails, ...action.payload.mails];
          state.folders.set(state.currentFolder, mails);
        } else {
          mails = state.folders.get(state.currentFolder);
        }
      }
      return {
        ...state,
        mails: mails ? mails : [],
        loaded: true,
        inProgress: false,
        noUnreadCountChange: true,
      };
    }

    case MailActionTypes.STOP_GETTING_UNREAD_MAILS_COUNT: {
      return {
        ...state,
        canGetUnreadCount: false,
      };
    }

    case MailActionTypes.GET_UNREAD_MAILS_COUNT: {
      return { ...state, noUnreadCountChange: false };
    }
    case MailActionTypes.GET_UNREAD_MAILS_COUNT_SUCCESS: {
      if (action.payload.updateUnreadCount) {
        return {
          ...state,
          unreadMailsCount: {
            ...state.unreadMailsCount,
            ...action.payload,
          },
          noUnreadCountChange: false,
        };
      }
      return { ...state, unreadMailsCount: action.payload, noUnreadCountChange: false, };
    }

    case MailActionTypes.MOVE_MAIL: {
      return { ...state, inProgress: true, noUnreadCountChange: true };
    }

    case MailActionTypes.MOVE_MAIL_SUCCESS: {
      const listOfIDs = action.payload.ids.toString().split(',');
      state.mails = state.mails.filter(mail => !listOfIDs.includes(mail.id.toString()));
      if (action.payload.sourceFolder) {
        const oldMails = state.folders.get(action.payload.sourceFolder) || [];
        state.folders.set(action.payload.sourceFolder, oldMails.filter(mail => !listOfIDs.includes(mail.id.toString())));
      }
      if (state.mailDetail && state.mailDetail.children &&
        state.mailDetail.children.some(child => listOfIDs.includes(child.id.toString()))) {
        state.mailDetail.children.forEach((child, index) => {
          if (listOfIDs.includes(child.id.toString())) {
            state.mailDetail.children[index] = { ...state.mailDetail.children[index], folder: action.payload.folder };
          }
        });
      }
      return { ...state, inProgress: false, noUnreadCountChange: true };
    }

    case MailActionTypes.UNDO_DELETE_MAIL_SUCCESS: {
      let mails = state.mails;
      if (action.payload.sourceFolder === state.currentFolder) {
        if (Array.isArray(action.payload.mail)) {
          mails = [...state.mails, ...action.payload.mail];
        } else {
          mails = [...state.mails, action.payload.mail];
        }
        state.folders.set(action.payload.sourceFolder, [...mails]);
      }
      const listOfIDs = action.payload.ids.toString().split(',');
      if (state.mailDetail && state.mailDetail.children &&
        state.mailDetail.children.some(child => listOfIDs.includes(child.id.toString()))) {
        state.mailDetail.children.forEach((child, index) => {
          if (listOfIDs.includes(child.id.toString())) {
            state.mailDetail.children[index] = { ...state.mailDetail.children[index], folder: action.payload.sourceFolder };
          }
        });
      }
      return {
        ...state,
        mails: mails,
        noUnreadCountChange: true,
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
        state.mailDetail = { ...state.mailDetail, read: action.payload.read };
      }
      return { ...state, inProgress: false, noUnreadCountChange: true };
    }

    case MailActionTypes.STAR_MAIL_SUCCESS: {
      const listOfIDs = action.payload.ids.split(',');
      state.mails = state.mails.map(mail => {
        if (listOfIDs.includes(mail.id.toString())) {
          mail.starred = action.payload.starred;
        }
        return mail;
      });
      return { ...state, inProgress: false, noUnreadCountChange: true };
    }

    case MailActionTypes.DELETE_MAIL_SUCCESS: {
      if (action.payload.isMailDetailPage) {
        return state;
      }
      if ((state.currentFolder === MailFolderType.DRAFT && action.payload.isDraft) || !action.payload.isDraft) {
        const listOfIDs = action.payload.ids.split(',');
        state.mails = state.mails.filter(mail => !listOfIDs.includes(mail.id.toString()));
        if (state.mailDetail && state.mailDetail.children &&
          state.mailDetail.children.some(child => listOfIDs.includes(child.id.toString()))) {
          state.mailDetail.children = state.mailDetail.children.filter(child => !listOfIDs.includes(child.id.toString()));
        }
      }
      return { ...state, inProgress: false, noUnreadCountChange: true };
    }

    case MailActionTypes.GET_MAIL_DETAIL_SUCCESS: {
      return {
        ...state,
        mailDetail: action.payload,
        noUnreadCountChange: true,
      };
    }

    case MailActionTypes.GET_MAIL_DETAIL: {
      return {
        ...state,
        mailDetail: null,
        noUnreadCountChange: true,
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
        noUnreadCountChange: true,
      };
    }

    case MailActionTypes.UPDATE_MAIL_DETAIL_CHILDREN: {
      if (state.mailDetail) {
        if (action.payload.last_action_data.last_action) {
          if (state.mailDetail.id === action.payload.last_action_data.last_action_parent_id) {
            state.mailDetail.last_action = action.payload.last_action_data.last_action;
          } else {
            state.mailDetail.children = state.mailDetail.children.map(mail => {
              if (mail.id === action.payload.last_action_data.last_action_parent_id) {
                mail.last_action = action.payload.last_action_data.last_action;
              }
              return mail;
            });
          }
        }
        if (action.payload.parent === state.mailDetail.id) {
          state.mailDetail.children = state.mailDetail.children || [];
          state.mailDetail.children = state.mailDetail.children
            .filter(child => !(child.id === action.payload.id && child.folder === MailFolderType.DRAFT));
          state.mailDetail.children = [...state.mailDetail.children, action.payload];
        }
      }
      return { ...state, noUnreadCountChange: true };
    }

    case MailActionTypes.SET_CURRENT_FOLDER: {
      return { ...state, currentFolder: action.payload };
    }

    case MailActionTypes.UPDATE_PGP_DECRYPTED_CONTENT: {
      if (!state.decryptedContents[action.payload.id]) {
        state.decryptedContents[action.payload.id] = {
          id: action.payload.id,
          content: action.payload.decryptedContent,
          inProgress: action.payload.isPGPInProgress,
        };
      } else {
        state.decryptedContents[action.payload.id] = {
          ...state.decryptedContents[action.payload.id],
          content: action.payload.decryptedContent,
          inProgress: action.payload.isPGPInProgress,
          incomingHeaders: action.payload.incomingHeaders,
        };
      }
      return { ...state, decryptedContents: { ...state.decryptedContents }, noUnreadCountChange: true };
    }

    case MailActionTypes.UPDATE_CURRENT_FOLDER: {
      let newEntry: boolean = true;
      state.mails.map((mail, index) => {
        if (mail.id === action.payload.id || mail.id === action.payload.parent) {
          state.mails[index] = action.payload;
          newEntry = false;
        }
      });
      if (newEntry && state.currentFolder === action.payload.folder) {
        const mail = action.payload;
        mail.receiver_list = mail.receiver_display.map((item: EmailDisplay) => item.name).join(', ');
        mail.thread_count = mail.children_count + ((action.payload.folder !== MailFolderType.TRASH
          || (action.payload.folder === MailFolderType.TRASH && mail.folder === MailFolderType.TRASH)) ? 1 : 0);

        state.mails = [mail, ...state.mails];
      }
      return { ...state, mails: [...state.mails], noUnreadCountChange: true };
    }

    case MailActionTypes.EMPTY_TRASH: {
      return { ...state, inProgress: true, noUnreadCountChange: true };
    }

    case MailActionTypes.EMPTY_TRASH_SUCCESS: {
      state.folders.set(MailFolderType.TRASH, []);
      return { ...state, mails: [], inProgress: false };
    }

    case MailActionTypes.EMPTY_TRASH_FAILURE: {
      return { ...state, inProgress: false };
    }

    default: {
      return state;
    }
  }
}
