// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Rxjs
import { Observable } from 'rxjs/Observable';
// Bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Models
import { Category, Mode, NumberOfColumns, Post } from '../../store/models';
// Services
import { UsersService } from '../../store/services';
import { FinalLoading, GetCategories, GetPostDetail, GetRelatedPosts, PostComment, RelatedBlogLoading } from '../../store/actions';
// Store
import { Store } from '@ngrx/store';
import { AppState, AuthState, BlogState, LoadingState, RouterStateUrl } from '../../store/datatypes';
import { getCategories, getRelatedBlogs, getRouterState } from '../../store/selectors';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';

@TakeUntilDestroy()
@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  slug: string;
  blog: Post;
  relatedPosts: Post[] = [];
  posts: Post[] = [];
  isLoaded: boolean = false;
  isActive: boolean = true;
  replyForm: FormGroup;
  commentForm: FormGroup;
  replyModalRef: any;
  replyId: number;
  isPostedComment: boolean = false;
  categories: Category[];
  currentUrl: String = '';
  numberOfColumns: NumberOfColumns;
  mode: Mode;
  isReplyFormShown: boolean = false;

  getCategories$: Observable<any>;
  getRelatedBlogsState$: Observable<any>;
  getRouterState$: Observable<any>;

  constructor(
    private userService: UsersService,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.getCategories$ = this.store.select(getCategories);
    this.getRelatedBlogsState$ = this.store.select(getRelatedBlogs);
    this.getRouterState$ = this.store.select(getRouterState);

    this.getCategories$.takeUntil(this.destroyed$).subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnInit() {
    this.numberOfColumns = NumberOfColumns.Two;
    this.mode = Mode.Related;
    this.getCategories();
    // this.isActive = this.userService.signedIn();
    this.updateUserAuthStatus();
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.store.select(state => state.blog).takeUntil(this.destroyed$)
      .subscribe((blogState: BlogState) => {
        if (blogState.selectedPost && this.blog !== blogState.selectedPost) {
          this.blog = blogState.selectedPost;
          if (this.categories.length - 1 < this.blog.category) {
            this.getCategories();
          }
          this.updateRelatedState();
        }
        if (blogState.relatedPosts) {
          this.relatedPosts = blogState.relatedPosts;
        }
        if (blogState.errorMessage === 'success' && this.isPostedComment) {
          this.replyForm.reset();
          this.commentForm.reset();
          this.isPostedComment = false;
          this.replyId = null;
          this.getPost();
        }
      });

    this.store.select(state => state.loading).takeUntil(this.destroyed$)
      .subscribe((loadingState: LoadingState) => {
        if (
          loadingState.RelatedBlogLoading === false &&
          loadingState.Loading === true
        ) {
          this.store.dispatch(new FinalLoading({ loadingState: false }));
        }
      });

    this.getRouterState$.takeUntil(this.destroyed$).subscribe((routerStateUrl: RouterStateUrl) => {
      // console.log(routerStateUrl.state)
      if (this.currentUrl !== '' && this.currentUrl !== routerStateUrl.state.url && routerStateUrl.state.url.includes('/blog/')) {
        this.store.dispatch(new RelatedBlogLoading({ loadingState: true }));
        // window.location.reload();
      }
      this.currentUrl = routerStateUrl.state.url;
    });
    this.replyForm = this.formBuilder.group({
      comment: ['', [Validators.required]]
    });
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]]
    });
    this.getPost();
  }

  getPost() {
    this.store.dispatch(new GetPostDetail(this.slug));
  }

  updateRelatedState() {
    this.getRelatedBlogsState$.takeUntil(this.destroyed$).subscribe(blogs => {
      if (blogs.length && blogs[0].category === this.blog.category) {
        this.posts = blogs
          .filter((post: Post) => {
            post.isLoaded = false;
            if (post.text.length > 500) {
              post.excerpt = post.text.substring(0, 500) + '...';
            } else {
              post.excerpt = post.text;
            }
            if (post.id !== this.blog.id) {
              return true;
            }
            return false;
          })
          .slice(0, this.numberOfColumns);
        this.store.dispatch(new RelatedBlogLoading({ loadingState: false }));
      }
    });
    if (!this.posts.length || this.posts[0].category !== this.blog.category) {
      this.getRelatedPosts();
      this.store.dispatch(new RelatedBlogLoading({ loadingState: false }));
    }
  }

  getRelatedPosts() {
    this.store.dispatch(new GetRelatedPosts(this.blog.category));
  }

  openReplyModal(content, id) {
    this.updateUserAuthStatus();
    if (this.isActive) {
      this.replyId = id;
      this.replyModalRef = this.modalService.open(content, {
        centered: true,
        windowClass: 'modal-md'
      });
    }
  }

  toggleReplyForm() {
      this.isReplyFormShown = true;
  }

  replyComment(body) {
    if (this.replyForm.valid) {
      this.postComment(body.comment);
      this.replyModalRef.close();
    }
  }

  addComment(body) {
    if (this.commentForm.valid) {
      this.postComment(body.comment);
    }
  }

  postComment(comment) {
    if (this.isActive) {
      this.isPostedComment = true;
      const body = {
        text: comment,
        post: this.blog.id,
        reply_to: this.replyId
      };
      this.store.dispatch(new PostComment(body));
    } else {
    }
  }

  private updateUserAuthStatus(): void {
    this.store.select(state => state.auth).takeUntil(this.destroyed$)
      .subscribe((authState: AuthState) => {
        if (authState.user && authState.user.membership) {
          this.isActive = authState.isAuthenticated;
        }
      });
  }

  getCategories() {
    this.store.dispatch(new GetCategories({}));
  }

  ngOnDestroy() {
    this.store.dispatch(new FinalLoading({ loadingState: true }));
  }
}
