///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class Attachment {
  name: string;
  url: string;
}

export class Mailbox {
  email: string;
  display_name: string;
  folder: string;
  keyObj?: any;
  messages: Message[];
  private_key: string;
  public_key: string;
  signature: string;
}

export class Message {
  id: number;
  attachments?: Attachment[];
  content: string;
  datetime: string;
  destruct_date: string;
  json?: string;
  read: boolean;
  send: boolean;
  starred: boolean;
}
