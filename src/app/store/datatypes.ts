// Angular
import {  Params } from '@angular/router';

// Ngrx
import * as fromRouter from '@ngrx/router-store';

// Models
import { User } from '../models/users';
import { Post, Category, Comment } from '../models/blog';
import { Mail } from '../models/mail';

export interface RouterStateUrl {
  url: string;
  queryParams: Params;
  params: Params;
}

export interface AuthState {
  // is a user authenticated?
  isAuthenticated: boolean;
  // if authenticated, there should be a user object
  user: User | null;
  // error message
  errorMessage: string | null;
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
}

export interface LoadingState {
  loading: boolean | true;
}

export interface AppState {
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
  auth: AuthState;
  blog: BlogState;
  mail: MailState;
  loading: LoadingState;
}
