import { MailActions, MailActionTypes } from '../actions';
import { MailState, FolderState } from '../datatypes';
import { Attachment, EmailDisplay, Mail, MailFolderType } from '../models';
import { FilenamePipe } from '../../shared/pipes/filename.pipe';

export function reducer(
  state: MailState = {
    mails: [],
    total_mail_count: 0,
    mailDetail: null,
    starredFolderCount: 0,
    loaded: false,
    decryptedContents: {},
    unreadMailsCount: { inbox: 0 },
    noUnreadCountChange: true,
    canGetUnreadCount: true,
    decryptedSubjects: {},
    isMailsMoved: false,
    customFolderMessageCount: [],
    isComposerPopUp: false,
    mailMap: {},
    folderMap: new Map(),
    pageLimit: 20,
  },
  action: MailActions,
): MailState {
  switch (action.type) {
    case MailActionTypes.GET_MAILS: {
      let mails = prepareMails(action.payload.folder, state.folderMap, state.mailMap);
      if (mails && mails.length === 0) {
        mails = null;
      }
      return {
        ...state,
        loaded: !!(mails && !action.payload.forceReload),
        inProgress: !!action.payload.inProgress,
        currentFolder: action.payload.folder as MailFolderType,
        mails: mails || [],
        noUnreadCountChange: true,
      };
    }

    case MailActionTypes.GET_MAILS_SUCCESS: {
      const payloadMails = action.payload.mails;
      const mailMap = updateMailMap(state.mailMap, payloadMails);
      let folderMap = new Map(state.folderMap);
      // Update Folder Map for ###TARGET FOLDER###
      if (!action.payload.is_from_socket || (action.payload.is_from_socket && folderMap.has(action.payload.folder))) {
        const oldFolderInfo = folderMap.get(action.payload.folder);
        const mailIDS = action.payload.is_from_socket
          ? oldFolderInfo && !oldFolderInfo.is_not_first_page
            ? filterAndMergeMailIDs(payloadMails, oldFolderInfo.mails, action.payload.limit)
            : oldFolderInfo.mails
          : payloadMails.map((mail: any) => mail.id);
        const folderState = {
          mails: mailIDS,
          total_mail_count: action.payload.total_mail_count,
          is_not_first_page: action.payload.is_from_socket
            ? oldFolderInfo && oldFolderInfo.is_not_first_page
            : action.payload.is_not_first_page,
          offset: action.payload.offset,
          is_dirty: false,
        };
        folderMap.set(`${action.payload.folder}`, folderState);
      }

      // Update Folder Map for ###UNREAD FOLDER###
      if (
        action.payload.is_from_socket &&
        action.payload.folder !== MailFolderType.UNREAD &&
        action.payload.folder !== MailFolderType.SPAM &&
        folderMap.has(MailFolderType.UNREAD)
      ) {
        const oldFolderInfo = folderMap.get(MailFolderType.UNREAD);
        const basicFolderState = getUpdatesFolderMap(payloadMails, oldFolderInfo, action.payload.limit, true);
        const folderState = {
          ...oldFolderInfo,
          mails: basicFolderState.mails,
          total_mail_count: basicFolderState.total_mail_count,
        };
        folderMap.set(MailFolderType.UNREAD, folderState);
      }
      // Update Folder Map for ###ALL EMAILS FOLDER###
      if (
        action.payload.is_from_socket &&
        action.payload.folder !== MailFolderType.ALL_EMAILS &&
        action.payload.folder !== MailFolderType.SPAM &&
        folderMap.has(MailFolderType.ALL_EMAILS)
      ) {
        const oldFolderInfo = folderMap.get(MailFolderType.ALL_EMAILS);
        const basicFolderState = getUpdatesFolderMap(payloadMails, oldFolderInfo, action.payload.limit);
        const folderState = {
          ...oldFolderInfo,
          mails: basicFolderState.mails,
          total_mail_count: basicFolderState.total_mail_count,
        };
        folderMap.set(MailFolderType.ALL_EMAILS, folderState);
      }
      // Update Current Viewing Folder
      let mails = prepareMails(state.currentFolder, folderMap, mailMap);
      const curFolderMap = folderMap.get(state.currentFolder);
      state.total_mail_count = curFolderMap.total_mail_count;
      mails.forEach((mail: Mail) => {
        mail.receiver_list = mail.receiver_display.map((item: EmailDisplay) => item.name).join(', ');
        if (mail.is_subject_encrypted && state.decryptedSubjects[mail.id]) {
          mail.subject = state.decryptedSubjects[mail.id];
          mail.is_subject_encrypted = false;
        }
      });
      state.pageLimit = action.payload.limit;
      return {
        ...state,
        mails,
        loaded: true,
        inProgress: false,
        noUnreadCountChange: true,
        mailMap,
        folderMap,
      };
    }

    case MailActionTypes.STOP_GETTING_UNREAD_MAILS_COUNT: {
      return {
        ...state,
        canGetUnreadCount: false,
      };
    }

    case MailActionTypes.STARRED_FOLDER_COUNT_UPDATE: {
      return { ...state, starredFolderCount: action.payload.starred_count };
    }

    case MailActionTypes.GET_UNREAD_MAILS_COUNT: {
      return { ...state, noUnreadCountChange: false };
    }
    case MailActionTypes.GET_UNREAD_MAILS_COUNT_SUCCESS: {
      if (action.payload.updateUnreadCount) {
        const totalUnreadMailCount = getTotalUnreadCount({ ...state.unreadMailsCount, ...action.payload });
        const unreadMailData = {
          ...state.unreadMailsCount,
          ...action.payload,
          total_unread_count: totalUnreadMailCount,
        };
        return {
          ...state,
          unreadMailsCount: unreadMailData,
          noUnreadCountChange: false,
        };
      }
      return {
        ...state,
        unreadMailsCount: { ...action.payload, total_unread_count: getTotalUnreadCount(action.payload) },
        noUnreadCountChange: false,
      };
    }
    case MailActionTypes.GET_CUSTOMFOLDER_MESSAGE_COUNT_SUCCESS: {
      return { ...state, customFolderMessageCount: action.payload };
    }
    case MailActionTypes.SET_IS_COMPOSER_POPUP: {
      state.isComposerPopUp = action.payload;
      return {
        ...state,
      };
    }
    case MailActionTypes.MOVE_MAIL: {
      return { ...state, inProgress: true, noUnreadCountChange: true, isMailsMoved: false };
    }

    case MailActionTypes.REVERT_MAILS_MOVED: {
      return { ...state, isMailsMoved: false };
    }

    case MailActionTypes.MOVE_MAIL_SUCCESS: {
      const listOfIDs = action.payload.ids.toString().split(',');
      let folderMap = state.folderMap;
      let mailMap = state.mailMap;

      // Update source folder's mails
      const sourceFolderName = action.payload.sourceFolder;
      if (sourceFolderName && folderMap.has(sourceFolderName)) {
        let sourceFolderState = folderMap.get(sourceFolderName);
        sourceFolderState.mails = sourceFolderState.mails.filter(mail => !listOfIDs.includes(mail.toString()));
        sourceFolderState.total_mail_count =
          sourceFolderState.total_mail_count >= listOfIDs.length
            ? sourceFolderState.total_mail_count - listOfIDs.length
            : 0;
        folderMap.set(sourceFolderName, sourceFolderState);
      }
      // Update target folder's mails
      const targetFolderName = action.payload.folder;
      if (targetFolderName && folderMap.has(targetFolderName)) {
        const targetFolderState = folderMap.get(targetFolderName);
        const movedMails = listOfIDs
          .map((movedID: any) => (mailMap[movedID] ? mailMap[movedID] : null))
          .filter((mail: any) => !!mail);
        const basicFolderState = getUpdatesFolderMap(movedMails, targetFolderState, state.pageLimit);
        const folderState = {
          ...targetFolderState,
          mails: sortByDueDateWithID(basicFolderState.mails, state.mailMap),
          total_mail_count: basicFolderState.total_mail_count,
        };
        folderMap.set(targetFolderName, folderState);
      }
      // Update other folders
      const folder_keys = [...folderMap.keys()].filter(
        key => key !== sourceFolderName && key !== targetFolderName && key !== state.currentFolder,
      );
      folder_keys.forEach(key => {
        let folderInfo = folderMap.get(key);
        folderInfo.is_dirty = true;
        folderInfo.mails = [];
        folderMap.set(key, folderInfo);
      });
      // Update mail map
      const mailMapKeys = Object.keys(mailMap);
      mailMapKeys.forEach(key => {
        if (listOfIDs.includes(mailMap[key].id.toString())) {
          mailMap[key] = { ...mailMap[key], folder: action.payload.folder };
          if (
            action.payload.folder === MailFolderType.TRASH &&
            mailMap[key].has_children &&
            mailMap[key].children_count > 0 &&
            action.payload.withChildren !== false
          ) {
            // If moving parent to trash, children would be moved to trash as well
            mailMap[key].children_folder_info = {
              trash_children_count: mailMap[key].children_count,
              non_trash_children_count: 0,
            };
          } else if (
            action.payload.sourceFolder === MailFolderType.TRASH &&
            mailMap[key].has_children &&
            mailMap[key].children_count > 0
          ) {
            // If moving parent from trash, children would be moved as well
            mailMap[key].children_folder_info = {
              trash_children_count: 0,
              non_trash_children_count: mailMap[key].children_count,
            };
          }
        }
      });
      // This is to move to trash only child from any folder
      // should update children_folder_info as well
      const incomeMails = Array.isArray(action.payload.mail) ? action.payload.mail : [action.payload.mail];
      incomeMails.forEach((mail: any) => {
        if (action.payload.folder === MailFolderType.TRASH && mail.parent) {
          const parentID = mail.parent;
          if (mailMap[parentID] && mailMap[parentID].children_folder_info) {
            mailMap[parentID].children_folder_info = {
              trash_children_count: mailMap[parentID].children_folder_info.trash_children_count + 1,
              non_trash_children_count:
                mailMap[parentID].children_folder_info.non_trash_children_count > 0
                  ? mailMap[parentID].children_folder_info.non_trash_children_count - 1
                  : 0,
            };
          }
        }
      });
      const mails = prepareMails(state.currentFolder, folderMap, mailMap);
      const curMailFolder = folderMap.get(state.currentFolder);
      state.total_mail_count = curMailFolder ? curMailFolder.total_mail_count : 0;
      if (
        state.mailDetail &&
        state.mailDetail.children &&
        state.mailDetail.children.some(child => listOfIDs.includes(child.id.toString()))
      ) {
        state.mailDetail.children.forEach((child, index) => {
          if (listOfIDs.includes(child.id.toString())) {
            state.mailDetail.children[index] = { ...state.mailDetail.children[index], folder: action.payload.folder };
            state.mailDetail.children_count = state.mailDetail.children.length;
          }
        });
        const sourceFolderChildren = state.mailDetail.children.filter(child => child.folder === sourceFolderName);
        if (sourceFolderName && folderMap.has(sourceFolderName)) {
          let sourceFolderState = folderMap.get(sourceFolderName);
          sourceFolderState.mails = sourceFolderState.mails.filter(mailID => {
            if (mailID === state.mailDetail.id && sourceFolderChildren.length === 0) {
              return false;
            }
            return true;
          });
          folderMap.set(sourceFolderName, sourceFolderState);
        }
      }
      if (state.mailDetail && listOfIDs.includes(state.mailDetail.id.toString())) {
        state.mailDetail = { ...state.mailDetail, folder: action.payload.folder };
      }

      return {
        ...state,
        mails,
        mailMap,
        folderMap,
        inProgress: false,
        noUnreadCountChange: true,
        isMailsMoved: true,
      };
    }

    case MailActionTypes.UNDO_DELETE_MAIL_SUCCESS: {
      let { mails } = state;
      let mailMap = state.mailMap;
      const undo_mails = Array.isArray(action.payload.mail) ? action.payload.mail : [action.payload.mail];
      let folderMap = state.folderMap;
      // Destination folder map
      if (state.folderMap.has(action.payload.sourceFolder)) {
        const oldFolderMap = folderMap.get(action.payload.sourceFolder);
        let basicFolderState = getUpdatesFolderMap(undo_mails, oldFolderMap, state.pageLimit);
        basicFolderState.mails = sortByDueDateWithID(basicFolderState.mails, mailMap);
        folderMap.set(action.payload.sourceFolder, basicFolderState);
      }
      // Source folder map
      if (state.folderMap.has(action.payload.folder)) {
        const oldFolderMap = folderMap.get(action.payload.folder);
        oldFolderMap.mails = [];
        oldFolderMap.is_dirty = true;
        folderMap.set(action.payload.folder, oldFolderMap);
      }
      // Update mail children info
      undo_mails.forEach((mail: any) => {
        if (action.payload.sourceFolder === MailFolderType.TRASH && mail.has_children && mail.children_count > 0) {
          // Action from the other to Trash folder (undo from trash to the other folder)
          // All children would be set with Trash again
          // TODO, needs to get which chilren are needed to undo exactly
          if (mailMap[mail.id]) {
            mailMap[mail.id].children_folder_info = {
              trash_children_count: mailMap[mail.id].children_count,
              non_trash_children_count: 0,
            };
          }
        }
      });
      // Update current folder map
      if (action.payload.sourceFolder === state.currentFolder) {
        mails = prepareMails(action.payload.sourceFolder, folderMap, state.mailMap);
        const curMailFolder = folderMap.get(state.currentFolder);
        state.total_mail_count = curMailFolder.total_mail_count;
      }
      const listOfIDs = action.payload.ids.toString().split(',');
      if (
        state.mailDetail &&
        state.mailDetail.children &&
        state.mailDetail.children.some(child => listOfIDs.includes(child.id.toString()))
      ) {
        state.mailDetail.children.forEach((child, index) => {
          if (listOfIDs.includes(child.id.toString())) {
            state.mailDetail.children[index] = {
              ...state.mailDetail.children[index],
              folder: action.payload.sourceFolder,
            };
          }
        });
      }
      if (state.mailDetail && listOfIDs.includes(state.mailDetail.id.toString())) {
        state.mailDetail = { ...state.mailDetail, folder: action.payload.sourceFolder };
      }
      return {
        ...state,
        mails,
        folderMap,
        noUnreadCountChange: true,
      };
    }

    case MailActionTypes.READ_MAIL_SUCCESS: {
      const listOfIDs = action.payload.ids.split(',');
      let folderMap = state.folderMap;
      let mailMap = state.mailMap;
      const allIDS = Object.keys(mailMap);
      allIDS.forEach(mailID => {
        if (listOfIDs.includes(mailID.toString())) {
          mailMap[mailID] = { ...mailMap[mailID], read: action.payload.read };
        }
      });

      // Update Unread folder
      if (state.currentFolder !== MailFolderType.UNREAD) {
        if (folderMap.has(MailFolderType.UNREAD)) {
          // TODO should update manually
          let unreadFolderMap = folderMap.get(MailFolderType.UNREAD);
          unreadFolderMap.is_dirty = true;
          folderMap.set(MailFolderType.UNREAD, unreadFolderMap);
        }
      } else {
        let currentFolderInfo = folderMap.get(MailFolderType.UNREAD);
        let updatedMailCount = 0;
        const updatedCurrentFolderMails = currentFolderInfo.mails.filter(mailID => {
          if (listOfIDs.includes(mailID.toString()) && action.payload.read) {
            updatedMailCount++;
            return false;
          } else {
            return true;
          }
        });
        currentFolderInfo.mails = updatedCurrentFolderMails;
        if (action.payload.read) {
          currentFolderInfo.total_mail_count =
            currentFolderInfo.total_mail_count >= updatedMailCount
              ? currentFolderInfo.total_mail_count - updatedMailCount
              : 0;
        }
        folderMap.set(MailFolderType.UNREAD, currentFolderInfo);
      }
      const mails = prepareMails(state.currentFolder, folderMap, mailMap);
      const curMailFolder = folderMap.get(state.currentFolder);
      state.total_mail_count = curMailFolder.total_mail_count;

      if (state.mailDetail && listOfIDs.includes(state.mailDetail.id.toString())) {
        state.mailDetail = { ...state.mailDetail, read: action.payload.read };
      }

      return {
        ...state,
        mails,
        mailMap,
        folderMap,
        inProgress: false,
        noUnreadCountChange: true,
      };
    }

    case MailActionTypes.STAR_MAIL_SUCCESS: {
      const listOfIDs = action.payload.ids.split(',');
      let folderMap = state.folderMap;
      let mailMap = state.mailMap;
      const allIDS = Object.keys(mailMap);
      allIDS.forEach(mailID => {
        if (listOfIDs.includes(mailID.toString())) {
          const has_starred_children = !action.payload.starred && action.payload.withChildren ? false : true;
          mailMap[mailID] = { ...mailMap[mailID], starred: action.payload.starred, has_starred_children };
        }
      });

      // Update Star folder
      if (state.currentFolder !== MailFolderType.STARRED) {
        if (folderMap.has(MailFolderType.STARRED)) {
          // TODO should update manually
          let starredFolderMap = folderMap.get(MailFolderType.STARRED);
          starredFolderMap.is_dirty = true;
          folderMap.set(MailFolderType.STARRED, starredFolderMap);
        }
      } else {
        let currentFolderInfo = folderMap.get(MailFolderType.STARRED);
        let updatedMailCount = 0;
        const updatedCurrentFolderMails = currentFolderInfo.mails.filter(mailID => {
          if (listOfIDs.includes(mailID.toString()) && !action.payload.starred) {
            updatedMailCount++;
            return false;
          } else if (state.mailDetail && mailID === state.mailDetail.id) {
            const children = state.mailDetail.children;
            if (children && children.length > 0) {
              children.forEach((child, index) => {
                if (listOfIDs.includes(child.id.toString())) {
                  children[index] = { ...child, starred: action.payload.starred };
                }
              });
              return children.some(child => child.starred);
            }
          }
          return true;
        });
        if (!action.payload.starred) {
          currentFolderInfo.total_mail_count =
            currentFolderInfo.total_mail_count >= updatedMailCount
              ? currentFolderInfo.total_mail_count - updatedMailCount
              : 0;
        }
        currentFolderInfo.mails = updatedCurrentFolderMails;
        folderMap.set(MailFolderType.STARRED, currentFolderInfo);
      }

      if (state.mailDetail) {
        let children = state.mailDetail.children;
        if (listOfIDs.includes(state.mailDetail.id.toString())) {
          if (action.payload.withChildren && children && children.length > 0) {
            children.forEach((child, index) => (children[index].starred = action.payload.starred));
          }
          const has_starred_children =
            children && children.length > 0
              ? children.some(child => child.starred) || action.payload.starred
              : action.payload.starred;
          state.mailDetail = { ...state.mailDetail, starred: action.payload.starred, children, has_starred_children };
        } else {
          if (children && children.length > 0) {
            children.forEach((child, index) => {
              if (listOfIDs.includes(child.id.toString())) {
                children[index] = { ...child, starred: action.payload.starred };
              }
            });
            const has_starred_children = children.some(child => child.starred) || state.mailDetail.starred;
            state.mailDetail = { ...state.mailDetail, children, has_starred_children };
            if (state.mailDetail.id in mailMap) {
              mailMap[state.mailDetail.id] = { ...mailMap[state.mailDetail.id], has_starred_children };
            }
          }
        }
      }

      const mails = prepareMails(state.currentFolder, folderMap, mailMap);
      const curMailFolder = folderMap.get(state.currentFolder);
      state.total_mail_count = curMailFolder.total_mail_count;

      return {
        ...state,
        mails,
        mailMap,
        folderMap,
        inProgress: false,
        noUnreadCountChange: true,
      };
    }

    case MailActionTypes.DELETE_MAIL_FOR_ALL_SUCCESS:
    case MailActionTypes.DELETE_MAIL_SUCCESS: {
      const listOfIDs = action.payload.ids.split(',');
      let folderMap = new Map(state.folderMap);
      let mailMap = { ...state.mailMap };
      const folder_keys = [MailFolderType.DRAFT, MailFolderType.TRASH, MailFolderType.SPAM];
      folder_keys.forEach(key => {
        if (folderMap.has(key)) {
          let folderInfo = folderMap.get(key);
          folderInfo.mails = folderInfo.mails.filter(mailID => !listOfIDs.includes(mailID.toString()));
          folderInfo.total_mail_count = folderInfo.total_mail_count > 0 ? folderInfo.total_mail_count - 1 : 0;
          folderInfo.is_dirty = true;
          folderMap.set(key, folderInfo);
        }
      });
      if (action.payload.isMailDetailPage) {
        return {
          ...state,
          folderMap,
        };
      }
      const mails = prepareMails(state.currentFolder, folderMap, mailMap);
      const curMailFolder = folderMap.get(state.currentFolder);
      state.total_mail_count = curMailFolder.total_mail_count;

      if (
        state.mailDetail &&
        state.mailDetail.children &&
        state.mailDetail.children.some(child => listOfIDs.includes(child.id.toString()))
      ) {
        state.mailDetail.children = state.mailDetail.children.filter(child => !listOfIDs.includes(child.id.toString()));
        state.mailDetail.children_count = state.mailDetail.children.length;
      }

      return {
        ...state,
        mails,
        folderMap,
        mailMap,
        inProgress: false,
        noUnreadCountChange: true,
      };
    }

    case MailActionTypes.GET_MAIL_DETAIL_SUCCESS: {
      const mail: Mail = action.payload;
      if (mail) {
        if (mail.is_subject_encrypted && state.decryptedSubjects[mail.id]) {
          mail.is_subject_encrypted = false;
          mail.subject = state.decryptedSubjects[mail.id];
        }
        mail.attachments = transformFilename(mail.attachments);
        if (mail.children && mail.children.length > 0) {
          mail.children.forEach(item => {
            item.attachments = transformFilename(item.attachments);
          });
        }
      }
      return {
        ...state,
        mailDetail: action.payload,
        mailDetailLoaded: true,
        noUnreadCountChange: true,
      };
    }

    case MailActionTypes.GET_MAIL_DETAIL_FAILURE: {
      return {
        ...state,
        mailDetailLoaded: true,
      };
    }

    case MailActionTypes.GET_MAIL_DETAIL: {
      return {
        ...state,
        mailDetail: null,
        noUnreadCountChange: true,
      };
    }

    case MailActionTypes.CLEAR_MAILS_ON_CONVERSATION_MODE_CHANGE: {
      return {
        ...state,
        mails: [],
        total_mail_count: 0,
        mailDetail: null,
        loaded: false,
        unreadMailsCount: { inbox: 0 },
        noUnreadCountChange: true,
        canGetUnreadCount: true,
        mailMap: {},
        folderMap: new Map(),
      };
    }

    case MailActionTypes.CLEAR_MAILS_ON_LOGOUT: {
      return {
        mails: [],
        total_mail_count: 0,
        mailDetail: null,
        loaded: false,
        starredFolderCount: 0,
        decryptedContents: {},
        unreadMailsCount: { inbox: 0 },
        noUnreadCountChange: true,
        canGetUnreadCount: true,
        decryptedSubjects: {},
        customFolderMessageCount: [],
        mailMap: {},
        folderMap: new Map(),
      };
    }

    case MailActionTypes.CLEAR_MAIL_DETAIL: {
      return {
        ...state,
        mailDetail: null,
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
          state.mailDetail.children = state.mailDetail.children.filter(child => !(child.id === action.payload.id));
          state.mailDetail.children = [...state.mailDetail.children, action.payload];
          state.mailDetail.children_count = state.mailDetail.children.length;
        }
      }
      return { ...state, noUnreadCountChange: true };
    }

    case MailActionTypes.SET_CURRENT_FOLDER: {
      const folderMap = state.folderMap;
      let mailMap = state.mailMap;
      const mails = prepareMails(action.payload, folderMap, state.mailMap);
      const total_mail_count = folderMap.has(action.payload) ? folderMap.get(action.payload).total_mail_count : 0;
      Object.keys(mailMap).forEach(key => {
        let mail = mailMap[key];
        mail.marked = false;
        mailMap[key] = { ...mail };
      });
      mails.forEach(mail => {
        if (state.decryptedSubjects[mail.id]) {
          mail.subject = state.decryptedSubjects[mail.id];
          mail.is_subject_encrypted = false;
        }
      });
      return {
        ...state,
        mails,
        mailMap,
        total_mail_count,
        currentFolder: action.payload,
      };
    }

    case MailActionTypes.UPDATE_PGP_DECRYPTED_CONTENT: {
      if (action.payload.isDecryptingAllSubjects) {
        if (!action.payload.isPGPInProgress) {
          state.mails = state.mails.map(mail => {
            if (mail.id === action.payload.id) {
              mail.subject = action.payload.decryptedContent.subject;
              mail.is_subject_encrypted = false;
            }
            return mail;
          });
          state.decryptedSubjects[action.payload.id] = action.payload.decryptedContent.subject;
        }
        return { ...state };
      }
      if (!state.decryptedContents[action.payload.id]) {
        state.decryptedContents[action.payload.id] = {
          id: action.payload.id,
          content: action.payload.decryptedContent.content,
          content_plain: action.payload.decryptedContent.content_plain,
          subject: action.payload.decryptedContent.subject,
          incomingHeaders: action.payload.decryptedContent.incomingHeaders,
          inProgress: action.payload.isPGPInProgress,
        };
      } else {
        state.decryptedContents[action.payload.id] = {
          ...state.decryptedContents[action.payload.id],
          content: action.payload.decryptedContent.content,
          content_plain: action.payload.decryptedContent.content_plain,
          subject: action.payload.decryptedContent.subject,
          inProgress: action.payload.isPGPInProgress,
          incomingHeaders: action.payload.decryptedContent.incomingHeaders,
        };
      }
      return { ...state, decryptedContents: { ...state.decryptedContents }, noUnreadCountChange: true };
    }

    case MailActionTypes.UPDATE_CURRENT_FOLDER: {
      let mailMap = { ...state.mailMap };
      let folderMap = new Map(state.folderMap);
      let newMail = { ...action.payload };
      // Update mail map
      mailMap = updateMailMap(mailMap, [newMail]);
      if (newMail.parent) {
        const mailIDs = Object.keys(mailMap);
        mailIDs.forEach(mailID => {
          if (mailMap[mailID].id === newMail.parent) {
            mailMap[mailID].has_children = true;
            mailMap[mailID].children_count = mailMap[mailID].children_count + 1;
            if (mailMap[mailID].children_folder_info) {
              mailMap[mailID].children_folder_info = {
                ...mailMap[mailID].children_folder_info,
                non_trash_children_count: mailMap[mailID].children_folder_info.non_trash_children_count + 1,
              };
            } else {
              mailMap[mailID].children_folder_info = {
                trash_children_count: 0,
                non_trash_children_count: 1,
              };
            }
          }
        });
      }
      // update target folder map
      if (folderMap.has(newMail.folder)) {
        let targetFolderMap = folderMap.get(newMail.folder);
        let basicFolderState = getUpdatesFolderMap([newMail], targetFolderMap, state.pageLimit);
        folderMap.set(newMail.folder, basicFolderState);
      }
      const mails = prepareMails(state.currentFolder, folderMap, mailMap);
      if (state.currentFolder) {
        const curMailFolder = folderMap.get(state.currentFolder);
        state.total_mail_count = curMailFolder.total_mail_count;
      }
      return {
        ...state,
        mails,
        mailMap,
        folderMap,
        noUnreadCountChange: true,
      };
    }

    case MailActionTypes.EMPTY_FOLDER: {
      return { ...state, inProgress: true, noUnreadCountChange: true };
    }

    case MailActionTypes.EMPTY_FOLDER_SUCCESS: {
      if (state.folderMap.has(action.payload.folder)) {
        state.folderMap.delete(action.payload.folder);
      }
      return { ...state, mails: [], inProgress: false };
    }

    case MailActionTypes.EMPTY_FOLDER_FAILURE: {
      return { ...state, inProgress: false };
    }

    case MailActionTypes.MOVE_TAB: {
      return { ...state, currentSettingsTab: action.payload };
    }

    case MailActionTypes.EMPTY_ONLY_FOLDER: {
      if (state.folderMap.has(action.payload.folder)) {
        state.folderMap.delete(action.payload.folder);
      }
      return { ...state, inProgress: false };
    }

    default: {
      return state;
    }
  }
}

