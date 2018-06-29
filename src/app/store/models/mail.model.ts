export interface Mail {
  id?: number;
  content: string;
  folder: string;
  read?: boolean;
  starred?: boolean;
  send?: boolean;
  mailbox: number;
}
