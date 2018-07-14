import { MailBoxesState } from './datatypes';
// Angular
import { Params } from '@angular/router';
// Ngrx
// Models
import { Category, Comment, Mail, Membership, Post, User, Mailbox, UserMailbox } from '../store/models';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
  state: any;
}

export interface AuthState {
  // is a user authenticated?
  isAuthenticated: boolean;
  // if authenticated, there should be a user object
  user: User | null;
  // error message
  errorMessage: string | null;
}

export interface UserState {
  username: string | null;
  id: number | null;
  whiteList: WhiteList[];
  blackList: BlackList[];
  contact: Contact[];
  settings: Settings;
  isPrime?: boolean;
  inProgress?: boolean;
  isError?: boolean;
  error?: string;
  membership: Membership;
  mailboxes: UserMailbox[];
}

export interface Settings {
  id?: number;
  autoresponder?: boolean;
  emails_per_page?: number;
  embed_content?: boolean;
  newsletter?: boolean;
  recovery_email?: string;
  save_contacts?: boolean;
  show_snippets?: boolean;
  timezone?: string;
  language?: string;
  signature?: string;
  allocated_storage?: number;
  used_storage?: number;
  display_name?: string;
}

export interface BlogState {
  posts: Post[];
  comments: Comment[];
  categories: Category[];
  newPosts?: Post[];
  selectedPost?: Post;
  errorMessage: string | null;
  newComment?: Comment;
  relatedPosts?: Post[];
}

export interface MailState {
  mails: Mail[];
  folders: any[];
  draft: Mail;
  inProgress?: boolean;
  encryptedContent?: string;
  decryptedContent?: string;
  isPGPInProgress?: boolean;
}

export interface MailBoxesState {
  mailboxes: Mailbox[];
  currentMailbox: Mailbox;
  decryptKeyInProgress: boolean;
  decryptedKey?: any;
}

export interface LoadingState {
  RecentBlogLoading: boolean | true;
  RelatedBlogLoading: boolean | true;
  Loading: boolean | true;
}

export interface KeyboardState {
  keyboardFocused: boolean;
  keyPressed: {
    key: string
  };
  focusedInput: string;
}

export interface WhiteList {
  id?: number;
  email: string;
  name: string;
}

export interface BlackList {
  id?: number;
  email: string;
  name: string;
}

export interface Contact {
  id?: number;
  address: string;
  email: string;
  name: string;
  note: string;
  phone: string;
  phone2?: string;
  markForDelete?: boolean; // To handle delete multiple contacts using checkboxes
}

export interface AppState {
  auth: AuthState;
  blog: BlogState;
  mail: MailState;
  mailboxes: MailBoxesState;
  loading: LoadingState;
  keyboard: KeyboardState;
  user: UserState;
  timezone: TimezonesState;
  bitcoin: BitcoinState;
}

export interface TimezonesState {
  timezones: Timezone[];
}

export interface Timezone {
  value: string;
  key: string;
}

export interface BitcoinState {
  currentUsdValue: number;
  newWalletAddress: string;
}
