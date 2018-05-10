// Angular
import { Component, OnInit } from '@angular/core';

// Models
import { Post } from '../../core/models';

// Rxjs
import { Observable } from 'rxjs/Observable';

// Services
import { BlogService } from '../../core/providers';
import { SpinnerService } from '../../shared/spinner/services/spinner.service';

// Store
import { Store } from '@ngrx/store';
import { getNewBlogs } from '../../store/selectors';
import { GetPosts } from '../../store/actions/blog.actions';


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  posts: Post[] = [];
  firstPost: Post;
  postPosition: number = 0;
  positionCount: number = 7;
  isPostsLoading: boolean = false;

  getBlogState$: Observable<any>;

  constructor(
    private blogService: BlogService,
    private store: Store<any>,
    private spinnerService: SpinnerService
  ) {
    this.getBlogState$ = this.store.select(getNewBlogs);
  }

  ngOnInit() {
    this.getBlogState$.subscribe(blogs => {
      if (blogs.length) {
        this.sortPosts(blogs);
      } else {
        this.getPosts();
      }
    });
  }

  getPosts() {
    console.log(this.positionCount);
    console.log(this.postPosition);
    this.isPostsLoading = true;
    this.store.dispatch(new GetPosts({ limit: this.positionCount, offset: this.postPosition }));
  }

  sortPosts(newPosts) {
    this.isPostsLoading = false;
    console.log(newPosts);
    newPosts.map((post: Post) => {
      post.isLoaded = false;
      if (post.text.length > 500) {
        post.excerpt = post.text.substring(0, 500) + '...';
      } else {
        post.excerpt = post.text;
      }
    });
    if (!this.postPosition) {
      this.firstPost = newPosts[0];
      this.posts = newPosts.slice(1);
      this.setParmsofPosts(newPosts.length, -1);
    } else {
      this.posts = this.posts.concat(newPosts);
      this.setParmsofPosts(newPosts.length, 0);
    }

  }

  setParmsofPosts(length, isFirst) {
    this.postPosition += length;
    if ((length - isFirst) < 6) {
      this.positionCount = 12 - length + isFirst;
    } else {
      this.positionCount = 6;
    }
  }
}
