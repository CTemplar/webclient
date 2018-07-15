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
  marked?: boolean;
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

/**
 * mailFolderTypes to avoid dirty checking of view
 * @type {{INBOX: MailFolderType; SENT: MailFolderType; DRAFT: MailFolderType; STARRED: MailFolderType; ARCHIVE: MailFolderType; SPAM: MailFolderType; TRASH: MailFolderType}}
 */
export const mailFolderTypes: any = {
  INBOX: MailFolderType.INBOX,
  SENT: MailFolderType.SENT,
  DRAFT: MailFolderType.DRAFT,
  STARRED: MailFolderType.STARRED,
  ARCHIVE: MailFolderType.ARCHIVE,
  SPAM: MailFolderType.SPAM,
  TRASH: MailFolderType.TRASH,
};

export interface Attachment {
  id?: number;
  document: any;
  hash: string;
  message: string;
  progress?: number;
}
