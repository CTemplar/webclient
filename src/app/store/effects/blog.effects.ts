import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { tap } from 'rxjs/operators';

import { BlogService } from '../../providers/blog.service';
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


  // @Effect({ dispatch: false })
  // LogInSuccess: Observable<any> = this.actions.pipe(
  //   ofType(AuthActionTypes.LOGIN_SUCCESS),
  //   tap((user) => {
  //     localStorage.setItem('token', user.payload.token);
  //     // this.router.navigateByUrl('/');
  //   })
  // );

  // @Effect({ dispatch: false })
  // LogInFailure: Observable<any> = this.actions.pipe(
  //   ofType(AuthActionTypes.LOGIN_FAILURE)
  // );

  // @Effect()
  // SignUp: Observable<any> = this.actions
  //   .ofType(AuthActionTypes.SIGNUP)
  //   .map((action: SignUp) => action.payload)
  //   .switchMap(payload => {
  //     return this.authService.signUp(payload.username, payload.password)
  //       .map((user) => {
  //         return new SignUpSuccess({token: user.token, email: payload.email});
  //       })
  //       .catch((error) => {
  //         return Observable.of(new SignUpFailure({ error: error }));
  //       });
  //   });

  // @Effect({ dispatch: false })
  // SignUpSuccess: Observable<any> = this.actions.pipe(
  //   ofType(AuthActionTypes.SIGNUP_SUCCESS),
  //   tap((user) => {
  //     localStorage.setItem('token', user.payload.token);
  //     // this.router.navigateByUrl('/');
  //   })
  // );

  // @Effect({ dispatch: false })
  // SignUpFailure: Observable<any> = this.actions.pipe(
  //   ofType(AuthActionTypes.SIGNUP_FAILURE)
  // );

  // @Effect({ dispatch: false })
  // public LogOut: Observable<any> = this.actions.pipe(
  //   ofType(AuthActionTypes.LOGOUT),
  //   tap((user) => {
  //     localStorage.removeItem('token');
  //   })
  // );

  // @Effect({ dispatch: false })
  // GetStatus: Observable<any> = this.actions
  //   .ofType(AuthActionTypes.GET_STATUS)
  //   .switchMap(payload => {
  //     return this.authService.getStatus();
  //   });

}
