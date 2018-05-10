// Angular
import { Component, OnInit } from '@angular/core';

// Models
import { Post } from '../../../store/models';

// Rxjs
import { Observable } from 'rxjs/Observable';

// Store
import { Store } from '@ngrx/store';
import { getNewBlogs } from '../../../store/selectors';
import { GetPosts } from '../../../store/actions';


@Component({
  selector: 'app-blog-latest',
  templateUrl: './blog-latest.component.html',
  styleUrls: ['./blog-latest.component.scss']
})
export class BlogLatestComponent implements OnInit {
  posts: Post[] = [];
  getBlogState$: Observable<any>;
  constructor(
    private store: Store<any>
  ) {
    this.getBlogState$ = this.store.select(getNewBlogs);
  }

  ngOnInit() {
    this.getBlogState$.subscribe(blogs => {
      if (blogs.length) {
        blogs.map((post: Post) => {
          post.isLoaded = false;
          if (post.text.length > 500) {
            post.excerpt = post.text.substring(0, 500) + '...';
          } else {
            post.excerpt = post.text;
          }
        });
        this.posts = blogs.slice(0, 3);
      }
    });
    if (!this.posts.length) {
      this.getPosts();
    }
  }

  getPosts() {
    this.store.dispatch(new GetPosts({limit: 7, offset: 0}));
  }

}
