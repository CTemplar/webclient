import * as fromRouter from '@ngrx/router-store';
import {  Params } from '@angular/router';
import { User } from '../models/users';

import { Post, Category, Comment } from '../models/blog';

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
}

export interface AppState {
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
  auth: AuthState;
  blog: BlogState;
}
