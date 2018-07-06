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
}
export interface Mailbox {
  id?: number;
  folders: string;
  messages: string[];
  email: string;
  is_active?: boolean;
  private_key: string;
  public_key: boolean;
  signature?: string;
}
