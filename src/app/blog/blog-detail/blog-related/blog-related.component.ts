// Angular
import { Component, OnInit, Input } from '@angular/core';

// Models
import { Post } from '../../../models/blog';

// Rxjs
import { Observable } from 'rxjs/Observable';

// Store
import { Store } from '@ngrx/store';
import { getRelatedBlogs } from '../../../store/selectors';
import { GetRelatedPosts } from '../../../store/actions/blog.actions';

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-blog-related',
  templateUrl: './blog-related.component.html',
  styleUrls: ['./blog-related.component.scss']
})
export class BlogRelatedComponent implements OnInit {
  @Input('category') category: number;
  @Input('blogId') blogId: number;
  posts: Post[] = [];
  getRelatedBlogsState$: Observable<any>;

  constructor(private store: Store<any>) {
    this.getRelatedBlogsState$ = this.store.select(getRelatedBlogs);
  }

  ngOnInit() {
    this.getRelatedBlogsState$.subscribe(blogs => {
      if (blogs.length && blogs[0].category.id === this.category) {
        this.posts = blogs.filter((post: Post) => {
          post.isloaded = false;
          if (post.text.length > 500) {
            post.excerpt = post.text.substring(0, 500) + '...';
          } else {
            post.excerpt = post.text;
          }
          if (post.id !== this.blogId) {
            return true;
          }
          return false;
        });
      }
    });
    if (!this.posts.length || this.posts[0].category.id !== this.category) {
      this.getRelatedPosts();
    }
  }

  getRelatedPosts() {
    this.store.dispatch(new GetRelatedPosts(this.category));
  }

}
