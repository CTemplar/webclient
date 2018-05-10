// Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Ngrx
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

// Rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

// Service
import { BlogService } from '../../core/providers';

// Custom Actions
import {
  BlogActionTypes,
  GetPosts, PutPosts, GetPostDetail, PutPostDetail, PostComment, PostCommentSuccess, PostCommentFailure, GetRelatedPosts, PutRelatedPosts
} from '../actions';


@Injectable()
export class BlogEffects {

  constructor(
    private actions: Actions,
    private blogService: BlogService,
    private router: Router,
  ) {}

  @Effect()
  GetPosts: Observable<any> = this.actions
    .ofType(BlogActionTypes.GET_POSTS)
    .map((action: GetPosts) => action.payload)
    .switchMap(payload => {
      return this.blogService.getPosts(payload.limit, payload.offset)
        .map(posts =>  new PutPosts(posts))
        .catch(() => of(new PutPosts('')));
    });

  @Effect()
  GetPostDetail: Observable<any> = this.actions
    .ofType(BlogActionTypes.GET_POST_DETAIL)
    .map((action: GetPostDetail) => action.payload)
    .switchMap(payload => {
      return this.blogService.getPostwithSlug(payload)
        .map((post) => {
          return new PutPostDetail(post);
        });
    });

  @Effect()
  PostComment: Observable<any> = this.actions
    .ofType(BlogActionTypes.POST_COMMENT)
    .map((action: PostComment) => action.payload)
    .switchMap(payload => {
      return this.blogService.addComment(payload)
        .map((post) => {
          return new PostCommentSuccess(post);
        }).catch((error) => {
          return Observable.of(new PostCommentFailure({ error: error }));
        });
    });
    @Effect()
    GetRelatedPosts: Observable<any> = this.actions
      .ofType(BlogActionTypes.GET_RELATED_POSTS)
      .map((action: GetRelatedPosts) => action.payload)
      .switchMap(payload => {
        return this.blogService.getRelatedPosts(payload)
          .map((posts) => {
            return new PutRelatedPosts(posts);
          });
      });
}
