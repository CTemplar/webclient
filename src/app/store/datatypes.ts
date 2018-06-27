// Angular
import { Params } from '@angular/router';

// Ngrx
import * as fromRouter from '@ngrx/router-store';

// Models
import { User } from '../store/models';
import { Post, Category, Comment } from '../store/models';
import { Mail } from '../store/models';

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
  inProgress?: boolean;
  isError?: boolean;
  error?: string;
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
  draft: Mail,
  inProgress?: boolean;
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
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
  auth: AuthState;
  blog: BlogState;
  mail: MailState;
  loading: LoadingState;
  keyboard: KeyboardState;
  user: UserState;
}

