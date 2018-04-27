// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Rxjs
import { Observable } from 'rxjs/Observable';

// Models
import { Post } from '../../models/blog';

// Services
import { BlogService } from '../../providers/blog.service';

// Store
import { Store } from '@ngrx/store';
import { BlogState } from '../../store/datatypes';
import { selectBlogState } from '../../store/selectors';
import { GetPostDetail } from '../../store/actions/blog.actions';

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

  getBlogState$: Observable<any>;

  constructor(private blogService: BlogService, private route: ActivatedRoute, private store: Store<BlogState>) {
    this.getBlogState$ = this.store.select(selectBlogState);
  }

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.getBlogState$.subscribe((blogState: BlogState) => {
      if (blogState.selectedPost) {
        this.blog = blogState.selectedPost;
      }
    });
    this.getPost();
  }

  getPost() {
    this.store.dispatch(new GetPostDetail(this.slug));
  }
}