function transformFilename(attachments: Attachment[]) {
  if (attachments && attachments.length > 0) {
    attachments = attachments.map(attachment => {
      if (!attachment.name) {
        attachment.name = FilenamePipe.tranformToFilename(attachment.document);
      }
      return attachment;
    });
  }
  return attachments;
}

function sortByDueDateWithID(sortArray: Array<number>, mailMap: any): any[] {
  const mails = sortArray
    .map(mailID => {
      if (mailMap.hasOwnProperty(mailID)) {
        return mailMap[mailID];
      } else {
        return null;
      }
    })
    .filter(mail => !!mail);
  const sorted = mails
    .sort((previous: any, next: any) => {
      const next_updated = next.updated || 0;
      const previous_updated = previous.updated || 0;
      return <any>new Date(next_updated) - <any>new Date(previous_updated);
    })
    .map(mail => mail.id);
  return sorted;
}

function getTotalUnreadCount(data: any): number {
  if (data) {
    let total_count = 0;
    Object.keys(data).forEach(key => {
      if (
        key !== MailFolderType.SENT &&
        key !== MailFolderType.TRASH &&
        key !== MailFolderType.DRAFT &&
        key !== MailFolderType.OUTBOX &&
        key !== MailFolderType.SPAM &&
        key !== 'total_unread_count' &&
        key !== MailFolderType.STARRED &&
        key !== 'updateUnreadCount' &&
        key !== 'outbox_dead_man_counter' &&
        key !== 'outbox_delayed_delivery_counter' &&
        key !== 'outbox_self_destruct_counter'
      ) {
        if (!isNaN(data[`${key}`])) {
          total_count += data[`${key}`];
        }
      }
    });

    return total_count;
  }
  return 0;
}

