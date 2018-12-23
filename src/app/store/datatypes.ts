import { MailBoxesState } from './datatypes';
// Angular
import { Params } from '@angular/router';
// Ngrx
// Models
import { Category, Comment, Mail, Membership, Post, User, Mailbox, UserMailbox, Attachment, MailFolderType } from '../store/models';
import { Filter } from './models/filter.model';
import { SearchState } from './reducers/search.reducers';
import { Folder } from './models/mail.model';

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
  inProgress: boolean;
  signupState: SignupState;
  isRecoveryCodeSent: boolean;
  resetPasswordErrorMessage: string | null;
}

export interface SignupState {
  username?: string;
  password?: string;
  recovery_email?: string;
  usernameExists?: boolean;
  inProgress?: boolean;
  recaptcha: string;
  public_key?: string;
  private_key?: string;
  fingerprint?: string;
  payment_type?: PaymentType;
  payment_method?: PaymentMethod;
  currency?: string;
  memory?: number;
  email_count?: number;
  domain_count?: number;
  monthlyPrice?: number;
  annualPricePerMonth?: number;
  annualPriceTotal?: number;
}

export interface UserState {
  username: string | null;
  id: number | null;
  whiteList: WhiteList[];
  blackList: BlackList[];
  contact: Contact[];
  settings: Settings;
  payment_transaction?: Payment;
  isPrime?: boolean;
  joinedDate?: string;
  inProgress?: boolean;
  isError?: boolean;
  error?: string;
  membership: Membership;
  mailboxes: UserMailbox[];
  customFolders: Folder[];
  filters: Filter[];
  filtersError?: any;
  customDomains: Domain[];
  newCustomDomain?: Domain;
  newCustomDomainError?: string;
  currentCreationStep: number;
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
  email_count?: number;
  domain_count?: number;
  default_font?: string;
}

export interface Payment {
  id?: number;
  transaction_id?: string;
  amount?: number;
  currency?: string;
  created?: string;
  billing_cycle_ends?: string;
  payment_method?: PaymentMethod;
  payment_type?: PaymentType;
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
  total_mail_count: number;
  mailDetail: Mail;
  folders: Map<string, Mail[]>;
  currentFolder?: MailFolderType;
  loaded?: boolean;
  inProgress?: boolean;
  decryptedContents: DecryptedContentState;
  unreadMailsCount: any;
  noUnreadCountChange: boolean;
}

export interface DecryptedContent {
  id: number;
  content: string;
  inProgress: boolean;
}

export interface DecryptedContentState {
  [key: number]: DecryptedContent;
}

export interface Draft {
  id: number;
  draft: Mail;
  inProgress?: boolean;
  encryptedContent?: string;
  decryptedContent?: string;
  isPGPInProgress?: boolean;
  isSshInProgress?: boolean;
  attachments: Attachment[];
  shouldSend?: boolean;
  shouldSave?: boolean;
  getUserKeyInProgress?: boolean;
  usersKeys?: UserKey;

  /**
   * @var isClosed
   * @description It represents if the compose mail editor has been closed or not.
   */
  isClosed?: boolean;
}

export interface DraftState {
  [key: number]: Draft;
}

export interface ComposeMailState {
  drafts: DraftState;
}

export interface MailBoxesState {
  mailboxes: Mailbox[];
  currentMailbox: Mailbox;
  decryptKeyInProgress: boolean;
  decryptedKey?: any;
  encryptionInProgress: boolean;
  inProgress?: boolean;
}

export interface SecureMessageState {
  message: Mail;
  decryptedContent?: string;
  decryptedKey?: any;
  encryptedContent?: string;
  isKeyDecryptionInProgress?: boolean;
  isContentDecryptionInProgress?: boolean;
  isEncryptionInProgress?: boolean;
  inProgress?: boolean;
  errorMessage?: string;
  getUserKeyInProgress?: boolean;
  usersKeys?: UserKey;
}

export interface UserKey {
  encrypt: boolean;
  keys: PublicKey[];
}

export interface PublicKey {
  email: string;
  is_enabled: boolean;
  public_key: string;
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
  composeMail: ComposeMailState;
  secureMessage: SecureMessageState;
  search: SearchState;
}

export interface TimezonesState {
  timezones: Timezone[];
}

export interface Timezone {
  value: string;
  key: string;
}

export interface BitcoinState {
  serviceValue: number;
  newWalletAddress: string;
  loaded: boolean;
  redeemCode: string;
  checkTransactionResponse: CheckTransactionResponse;
}

export interface CheckTransactionResponse {
  address?: string;
  balance?: number;
  required_balance?: number;
  pending_balance?: number;
  paid_out?: number;
  confirmed?: boolean;
  status: TransactionStatus;
}

export interface DomainRecord {
  type: string;
  host: string;
  value: string;
  priority?: number;
}

export interface Domain {
  id: number;
  verification_record: DomainRecord;
  mx_record: DomainRecord;
  spf_record: DomainRecord;
  dkim_record: DomainRecord;
  dmarc_record: DomainRecord;
  domain: string;
  is_domain_verified: boolean;
  is_mx_verified: boolean;
  is_spf_verified: boolean;
  is_dkim_verified: boolean;
  is_dmarc_verified: boolean;
  created: string;
  verified_at?: string;
}

export enum TransactionStatus {
  WAITING = 'Waiting',
  PENDING = 'Pending',
  RECEIVED = 'Received',
  SENT = 'Sent'
}

export enum PaymentMethod {
  STRIPE = 'Stripe',
  BITCOIN = 'Bitcoin'
}


export enum PaymentType {
  MONTHLY = 'monthly',
  ANNUALLY = 'annually',
}
