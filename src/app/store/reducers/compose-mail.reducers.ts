import { FilenamePipe } from '../../shared/pipes/filename.pipe';
import { ComposeMailActions, ComposeMailActionTypes } from '../actions';
import { ComposeMailState } from '../datatypes';
import { MailFolderType } from '../models';

export function reducer(
  state: ComposeMailState = { drafts: {}, usersKeys: new Map() },
  action: ComposeMailActions,
): ComposeMailState {
  switch (action.type) {
    case ComposeMailActionTypes.SEND_MAIL:
    case ComposeMailActionTypes.CREATE_MAIL: {
      state.drafts[action.payload.id] = {
        ...state.drafts[action.payload.id],
        isSaving: true,
        inProgress: true,
        shouldSend: false,
        shouldSave: false,
        isSent: false,
      };
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.CREATE_MAIL_SUCCESS: {
      const oldDraft = state.drafts[action.payload.draft.id];
      const draftMail = action.payload.response;
      if (action.payload.draft.draft.forward_attachments_of_message) {
        oldDraft.attachments = draftMail.attachments.map((attachment: any) => {
          attachment.progress = 100;
          if (!attachment.name) {
            attachment.name = FilenamePipe.tranformToFilename(attachment.document);
          }
          attachment.draftId = oldDraft.id;
          attachment.attachmentId = performance.now() + Math.floor(Math.random() * 1000);
          return attachment;
        });
      }
      draftMail.is_html = oldDraft.draft.is_html;
      state.drafts[action.payload.draft.id] = {
        ...oldDraft,
        inProgress: false,
        isSent: false,
        draft: draftMail,
        isSaving: false,
      };
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.SEND_MAIL_SUCCESS: {
      delete state.drafts[action.payload.id];
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.SEND_MAIL_FAILURE: {
      state.drafts[action.payload.id] = {
        ...state.drafts[action.payload.id],
        draft: { ...state.drafts[action.payload.id].draft, send: false, folder: MailFolderType.DRAFT },
        inProgress: false,
        isSent: false,
      };
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.UPDATE_LOCAL_DRAFT: {
      state.drafts[action.payload.id] = { ...state.drafts[action.payload.id], ...action.payload, inProgress: true };
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.GET_USERS_KEYS: {
      if (action.payload.draftId && action.payload.draft) {
        state.drafts[action.payload.draftId] = {
          ...state.drafts[action.payload.draftId],
          ...action.payload.draft,
          // inProgress: true,
          getUserKeyInProgress: true,
        };
      }
      let usersKeys = state.usersKeys;
      action.payload.emails.forEach((email: string) => {
        usersKeys.set(email, { key: null, isFetching: true });
      });
      return { ...state, drafts: { ...state.drafts }, usersKeys };
    }

    case ComposeMailActionTypes.GET_USERS_KEYS_SUCCESS: {
      if (action.payload.draftId) {
        // TODO - should be check
        state.drafts[action.payload.draftId] = {
          ...state.drafts[action.payload.draftId],
          getUserKeyInProgress: false,
          usersKeys: !action.payload.isBlind ? action.payload.data : state.drafts[action.payload.draftId].usersKeys,
        };
      }
      // Saving on global user keys
      let usersKeys = state.usersKeys;
      if (!action.payload.isBlind && action.payload.data && action.payload.data.keys) {
        action.payload.data.keys.forEach((key: any) => {
          usersKeys.set(key.email, {
            key:
              usersKeys.has(key.email) && usersKeys.get(key.email).key && usersKeys.get(key.email).key.length > 0
                ? [...usersKeys.get(key.email).key, key]
                : [key],
            isFetching: false,
          });
        });
      }
      return {
        ...state,
        drafts: { ...state.drafts },
        usersKeys,
      };
    }

    case ComposeMailActionTypes.UPDATE_PGP_ENCRYPTED_CONTENT: {
      if (action.payload.draftId) {
        state.drafts[action.payload.draftId] = {
          ...state.drafts[action.payload.draftId],
          isPGPInProgress: action.payload.isPGPInProgress,
          encryptedContent: action.payload.encryptedContent,
        };
      }
      return {
        ...state,
        drafts: { ...state.drafts },
      };
    }

    case ComposeMailActionTypes.UPDATE_PGP_MIME_ENCRYPTED: {
      if (action.payload.draftId) {
        state.drafts[action.payload.draftId] = {
          ...state.drafts[action.payload.draftId],
          isPGPMimeInProgress: action.payload.isPGPMimeInProgress,
          // encryptedContent: action.payload.encryptedContent,
        };
      }
      return {
        ...state,
        drafts: { ...state.drafts },
      };
    }

    case ComposeMailActionTypes.UPDATE_PGP_SSH_KEYS: {
      if (action.payload.draftId) {
        state.drafts[action.payload.draftId] = {
          ...state.drafts[action.payload.draftId],
          // isSshInProgress: action.payload.isSshInProgress,
        };
        if (action.payload.keys) {
          state.drafts[action.payload.draftId].draft = {
            ...state.drafts[action.payload.draftId].draft,
            encryption: {
              ...state.drafts[action.payload.draftId].draft.encryption,
              // private_key: action.payload.keys.private_key,
              // public_key: action.payload.keys.public_key,
            },
          };
        }
      }
      return {
        ...state,
        drafts: { ...state.drafts },
      };
    }

    case ComposeMailActionTypes.CLOSE_MAILBOX: {
      if (action.payload && state.drafts[action.payload.id]) {
        state.drafts[action.payload.id] = { ...state.drafts[action.payload.id], isClosed: true };
        return { ...state, drafts: { ...state.drafts } };
      }
      return state;
    }

    case ComposeMailActionTypes.CLEAR_DRAFT: {
      delete state.drafts[action.payload.id];
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.START_ATTACHMENT_ENCRYPTION: {
      state.drafts[action.payload.draftId].attachments.forEach((attachment, index) => {
        if (attachment.attachmentId === action.payload.attachmentId) {
          state.drafts[action.payload.draftId].attachments[index] = {
            ...state.drafts[action.payload.draftId].attachments[index],
            inProgress: true,
          };
          state.drafts[action.payload.draftId] = {
            ...state.drafts[action.payload.draftId],
            isProcessingAttachments: true,
          };
        }
      });
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.UPLOAD_ATTACHMENT: {
      if (action.payload.id) {
        state.drafts[action.payload.draftId].attachments.forEach((attachment, index) => {
          if (attachment.attachmentId === action.payload.attachmentId) {
            state.drafts[action.payload.draftId].attachments[index] = {
              ...state.drafts[action.payload.draftId].attachments[index],
              inProgress: true,
            };
            state.drafts[action.payload.draftId] = {
              ...state.drafts[action.payload.draftId],
              isProcessingAttachments: true,
            };
          }
        });
      } else {
        state.drafts[action.payload.draftId].attachments = [
          ...state.drafts[action.payload.draftId].attachments,
          { ...action.payload, inProgress: true },
        ];
        state.drafts[action.payload.draftId] = {
          ...state.drafts[action.payload.draftId],
          isProcessingAttachments: true,
        };
      }
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.UPLOAD_ATTACHMENT_PROGRESS: {
      state.drafts[action.payload.draftId].attachments.forEach((attachment, index) => {
        if (attachment.attachmentId === action.payload.attachmentId) {
          state.drafts[action.payload.draftId].attachments[index] = {
            ...state.drafts[action.payload.draftId].attachments[index],
            progress: action.payload.progress,
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
            request: action.payload.request,
          };
        }
      });
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.UPLOAD_ATTACHMENT_SUCCESS: {
      const { data } = action.payload;
      state.drafts[data.draftId].attachments.forEach((attachment, index) => {
        if (attachment.attachmentId === data.attachmentId) {
          state.drafts[data.draftId].attachments[index] = {
            ...state.drafts[data.draftId].attachments[index],
            id: action.payload.response.id,
            document: action.payload.response.document,
            content_id: action.payload.response.content_id,
            inProgress: false,
            request: null,
          };
        }
      });
      const isProcessingAttachments = !!state.drafts[data.draftId].attachments.find(
        attachment => attachment.inProgress,
      );
      state.drafts[data.draftId] = { ...state.drafts[data.draftId], isProcessingAttachments };
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.UPLOAD_ATTACHMENT_FAILURE: {
      state.drafts[action.payload.draftId].attachments = state.drafts[action.payload.draftId].attachments.filter(
        attachment => attachment.attachmentId !== action.payload.attachmentId,
      );
      const isProcessingAttachments = !!state.drafts[action.payload.draftId].attachments.find(
        attachment => attachment.inProgress,
      );
      state.drafts[action.payload.draftId] = { ...state.drafts[action.payload.draftId], isProcessingAttachments };
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.DELETE_ATTACHMENT: {
      state.drafts[action.payload.draftId].attachments.forEach((attachment, index) => {
        if (attachment.attachmentId === action.payload.attachmentId) {
          state.drafts[action.payload.draftId].attachments[index] = {
            ...state.drafts[action.payload.draftId].attachments[index],
            isRemoved: true,
            inProgress: true,
          };
        }
      });
      state.drafts[action.payload.draftId] = { ...state.drafts[action.payload.draftId], isProcessingAttachments: true };
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.DELETE_ATTACHMENT_SUCCESS: {
      state.drafts[action.payload.draftId].attachments = state.drafts[action.payload.draftId].attachments.filter(
        attachment => {
          if (attachment.attachmentId === action.payload.attachmentId) {
            if (!attachment.id) {
              attachment.request.unsubscribe();
            }
            return false;
          }
          return true;
        },
      );
      const isProcessingAttachments = !!state.drafts[action.payload.draftId].attachments.find(
        attachment => attachment.inProgress,
      );
      state.drafts[action.payload.draftId] = { ...state.drafts[action.payload.draftId], isProcessingAttachments };
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.DELETE_ATTACHMENT_FAILURE: {
      state.drafts[action.payload.draftId].attachments.forEach((attachment, index) => {
        if (attachment.attachmentId === action.payload.attachmentId) {
          state.drafts[action.payload.draftId].attachments[index] = {
            ...state.drafts[action.payload.draftId].attachments[index],
            isRemoved: false,
            inProgress: false,
          };
        }
      });
      const isProcessingAttachments = !!state.drafts[action.payload.draftId].attachments.find(
        attachment => attachment.inProgress,
      );
      state.drafts[action.payload.draftId] = { ...state.drafts[action.payload.draftId], isProcessingAttachments };
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.NEW_DRAFT: {
      state.drafts[action.payload.id] = action.payload;
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.UPDATE_DRAFT_ATTACHMENT: {
      state.drafts[action.payload.draftId].attachments.forEach((attachment, index) => {
        if (attachment.attachmentId === action.payload.attachment.attachmentId) {
          state.drafts[action.payload.draftId].attachments[index] = {
            ...state.drafts[action.payload.draftId].attachments[index],
            ...action.payload.attachment,
          };
        }
      });
      return { ...state, drafts: { ...state.drafts } };
    }

    case ComposeMailActionTypes.MATCH_CONTACT_USER_KEYS: {
      const usersKeys = state.usersKeys;
      if (action.payload.contactKeyAdd) {
        const key = action.payload;
        usersKeys.set(key.email, {
          key:
            usersKeys.has(key.email) && usersKeys.get(key.email).key && usersKeys.get(key.email).key.length > 0
              ? [...usersKeys.get(key.email).key, { email: key.email, public_key: key.public_key }]
              : [{ email: key.email, public_key: key.public_key }],
          isFetching: false,
        });
      } else if (action.payload.contactKeyUpdate) {
      } else if (action.payload.contactKeyRemove) {
      } else if (action.payload.contactAdd) {
        // setting encryption type
        const email = action.payload.email;
        if (usersKeys.has(email) && usersKeys.get(email).key && usersKeys.get(email).key.length > 0) {
          usersKeys.set(email, { ...usersKeys.get(email), pgpEncryptionType: action.payload.enabled_encryption ? action.payload.encryption_type : null });
        }
      }
      return { ...state, usersKeys };
    }

    default: {
      return state;
    }
  }
}