function updateMailMap(currentMap: any, mails: Mail[]): any {
  if (mails && mails.length > 0) {
    let tmpMailMap = {};
    mails.forEach(mail => {
      tmpMailMap = { ...tmpMailMap, [mail.id]: mail };
    });
    return { ...currentMap, ...tmpMailMap };
  }
  return currentMap;
}

function filterAndMergeMailIDs(
  newMails: Array<Mail>,
  originalMailIDs: Array<number>,
  limit: number,
  checkUnread: boolean = false,
): Array<number> {
  let mailIDs = newMails.filter(mail => (checkUnread ? !mail.read : true)).map(mail => mail.id);
  let newMailsMap: any = {};
  newMails.forEach(mail => {
    newMailsMap[mail.id] = mail;
  });
  if (originalMailIDs && originalMailIDs.length > 0) {
    originalMailIDs = originalMailIDs.filter(id => mailIDs.indexOf(id) < 0);
    mailIDs = mailIDs.map(mailID => {
      const newMail = newMailsMap[mailID];
      if (newMail.parent && originalMailIDs.includes(newMail.parent)) {
        originalMailIDs = originalMailIDs.filter(originMailID => originMailID !== newMail.parent);
        return newMail.parent;
      }
      return mailID;
    });
    originalMailIDs = [...mailIDs, ...originalMailIDs];
    if (originalMailIDs.length > limit) {
      originalMailIDs = originalMailIDs.slice(0, limit);
    }
    return originalMailIDs;
  }
  return mailIDs;
}

