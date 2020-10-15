import { MailActions, MailActionTypes } from '../actions';
import { MailState, MailStateFolderInfo, FolderState } from '../datatypes';
import { Attachment, EmailDisplay, Mail, MailFolderType, Folder } from '../models';
import { FilenamePipe } from '../../shared/pipes/filename.pipe';
import { FOLDER_COLORS } from '../../shared/config';
import { filter } from 'rxjs/operators';

export function reducer(
  state: MailState = {
    mails: [],
    total_mail_count: 0,
    info_by_folder: new Map(),
    mailDetail: null,
    folders: new Map(),
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
    pageLimit: 20
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
      let { mails } = action.payload;
      const payloadMails = action.payload.mails;
      const mailMap = updateMailMap(state.mailMap, payloadMails);
      let folderMap = new Map(state.folderMap);
      // Update Folder Map for ###TARGET FOLDER###
      if (!action.payload.is_from_socket || (action.payload.is_from_socket && folderMap.has(action.payload.folder))) {
        const oldFolderInfo = folderMap.get(action.payload.folder);
        const mailIDS = oldFolderInfo ? filterAndMergeMailIDs(payloadMails, oldFolderInfo.mails, action.payload.limit) : payloadMails.map(mail => mail.id);
        const folderState = {
          mails: mailIDS,
          total_mail_count: action.payload.total_mail_count,
          is_not_first_page: action.payload.is_not_first_page,
          offset: action.payload.offset,
          is_dirty: false
        }
        folderMap.set(`${action.payload.folder}`, folderState);
      }
      
      // Update Folder Map for ###UNREAD FOLDER###
      if (
        action.payload.folder !== MailFolderType.UNREAD && 
        action.payload.folder !== MailFolderType.SPAM && 
        folderMap.has(MailFolderType.UNREAD)
        ) {
        const oldFolderInfo = folderMap.get(MailFolderType.UNREAD);
        const mailIDS = filterAndMergeMailIDs(payloadMails, oldFolderInfo.mails, action.payload.limit, true);
        const folderState = {
          ...oldFolderInfo,
          mails: mailIDS,
          total_mail_count: oldFolderInfo.total_mail_count + payloadMails.length
        }
        folderMap.set(MailFolderType.UNREAD, folderState);
      }
      // Update Folder Map for ###ALL EMAILS FOLDER###
      if (
        action.payload.folder !== MailFolderType.ALL_EMAILS && 
        action.payload.folder !== MailFolderType.SPAM && 
        folderMap.has(MailFolderType.ALL_EMAILS)
        ) {
        const oldFolderInfo = folderMap.get(MailFolderType.ALL_EMAILS);
        const mailIDS = filterAndMergeMailIDs(payloadMails, oldFolderInfo.mails, action.payload.limit);
        const folderState = {
          ...oldFolderInfo,
          mails: mailIDS,
          total_mail_count: oldFolderInfo.total_mail_count + payloadMails.length
        }
        folderMap.set(MailFolderType.ALL_EMAILS, folderState);
      }
      
      mails = prepareMails(state.currentFolder, folderMap, mailMap);
      mails.forEach((mail: Mail) => {
        mail.receiver_list = mail.receiver_display.map((item: EmailDisplay) => item.name).join(', ');
        if (mail.is_subject_encrypted && state.decryptedSubjects[mail.id]) {
          mail.subject = state.decryptedSubjects[mail.id];
          mail.is_subject_encrypted = false;
        }
      });
      state.pageLimit = action.payload.limit;
      //
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

    case MailActionTypes.MOVE_MAIL_SUCCESS: {
      const listOfIDs = action.payload.ids.toString().split(',');
      let folderMap = state.folderMap;
      // Update source folder's mails
      const sourceFolderName = action.payload.sourceFolder;
      if (sourceFolderName && folderMap.has(sourceFolderName)) {
        let sourceFolderState = folderMap.get(sourceFolderName);
        sourceFolderState.mails = sourceFolderState.mails.filter(mail => !listOfIDs.includes(mail.toString()));
        folderMap.set(sourceFolderName, sourceFolderState);
      }
      let mailMap = state.mailMap;
      const mailMapKeys = Object.keys(mailMap);
      mailMapKeys.forEach(key => {
        if (listOfIDs.includes(mailMap[key].id.toString())) {
          mailMap[key] = { ...mailMap[key], folder: action.payload.folder };
        }
      })
      const mails = prepareMails(state.currentFolder, folderMap, mailMap);
      if (
        state.mailDetail &&
        state.mailDetail.children &&
        state.mailDetail.children.some(child => listOfIDs.includes(child.id.toString()))
      ) {
        state.mailDetail.children.forEach((child, index) => {
          if (listOfIDs.includes(child.id.toString())) {
            state.mailDetail.children[index] = { ...state.mailDetail.children[index], folder: action.payload.folder };
          }
        });
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
        isMailsMoved: true 
      };
    }

    case MailActionTypes.UNDO_DELETE_MAIL_SUCCESS: {
      let { mails } = state;
      // refactoring
      const undo_mails = Array.isArray(action.payload.mail) ? action.payload.mail : [action.payload.mail];
      let folderMap = state.folderMap;
      // Destination folder map
      if (state.folderMap.has(action.payload.sourceFolder)) {
        const oldFolderMap = folderMap.get(action.payload.sourceFolder);
        let updatedMailIDS = filterAndMergeMailIDs(undo_mails, [...oldFolderMap.mails], state.pageLimit);
        updatedMailIDS = sortByDueDateWithID(updatedMailIDS, state.mailMap);
        oldFolderMap.mails = updatedMailIDS;
        oldFolderMap.total_mail_count += undo_mails.length;
        folderMap.set(action.payload.sourceFolder, oldFolderMap);
      }
      // Source folder map
      if (state.folderMap.has(action.payload.folder)) {
        const oldFolderMap = folderMap.get(action.payload.folder);
        oldFolderMap.mails = [];
        oldFolderMap.is_dirty = true;
        folderMap.set(action.payload.sourceFolder, oldFolderMap);
      }
      if (action.payload.sourceFolder === state.currentFolder) {
        mails = prepareMails(action.payload.sourceFolder, folderMap, state.mailMap);
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
        const updatedCurrentFolderMails  = currentFolderInfo.mails.filter(mailID => {
          if (listOfIDs.includes(mailID.toString()) && action.payload.read) {
            return false;
          } else {
            return true;
          }
        });
        currentFolderInfo.mails = updatedCurrentFolderMails;
        folderMap.set(MailFolderType.UNREAD, currentFolderInfo);
      }
      const mails = prepareMails(state.currentFolder, folderMap, mailMap);
      if (state.mailDetail && listOfIDs.includes(state.mailDetail.id.toString())) {
        state.mailDetail = { ...state.mailDetail, read: action.payload.read };
      }
      
      return {
        ...state,
        mails,
        mailMap,
        folderMap,
        inProgress: false,
        noUnreadCountChange: true
      }
    }

    case MailActionTypes.STAR_MAIL_SUCCESS: {
      const listOfIDs = action.payload.ids.split(',');
      let folderMap = state.folderMap;
      let mailMap = state.mailMap;
      const allIDS = Object.keys(mailMap);
      allIDS.forEach(mailID => {
        if (listOfIDs.includes(mailID.toString())) {
          mailMap[mailID] = { ...mailMap[mailID], starred: action.payload.starred };
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
        const updatedCurrentFolderMails  = currentFolderInfo.mails.filter(mailID => {
          if (listOfIDs.includes(mailID.toString()) && !action.payload.starred) {
            return false;
          } else {
            return true;
          }
        });
        currentFolderInfo.mails = updatedCurrentFolderMails;
        folderMap.set(MailFolderType.STARRED, currentFolderInfo);
      }
      const mails = prepareMails(state.currentFolder, folderMap, mailMap);
      if (state.mailDetail && listOfIDs.includes(state.mailDetail.id.toString())) {
        state.mailDetail = { ...state.mailDetail, starred: action.payload.starred };
      }
      
      return {
        ...state,
        mails,
        mailMap,
        folderMap,
        inProgress: false,
        noUnreadCountChange: true
      }
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
          folderInfo.is_dirty = true;
          folderMap.set(key, folderInfo);
        }
      });
      if (
        state.mailDetail &&
        state.mailDetail.children &&
        state.mailDetail.children.some(child => listOfIDs.includes(child.id.toString()))
      ) {
        state.mailDetail.children = state.mailDetail.children.filter(
          child => !listOfIDs.includes(child.id.toString()),
        );
      }
      const mails = prepareMails(state.currentFolder, folderMap, mailMap);
      return {
        ...state,
        mails,
        folderMap,
        mailMap,
        inProgress: false,
        noUnreadCountChange: true
      }
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

    case MailActionTypes.CLEAR_MAILS_ON_CONVERSATION_MODE_CHANGE: {
      return {
        ...state,
        mails: [],
        total_mail_count: 0,
        info_by_folder: new Map(),
        mailDetail: null,
        folders: new Map(),
        loaded: false,
        unreadMailsCount: { inbox: 0 },
        noUnreadCountChange: true,
        canGetUnreadCount: true,
        mailMap: {},
        folderMap: new Map()
      };
    }

    case MailActionTypes.CLEAR_MAILS_ON_LOGOUT: {
      return {
        mails: [],
        total_mail_count: 0,
        info_by_folder: new Map(),
        mailDetail: null,
        folders: new Map(),
        loaded: false,
        decryptedContents: {},
        unreadMailsCount: { inbox: 0 },
        noUnreadCountChange: true,
        canGetUnreadCount: true,
        decryptedSubjects: {},
        customFolderMessageCount: [],
        mailMap: {},
        folderMap: new Map()
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
        }
      }
      return { ...state, noUnreadCountChange: true };
    }

    case MailActionTypes.SET_CURRENT_FOLDER: {
      const folderMap = state.folderMap;
      const mails = prepareMails(action.payload, folderMap, state.mailMap);
      const total_mail_count = folderMap.has(action.payload) ? folderMap.get(action.payload).total_mail_count : 0;
      return {
        ...state,
        mails: mails,
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
            mailMap.children_count = mailMap.children_count + 1;
          }
        });
      }
      // update target folder map
      if (folderMap.has(newMail.folder)) {
        let targetFolderMap = folderMap.get(newMail.folder);
        let targetFolderMails = filterAndMergeMailIDs([newMail], targetFolderMap.mails, state.pageLimit);
        if (!targetFolderMap.mails.includes(newMail.id)) {
          targetFolderMap.total_mail_count += 1;
        }
        targetFolderMap.mails = targetFolderMails;
        folderMap.set(newMail.folder, targetFolderMap);
      }

      const mails = prepareMails(state.currentFolder, folderMap, mailMap);
      return {
        ...state,
        mails,
        mailMap,
        folderMap,
        noUnreadCountChange: true
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

function sortByDueDate(sortArray): any[] {
  return sortArray.sort((previous: any, next: any) => {
    const next_updated = next.updated || null;
    const previous_updated = previous.updated || null;
    return <any>new Date(next_updated) - <any>new Date(previous_updated);
  });
}

function sortByDueDateWithID(sortArray: Array<number>, mailMap: any): any[] {
  const mails = sortArray.map(mailID => {
    if (mailMap.hasOwnProperty(mailID)) {
      return mailMap[mailID];
    }
  })
  const sorted = mails.sort((previous: any, next: any) => {
    const next_updated = next.updated || null;
    const previous_updated = previous.updated || null;
    return <any>new Date(next_updated) - <any>new Date(previous_updated);
  }).map(mail => mail.id);
  return sorted;
}

function getTotalUnreadCount(data): number {
  if (data) {
    let total_count = 0;
    Object.keys(data).map(key => {
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
      tmpMailMap = {...tmpMailMap, [mail.id]: mail}
    });
    return {...currentMap, ...tmpMailMap};
  }
  return currentMap;
}

function filterAndMergeMailIDs(
  newMails: Array<Mail>, 
  originalMailIDs: Array<number>, 
  limit: number, 
  checkUnread: boolean = false
): Array<number> {
  const mailIDs = newMails.filter(mail => checkUnread ? !mail.read : true).map(mail => mail.id);
  if (originalMailIDs && originalMailIDs.length > 0) {
    originalMailIDs = originalMailIDs.filter(id => mailIDs.indexOf(id) < 0);
    originalMailIDs = [...mailIDs, ...originalMailIDs];
    if (originalMailIDs.length > limit) {
      originalMailIDs = originalMailIDs.slice(0, limit);
    }
    return originalMailIDs;
  }
  return mailIDs;
}

function prepareMails(folderName: MailFolderType, folders: Map<string, FolderState>, mailMap: any): Array<Mail> {
  if (folders.has(folderName)) {
    const folderInfo = folders.get(folderName);
    let mails = folderInfo.mails.map(mailID => {
      let mail = mailMap[mailID] ? mailMap[mailID] : null;
      if (mail) {
        mail.receiver_list = mail.receiver_display.map((item: EmailDisplay) => item.name).join(', ');
      }
      return mail;
    }).filter(mail => mail !== null);
    return mails;
  } else {
    return [];
  }
}

