// Angular
import { Component, OnInit } from '@angular/core';

// Models
import { Post } from '../../models/blog';

// Rxjs
import { Observable } from 'rxjs/Observable';

// Services
import { BlogService } from '../../providers/blog.service';

// Store
import { Store } from '@ngrx/store';
import { BlogState } from '../../store/datatypes';
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

  getBlogState$: Observable<any>;

  constructor(
    private blogService: BlogService, private store: Store<any>
  ) {
    this.getBlogState$ = this.store.select(getNewBlogs);
  }

  ngOnInit() {
    this.getBlogState$.subscribe(blogs => {
      this.sortPosts(blogs);
    });
    if (!this.posts.length) {
      this.getPosts();
    }
  }

  getPosts() {
    this.store.dispatch(new GetPosts({limit: this.positionCount, offset: this.postPosition}));
  }

  sortPosts(newPosts) {
    newPosts.map((post: Post) => {
      post.isloaded = false;
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
