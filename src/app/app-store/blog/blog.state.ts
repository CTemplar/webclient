// Actions
import { GetPost, GetPosts, GetRelatedPosts } from "../actions";

// Models
import { Comment, Post } from "../models";

// Ngrx
import { Action, NgxsOnInit, State, StateContext } from "@ngxs/store";

// Rxjs
import { tap } from "rxjs/operators";

// Services
import { BlogService } from "../services";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface BlogStateModel {
  post: Post;
  posts: Post[];
  related_posts: Post[];
}

@State<BlogStateModel>({
  name: "blog",
  defaults: {
    post: null,
    posts: null,
    related_posts: null
  }
})
export class BlogState implements NgxsOnInit {
  constructor(private blogService: BlogService) {}

  ngxsOnInit(ctx: StateContext<BlogStateModel>) {
    ctx.dispatch(new GetPosts());
  }

  @Action(GetPost)
  getPost(ctx: StateContext<BlogStateModel>, { slug }: GetPost) {
    return this.blogService.getPost(slug).pipe(
      tap(data => {
        ctx.patchState({ post: data });
        ctx.dispatch(new GetRelatedPosts(data.category));
      })
    );
  }

  @Action(GetPosts)
  getPosts(ctx: StateContext<BlogStateModel>) {
    return this.blogService
      .getPosts()
      .pipe(tap(data => ctx.patchState({ posts: data })));
  }

  @Action(GetRelatedPosts)
  getRelatedPosts(
    ctx: StateContext<BlogStateModel>,
    { category }: GetRelatedPosts
  ) {
    const data = ctx
      .getState()
      .posts.filter(post => category == post.category)
      .slice(0, 2);
    return ctx.patchState({ related_posts: data });
  }

  // @Selector([RouterState.state])
  // static details(state: BlogStateModel, route) {
  //   return state.posts[route.params.slug];
  // }
}
