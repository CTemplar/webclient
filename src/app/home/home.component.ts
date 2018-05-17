// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NumberOfColumns, Mode } from '../store/models';

import { selectLoadingState, getRouterState } from '../store/selectors';

// Store
import { Store } from '@ngrx/store';
import { getNewBlogs, getCategories } from '../store/selectors';
import { Post, Category } from '../store/models';

// Rxjs
import { Observable } from 'rxjs/Observable';
import { LoadingState, RouterStateUrl } from '../store/datatypes';

// Actions
import { FinalLoading } from '../store/actions';
import { RelatedBlogLoading, RecentBlogLoading, GetCategories, GetPosts } from '../store/actions';
import { GetRelatedPosts } from '../store/actions';

// Services
import { ngxZendeskWebwidgetService } from 'ngx-zendesk-webwidget';

interface ModeInterface {
  Recent: number;
  Related: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  numberOfColumns: NumberOfColumns;
  mode: Mode;
  posts: Post[] = [];
  blogId?: number;
  category?: number;
  getBlogsLoadingState$: Observable<any>;
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
    private store: Store<any>,
    private _ngxZendeskWebwidgetService: ngxZendeskWebwidgetService
  ) {
    this.getNewBlogState$ = this.store.select(getNewBlogs);
    this.getBlogsLoadingState$ = this.store.select(selectLoadingState);
    this.getRouterState$ = this.store.select(getRouterState);
    this.getCategories$ = this.store.select(getCategories);
    _ngxZendeskWebwidgetService.identify({
      name: '',
      email: ''
    });
    _ngxZendeskWebwidgetService.show();
    this.getCategories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnInit() {
    this.getCategories();
    this.numberOfColumns = NumberOfColumns.Three;
    this.mode = Mode.Recent;
    this.getBlogsLoadingState$.subscribe((loadingState: LoadingState) => {
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
    this.getRouterState$.subscribe((routerStateUrl: RouterStateUrl) => {
      this.currentUrl = routerStateUrl.state.url;
    });
    this.updateRecentState();
  }

  updateRecentState() {
    this.getNewBlogState$.subscribe(blogs => {
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
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.viewChecked = true;
  }
}