function getUpdatesFolderMap(
  newMails: Array<Mail>,
  originalFolderState: FolderState,
  limit: number,
  checkUnread: boolean = false,
  isConversationViewMode: boolean = true,
): any {
  let originalMailIDs = originalFolderState.mails;
  let mailIDs = newMails.filter(mail => (checkUnread ? !mail.read : true)).map(mail => mail.id);
  let newMailsMap: any = {};
  newMails.forEach(mail => {
    newMailsMap[mail.id] = mail;
  });
  if (originalMailIDs && originalMailIDs.length > 0) {
    // Remove duplicated mails
    let duplicatedMailIDS: any = [];
    originalMailIDs = originalMailIDs.filter(id => {
      if (mailIDs.indexOf(id) < 0) {
        return true;
      } else {
        duplicatedMailIDS = [...duplicatedMailIDS, id];
        return false;
      }
    });
    // Check children mails
    // If new's parent is same with any original mail
    // Replace it with original mail on new mail array
    let parentWithChild: any = [];
    if (isConversationViewMode) {
      mailIDs = mailIDs.map(mailID => {
        const newMail = newMailsMap[mailID];
        if (newMail.parent && originalMailIDs.includes(newMail.parent)) {
          originalMailIDs = originalMailIDs.filter(originMailID => originMailID !== newMail.parent);
          parentWithChild = [...parentWithChild.filter((item: any) => newMail.parent !== item), newMail.parent];
          return newMail.parent;
        }
        return mailID;
      });
    }
    // Merge new with old
    originalMailIDs = [...mailIDs, ...originalMailIDs];
    // Check overflow
    if (originalMailIDs.length > limit) {
      originalMailIDs = originalMailIDs.slice(0, limit);
    }
    const total_mail_count =
      originalFolderState.total_mail_count + mailIDs.length - parentWithChild.length - duplicatedMailIDS.length >= 0
        ? originalFolderState.total_mail_count + mailIDs.length - parentWithChild.length - duplicatedMailIDS.length
        : 0;
    return {
      mails: originalMailIDs,
      total_mail_count,
    };
  }
  return {
    mails: mailIDs,
    total_mail_count: mailIDs.length,
  };
}

