// Angular
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Category, Mode, NumberOfColumns, Post } from '../store/models';

import { getCategories, getNewBlogs, getRouterState } from '../store/selectors';
// Store
import { Store } from '@ngrx/store';
// Rxjs
import { Observable } from 'rxjs/Observable';
import { AppState, LoadingState, RouterStateUrl } from '../store/datatypes';
// Actions
import { FinalLoading, GetCategories, GetPosts, GetRelatedPosts, RecentBlogLoading } from '../store/actions';
// Services
import { ngxZendeskWebwidgetService } from 'ngx-zendesk-webwidget';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';

interface ModeInterface {
  Recent: number;
  Related: number;
}

@TakeUntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewChecked {
  readonly destroyed$: Observable<boolean>;

  numberOfColumns: NumberOfColumns;
  mode: Mode;
  posts: Post[] = [];
  blogId?: number;
  category?: number;
  getRouterState$: Observable<any>;
  currentUrl: String;
  viewChecked: boolean = false;
  modeObj: ModeInterface = {
    Recent: 0,
    Related: 1
  };

  getNewBlogState$: Observable<any>;
  getCategories$: Observable<any>;
  categories: Category[];

  constructor(
    private store: Store<AppState>,
    private _ngxZendeskWebwidgetService: ngxZendeskWebwidgetService
  ) {
    this.getNewBlogState$ = this.store.select(getNewBlogs);
    this.getRouterState$ = this.store.select(getRouterState);
    this.getCategories$ = this.store.select(getCategories);
    _ngxZendeskWebwidgetService.identify({
      name: '',
      email: ''
    });
    _ngxZendeskWebwidgetService.show();
    this.getCategories$.takeUntil(this.destroyed$).subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnInit() {
    this.getCategories();
    this.numberOfColumns = NumberOfColumns.Three;
    this.mode = Mode.Recent;
    this.store.select(state => state.loading).takeUntil(this.destroyed$).subscribe((loadingState: LoadingState) => {
      if (loadingState.RecentBlogLoading === false) {
        if (
          this.currentUrl === '/' &&
          loadingState.Loading === true &&
          this.viewChecked
        ) {
          this.store.dispatch(new FinalLoading({ loadingState: false }));
        }
      }
    });
    this.getRouterState$.takeUntil(this.destroyed$).subscribe((routerStateUrl: RouterStateUrl) => {
      this.currentUrl = routerStateUrl.state.url;
    });
    this.updateRecentState();
  }

  updateRecentState() {
    this.getNewBlogState$.takeUntil(this.destroyed$).subscribe(blogs => {
      if (blogs.length) {
        blogs.map((post: Post) => {
          post.isLoaded = false;
          if (post.text.length > 500) {
            post.excerpt = post.text.substring(0, 500) + '...';
          } else {
            post.excerpt = post.text;
          }
          if (this.categories.length - 1 < post.category) {
            console.log(this.categories.length, post.category);
            this.getCategories();
          }
        });
        this.posts = blogs.slice(0, this.numberOfColumns);
        setTimeout(() =>
          this.store.dispatch(new RecentBlogLoading({ loadingState: false }))
        );
      }
    });
    if (!this.posts.length) {
      this.getPosts();
    }
  }

  getPosts() {
    this.store.dispatch(new GetPosts({ limit: 7, offset: 0 }));
  }

  getRelatedPosts() {
    this.store.dispatch(new GetRelatedPosts(this.category));
  }

  getCategories() {
    this.store.dispatch(new GetCategories({}));
  }

  ngOnDestroy() {
    this.store.dispatch(new FinalLoading({ loadingState: true }));
  }

  ngAfterViewChecked() {
    this.viewChecked = true;
  }
}
