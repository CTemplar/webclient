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

// Service
import { BlogService } from '../../providers/blog.service';

// Custom Actions
import {
  BlogActionTypes,
  GetPosts, PutPosts, GetPostDetail, PutPostDetail
} from '../actions/blog.actions';


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
        .map((posts) => {
          return new PutPosts(posts);
        });
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

}
