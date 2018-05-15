// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// Rxjs
import { Observable } from 'rxjs/Observable';

// Bootstrap
import {NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Models
import { Post, Mode, NumberOfColumns, Category } from '../../store/models';

// Services
import { UsersService } from '../../store/services';
import { RelatedBlogLoaded, RelatedBlogLoading, FinalLoading } from '../../store/actions';

// Store
import { Store } from '@ngrx/store';
import { BlogState, AuthState } from '../../store/datatypes';
import { selectBlogState, getCategories } from '../../store/selectors';
import { GetPostDetail, GetCategories } from '../../store/actions';
import { selectAuthState } from '../../store/selectors';
import { PostComment } from '../../store/actions';


@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  slug: string;
  blog: Post;
  isLoaded: boolean = false;
  isActive: boolean = false;
  replyForm: FormGroup;
  commentForm: FormGroup;
  replyModalRef: any;
  replyId: number;
  isPostedComment: boolean = false;
  getCategories$: Observable<any>;
  categories: Category[];

  numberOfColumns: NumberOfColumns;
  mode: Mode;

  getBlogState$: Observable<any>;
  getAuthState$: Observable<any>;

  constructor(
    private userService: UsersService,
    private route: ActivatedRoute,
    private store: Store<any>,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.getBlogState$ = this.store.select(selectBlogState);
    this.getAuthState$ = this.store.select(selectAuthState);
    this.getCategories$ = this.store.select(getCategories);
    this.getCategories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnInit() {
    this.numberOfColumns = NumberOfColumns.Two;
    this.mode = Mode.Related;

    // this.isActive = this.userService.signedIn();
    this.updateUserAuthStatus();
    this.updateRelatedBlogLoadingStatus();
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.getBlogState$.subscribe((blogState: BlogState) => {
      if (blogState.selectedPost) {
        this.blog = blogState.selectedPost;
        if (this.categories.length - 1 < this.blog.category ) {
          this.store.dispatch(new GetCategories({}));
        }
      }
      if (blogState.errorMessage === 'success' && this.isPostedComment) {
        this.replyForm.reset();
        this.commentForm.reset();
        this.isPostedComment = false;
        this.replyId = null;
        this.getPost();
      }
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
    setTimeout(() => this.store.dispatch(new FinalLoading({ loadingState: false })));
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
  private updateRelatedBlogLoadingStatus(): void {
    this.store.dispatch(new RelatedBlogLoading({}));
  }
  private updateUserAuthStatus(): void {
    this.getAuthState$.subscribe((authState: AuthState) => {
      if (authState.user && authState.user.membership) {
        this.isActive = authState.isAuthenticated;
      }
    });
  }
}
