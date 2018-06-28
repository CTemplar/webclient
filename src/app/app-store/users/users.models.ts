///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class Contact {
  address: string;
  email: string;
  name: string;
  note: string;
  phone: string;
  phone2: string;
}

export class Myself {
  blacklist: Blacklist[];
  contacts: Contact[];
  settings: Settings;
  username: string;
  whitelist: Whitelist[];
}

export class Blacklist {
  email: string;
  name: string;
}

export class Settings {
  autoresponder: string;
  emails_per_page: string;
  embed_content: boolean;
  newsletter: boolean;
  recovery_email: string;
  save_contacts: boolean;
  show_snippets: boolean;
  membership: number;
}

export class Whitelist {
  email: string;
  name: string;
}
