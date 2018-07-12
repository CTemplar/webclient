export interface Mail {
  id?: number;
  content: string;
  folder: string;
  read?: boolean;
  starred?: boolean;
  send?: boolean;
  mailbox: number;
  from?: string;
  checked?: boolean;
  sender?: string;
  subject?: string;
  encryption?: Array<any>;
  attachments?: Array<any>;
  receiver?: Array<string>;
  cc?: Array<string>;
  bcc?: Array<string>;
  destruct_date?: string;
  delayed_delivery?: string;
  dead_man_timer?: string;
  datetime?: string;
}

export interface Mailbox {
  id?: number;
  folders: string;
  messages: string[];
  email: string;
  is_active?: boolean;
  private_key: string;
  public_key: string;
  signature?: string;
}


export enum MailFolderType {
  INBOX = 'inbox',
  SENT = 'sent',
  DRAFT = 'draft',
  STARRED = 'starred',
  ARCHIVE = 'archive',
  SPAM = 'spam',
  TRASH = 'trash'
}