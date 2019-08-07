import { MailBoxesState } from './datatypes';
// Angular
import { Params } from '@angular/router';
// Ngrx
// Models
import { Attachment, Mail, Mailbox, MailFolderType, Membership, User, UserMailbox } from '../store/models';
import { Filter } from './models/filter.model';
import { SearchState } from './reducers/search.reducers';
import { Folder } from './models/mail.model';
import { WebSocketState } from './websocket.store';
import { OrganizationState } from './organization.store';

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
  updatedPrivateKeys?: any;
  isChangePasswordError?: boolean;
  captcha?: Captcha;
}

export interface Captcha {
  captcha_image?: string;
  captcha_key?: string;
  value?: string;
  inProgress?: boolean;
  isInvalid?: boolean;
  verified?: boolean;
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
  plan_type?: PlanType;
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
  totalContacts: number;
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
  autoresponder?: AutoResponder;
  customDomains: Domain[];
  customDomainsLoaded?: boolean;
  newCustomDomain?: Domain;
  newCustomDomainError?: string;
  currentCreationStep: number;
  isForwardingVerificationCodeSent?: boolean;
  emailForwardingErrorMessage?: string;
  autoResponderErrorMessage?: string;
  emailContacts?: EmailContact[];
  isLoaded?: boolean;
  invoices: Invoice[];
  isInvoiceLoaded?: boolean;
}

export interface EmailContact {
  name: string;
  email: string;
}

export interface Settings {
  id?: number;
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
  enable_forwarding?: boolean;
  forwarding_address?: string;
  plan_type?: PlanType;
  notification_email?: string;
  recurrence_billing?: boolean;
  is_subject_encrypted?: boolean;
}

export interface Invoice {
  id: number;
  invoice_id: number;
  invoice_date: Date;
  plan_type: PlanType,
  payment_type: PaymentType;
  payment_method: PaymentMethod;
  total_amount: number;
  total_amount_btc?: number;
  custom_domains: number;
  email_addresses: number;
  storage: number;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description?: string;
  quantity: number;
  amount: number;
  amount_btc?: number;
}

export interface AutoResponder {
  id?: number;
  is_time_range_restricted?: boolean;
  start_time?: string;
  end_time?: string;
  autoresponder_message?: string;
  autoresponder_active?: boolean;
  start_date?: string;
  end_date?: string;
  vacationautoresponder_message?: string;
  vacationautoresponder_active?: boolean;
  only_contacts?: boolean;
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
  canGetUnreadCount: boolean;
}

export class SecureContent {
  id?: number;
  content: string;
  incomingHeaders?: string;
  subject?: string;
  inProgress?: boolean;
  isSubjectEncrypted?: boolean;

  constructor(data?: Mail) {
    if (data) {
      this.content = data.content;
      this.subject = data.subject;
      this.incomingHeaders = data.incoming_headers;
      this.isSubjectEncrypted = data.is_subject_encrypted;
    }
  }
}

export interface DecryptedContentState {
  [key: number]: SecureContent;
}

export interface Draft {
  id: number;
  draft: Mail;
  inProgress?: boolean;
  encryptedContent?: SecureContent;
  decryptedContent?: string;
  isPGPInProgress?: boolean;
  isSshInProgress?: boolean;
  attachments: Attachment[];
  shouldSend?: boolean;
  shouldSave?: boolean;
  getUserKeyInProgress?: boolean;
  usersKeys?: UserKey;
  isMailDetailPage?: boolean;
  isSent?: boolean;

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
  isUpdatingOrder?: boolean;
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
  usersKeys?: PublicKey[];
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
  webSocket: WebSocketState;
  organization: OrganizationState;
}

export interface TimezonesState {
  timezones: Timezone[];
}

export interface Timezone {
  value: string;
  key: string;
}

export interface BitcoinState {
  bitcoinRequired: number,
  newWalletAddress: string;
  loaded: boolean;
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
  number_of_users?: number;
  number_of_aliases?: number;
  catch_all?: boolean;
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

export enum PlanType {
  FREE = 'FREE',
  PRIME = 'PRIME',
  CHAMPION = 'CHAMPION',
}

export enum NotificationPermission {
  DEFAULT = 'default',
  GRANTED = 'granted',
  DENIED = 'denied',
}

export enum MailAction {
  REPLY = 'REPLY',
  REPLY_ALL = 'REPLY_ALL',
  FORWARD = 'FORWARD'
}
