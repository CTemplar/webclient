export class Message {
  id: number;
  folder: string;
  subject: string;
  from_header: string;
  to_header: string;
  body: string;
  text: string;
  html: string;
  processed: string;
  read: boolean;
  secure: boolean;
  starred: boolean;
  outgoing: boolean;
  date: string;
  time: string;
}