function prepareMails(folderName: MailFolderType, folders: Map<string, FolderState>, mailMap: any): Array<Mail> {
  if (folders.has(folderName)) {
    const folderInfo = folders.get(folderName);
    let mails = folderInfo.mails
      .map(mailID => {
        let mail = mailMap[mailID] ? mailMap[mailID] : null;
        if (mail) {
          mail.receiver_list = mail.receiver_display.map((item: EmailDisplay) => item.name).join(', ');
          if (mail.children_folder_info) {
            if (folderName === MailFolderType.TRASH && mail.folder === MailFolderType.TRASH) {
              mail.thread_count = mail.children_folder_info ? mail.children_folder_info.trash_children_count + 1 : 0;
            } else if (folderName === MailFolderType.TRASH && mail.folder !== MailFolderType.TRASH) {
              mail.thread_count = mail.children_folder_info ? mail.children_folder_info.trash_children_count : 0;
            } else if (folderName !== MailFolderType.TRASH && mail.folder !== MailFolderType.TRASH) {
              mail.thread_count = mail.children_folder_info
                ? mail.children_folder_info.non_trash_children_count + 1
                : 0;
            } else if (folderName !== MailFolderType.TRASH && mail.folder === MailFolderType.TRASH) {
              mail.thread_count = mail.children_folder_info ? mail.children_folder_info.non_trash_children_count : 0;
            }
          }
        }
        return mail;
      })
      .filter(mail => mail !== null);
    return mails;
  } else {
    return [];
  }
}
