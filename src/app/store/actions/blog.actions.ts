// Ngrx
import { Action } from '@ngrx/store';

export enum BlogActionTypes {
  GET_POSTS = '[Blog] GET_POSTS',
  PUT_POSTS = '[Blog] PUT_POSTS',
  GET_COMMENTS = '[Blog] GET_COMMENTS',
  GET_POST_DETAIL = '[Blog] GET_POST_DETAIL',
  PUT_POST_DETAIL = '[Blog] PUT_POST_DETAIL',
  POST_COMMENT = '[Blog] POST_COMMENT',
  POST_COMMENT_SUCCESS = '[Blog] POST_COMMENT_SUCCESS',
  POST_COMMENT_FAILURE = '[Blog] POST_COMMENT_FAILURE',
  GET_RELATED_POSTS = '[Blog] GET_RELATED_POSTS',
  PUT_RELATED_POSTS = '[Blog] PUT_RELATED_POSTS',
  GET_CATEGORIES = '[Blog] GET_CATEGORIES',
  PUT_CATEGORIES = '[Blog] PUT_CATEGORIES'
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

export class PostComment implements Action {
  readonly type = BlogActionTypes.POST_COMMENT;
  constructor(public payload: any) {}
}

export class PostCommentSuccess implements Action {
  readonly type = BlogActionTypes.POST_COMMENT_SUCCESS;
  constructor(public payload: any) {}
}

export class PostCommentFailure implements Action {
  readonly type = BlogActionTypes.POST_COMMENT_FAILURE;
  constructor(public payload: any) {}
}

export class GetRelatedPosts implements Action {
  readonly type = BlogActionTypes.GET_RELATED_POSTS;
  constructor(public payload: any) {}
}

export class PutRelatedPosts implements Action {
  readonly type = BlogActionTypes.PUT_RELATED_POSTS;
  constructor(public payload: any) {}
}

export class GetCategories implements Action {
  readonly type = BlogActionTypes.GET_CATEGORIES;
  constructor(public payload: any) {}
}

export class PutCategories implements Action {
  readonly type = BlogActionTypes.PUT_CATEGORIES;
  constructor(public payload: any) {}
}

export type BlogActionAll =
  | GetPosts
  | PutPosts
  | GetComments
  | GetPostDetail
  | PutPostDetail
  | PostComment
  | PostCommentSuccess
  | PostCommentFailure
  | GetRelatedPosts
  | PutRelatedPosts
  | GetCategories
  | PutCategories;
