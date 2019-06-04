import { Subscription } from 'rxjs';

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
  encryption?: any;
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
  spam_reason?: string;
  thread_count?: number;
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
}

export interface Folder {
  id?: number;
  name: string;
  color: string;
  sort_order?: number;
}


export enum MailFolderType {
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
  name: string;
  size: string;
  message: number;
  progress?: number;
  attachmentId?: number;
  inProgress: boolean;
  is_inline: boolean;
  content_id?: string;
  request?: Subscription;
  isRemoved?: boolean;
}

export interface EmailDisplay {
  name?: string;
  email: string;
}
