// Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// Ngrx
import { Actions, Effect, ofType } from '@ngrx/effects';
// Rxjs
import { Observable, of } from 'rxjs';
// Service
import { BlogService } from '../../store/services';
// Custom Actions
import {
  BlogActionTypes,
  GetCategories,
  GetPostDetail,
  GetPosts,
  GetRelatedPosts,
  PostComment,
  PostCommentFailure,
  PostCommentSuccess,
  PutCategories,
  PutPostDetail,
  PutPosts,
  PutRelatedPosts
} from '../actions';
import { catchError, map, switchMap } from 'rxjs/operators';


@Injectable()
export class BlogEffects {

  constructor(
    private actions: Actions,
    private blogService: BlogService,
    private router: Router,
  ) {
  }

  @Effect()
  GetPosts: Observable<any> = this.actions
    .pipe(
      ofType(BlogActionTypes.GET_POSTS),
      map((action: GetPosts) => action.payload),
      switchMap(payload => {
        return this.blogService.getPosts(payload.limit, payload.offset)
          .pipe(
            map(posts => new PutPosts(posts)),
            catchError(() => of(new PutPosts('')))
          );
      }));

  @Effect()
  GetPostDetail: Observable<any> = this.actions
    .pipe(
      ofType(BlogActionTypes.GET_POST_DETAIL),
      map((action: GetPostDetail) => action.payload),
      switchMap(payload => {
        return this.blogService.getPostwithSlug(payload)
          .pipe(
            map((post) => new PutPostDetail(post))
          );
      })
    );

  @Effect()
  PostComment: Observable<any> = this.actions
    .pipe(
      ofType(BlogActionTypes.POST_COMMENT),
      map((action: PostComment) => action.payload),
      switchMap(payload => {
        return this.blogService.addComment(payload)
          .pipe(map((post) => new PostCommentSuccess(post)),
            catchError((error) => of(new PostCommentFailure({ error: error }))));
      })
    );

  @Effect()
  GetRelatedPosts: Observable<any> = this.actions
    .pipe(
      ofType(BlogActionTypes.GET_RELATED_POSTS),
      map((action: GetRelatedPosts) => action.payload),
      switchMap(payload => {
        return this.blogService.getRelatedPosts(payload)
          .pipe(map((posts) => new PutRelatedPosts(posts)));
      })
    );

  @Effect()
  GetCategories: Observable<any> = this.actions
    .pipe(
      ofType(BlogActionTypes.GET_CATEGORIES),
      map((action: GetCategories) => action.payload),
      switchMap(payload => {
        return this.blogService.getCategories()
          .pipe(map((post) => new PutCategories(post)));
      })
    );
}
