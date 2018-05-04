// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

// Rxjs
import { Observable } from 'rxjs/Observable';

// Bootstrap
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

// Models
import { Post } from '../../models/blog';
import { User } from '../../models/users';

// Services
import { UsersService } from '../../providers/users.service';

// Store
import { Store } from '@ngrx/store';
import { BlogState } from '../../store/datatypes';
import { selectBlogState } from '../../store/selectors';
import { GetPostDetail } from '../../store/actions/blog.actions';
import { selectAuthState } from '../../store/selectors';
import { PostComment } from '../../store/actions/blog.actions';

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


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

  getBlogState$: Observable<any>;
  getAuthState$: Observable<any>;

  constructor(private userService: UsersService, private route: ActivatedRoute, private store: Store<any>,
    private formBuilder: FormBuilder, private modalService: NgbModal) {
    this.getBlogState$ = this.store.select(selectBlogState);
  }

  ngOnInit() {
    this.isActive = this.userService.signedIn();
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.getBlogState$.subscribe((blogState: BlogState) => {
      if (blogState.selectedPost) {
        this.blog = blogState.selectedPost;
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
      'comment': ['', [Validators.required]]
    });
    this.commentForm = this.formBuilder.group({
      'comment': ['', [Validators.required]]
    });
    this.getPost();
  }

  getPost() {
    this.store.dispatch(new GetPostDetail(this.slug));
  }

  openReplyModal(content, id) {
    this.replyId = id;
    this.replyModalRef = this.modalService.open(centered: true, content, {windowClass: 'modal-md'});
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

  postComment (comment) {
    this.isPostedComment = true;
    const body = {text: comment, post: this.blog.id, reply_to: this.replyId};
    this.store.dispatch(new PostComment(body));
  }


}
