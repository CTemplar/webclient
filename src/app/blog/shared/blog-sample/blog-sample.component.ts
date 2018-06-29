// Angular
import { Component, Input, OnInit } from '@angular/core';
// Models
import { Category, Mode, NumberOfColumns, Post } from '../../../store/models';
// Rxjs
import { Observable } from 'rxjs/Observable';
// Store
import { Store } from '@ngrx/store';
import { AppState, BlogState } from '../../../store/datatypes';
import { getNewBlogs, getRelatedBlogs } from '../../../store/selectors';
import { GetPosts, GetRelatedPosts, RecentBlogLoading, RelatedBlogLoading } from '../../../store/actions';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';

interface ModeInterface {
  Recent: number;
  Related: number;
}

@TakeUntilDestroy()
@Component({
  selector: 'app-blog-sample',
  templateUrl: './blog-sample.component.html',
  styleUrls: ['./blog-sample.component.scss']
})
export class BlogSampleComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  @Input('category') category?: number;
  @Input('blogId') blogId?: number;
  @Input('numberOfColumns') numberOfColumns: NumberOfColumns;
  @Input('mode') mode: Mode;
  @Input('posts') posts: Post[];

  isLoading: boolean;
  getRelatedBlogsState$: Observable<any>;
  getNewBlogState$: Observable<any>;
  modeObj: ModeInterface = {
    Recent: 0,
    Related: 1
  };
  categories: Category[];

  constructor(private store: Store<AppState>) {
    this.getRelatedBlogsState$ = this.store.select(getRelatedBlogs);
    this.getNewBlogState$ = this.store.select(getNewBlogs);
    this.store.select(state => state.blog).takeUntil(this.destroyed$)
      .subscribe((state: BlogState) => {
        this.categories = state.categories;
      });
  }

  ngOnInit() {
    this.isLoading = true;
    if (this.mode === Mode.Recent) {
    } else if (this.mode === Mode.Related) {
      // this.updateRelatedState();
    }
  }

  updateRelatedState() {
    this.getRelatedBlogsState$.subscribe(blogs => {
      if (blogs.length && blogs[0].category.id === this.category) {
        this.posts = blogs
          .filter((post: Post) => {
            post.isLoaded = false;
            if (post.text.length > 500) {
              post.excerpt = post.text.substring(0, 500) + '...';
            } else {
              post.excerpt = post.text;
            }
            if (post.id !== this.blogId) {
              return true;
            }
            return false;
          })
          .slice(0, this.numberOfColumns);
        this.store.dispatch(new RelatedBlogLoading({ loadingState: false }));
      }
    });
    if (!this.posts.length || this.posts[0].category !== this.category) {
      this.getRelatedPosts();
      this.store.dispatch(new RelatedBlogLoading({ loadingState: false }));
    }
  }

  getRelatedPosts() {
    this.store.dispatch(new GetRelatedPosts(this.category));
  }

  getPosts() {
    this.store.dispatch(new GetPosts({ limit: 7, offset: 0 }));
  }

  ngOnDestroy() {
    this.store.dispatch(new RecentBlogLoading({ loadingState: true }));
    this.store.dispatch(new RelatedBlogLoading({ loadingState: true }));
  }
}
