import { Action } from '@ngrx/store';


export enum BlogActionTypes {
  GET_POSTS = '[Blog] GET_POSTS',
  PUT_POSTS = '[Blog] PUT_POSTS',
  GET_COMMENTS = '[Blog] GET_COMMENTS',
  GET_POST_DETAIL = '[Blog] GET_POST_DETAIL',
  PUT_POST_DETAIL = '[Blog] PUT_POST_DETAIL'
}

export class GetPosts implements Action {
  readonly type = BlogActionTypes.GET_POSTS;
  constructor(public payload: any) {}
}

export class PutPosts implements Action {
  readonly type = BlogActionTypes.PUT_POSTS;
  constructor(public payload: any) {}
}

export class GetComments implements Action {
  readonly type = BlogActionTypes.GET_COMMENTS;
  constructor(public payload: any) {}
}

export class GetPostDetail implements Action {
  readonly type = BlogActionTypes.GET_POST_DETAIL;
  constructor(public payload: any) {}
}

export class PutPostDetail implements Action {
  readonly type = BlogActionTypes.PUT_POST_DETAIL;
  constructor(public payload: any) {}
}

export type BlogActionAll =
  | GetPosts
  | PutPosts
  | GetComments
  | GetPostDetail
  | PutPostDetail;
