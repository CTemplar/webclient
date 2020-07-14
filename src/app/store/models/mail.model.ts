import { Subscription } from 'rxjs';
import { MailAction } from '../datatypes';

export interface Mail {
  id?: number;
  content: string;
  folder?: string;
  read?: boolean;
  starred?: boolean;
  send?: boolean;
  mailbox?: number;
  from?: string;
  checked?: boolean;
  sender?: string;
  sender_display?: EmailDisplay;
  subject?: string;
  encryption?: EncryptionNonCTemplar;
  attachments?: Array<any>;
  receiver?: Array<string>;
  receiver_list?: string;
  receiver_display?: Array<EmailDisplay>;
  reply_to?: Array<string>;
  cc?: Array<string>;
  bcc?: Array<string>;
  bcc_display?: Array<EmailDisplay>;
  destruct_date?: string;
  delayed_delivery?: string;
  dead_man_duration?: string;
  datetime?: string;
  marked?: boolean;
  is_encrypted?: boolean;
  is_subject_encrypted?: boolean;
  is_protected?: boolean;
  sent_at?: string;
  has_attachments?: boolean;
  created_at?: string;
  parent?: number;
  has_children?: boolean;
  children_count?: number;
  children?: Array<Mail>;
  forward_attachments_of_message?: number;
  incoming_headers?: string;
  spam_reason?: string | [];
  thread_count?: number;
  last_action_thread?: MailAction;
  last_action?: MailAction;
  last_action_parent_id?: number;
  is_html?: boolean;
  // Added sender_display_name due to the different name with same address
  sender_display_name?: string;
}

export class EncryptionNonCTemplar {
  expires?: string;
  expiry_hours: number = 120;
  id?: number;
  password: string;
  password_hint?: string;
  private_key?: string;
  public_key?: string;
  random_secret?: string;
}

export interface Mailbox {
  id?: number;
  folders: string[];
  messages: string[];
  email: string;
  is_active?: boolean;
  private_key: string;
  public_key: string;
  fingerprint?: string;
  signature?: string;
  display_name?: string;
  is_default?: boolean;
  is_enabled?: boolean;
  sort_order: number;
  inProgress?: boolean;
}

export interface Folder {
  id?: number;
  name: string;
  color: string;
  sort_order?: number;
}


export enum MailFolderType {
  ALL_EMAILS = 'allmails',
  UNREAD = 'allunreadmails',
  INBOX = 'inbox',
  SENT = 'sent',
  DRAFT = 'draft',
  STARRED = 'starred',
  ARCHIVE = 'archive',
  SPAM = 'spam',
  TRASH = 'trash',
  OUTBOX = 'outbox',
  SEARCH = 'search'
}

export interface Attachment {
  id?: number;
  draftId: number;
  document: any;
  decryptedDocument?: File;
  name: string;
  size: string;
  message: number;
  progress?: number;
  attachmentId?: number;
  inProgress: boolean;
  is_inline: boolean;
  is_encrypted?: boolean;
  is_forwarded?: boolean;
  content_id?: string;
  request?: Subscription;
  isRemoved?: boolean;
}

export interface EmailDisplay {
  name?: string;
  email: string;
}
