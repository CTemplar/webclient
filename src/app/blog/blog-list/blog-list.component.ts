// Angular
import { Component } from '@angular/core';

// Models
import { Post } from '../shared/blog';

// Services
import { BlogService } from '../shared/blog.service';

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent {
  featured: Post;

  constructor(
    private blogService: BlogService,
  ) {
    // this.featured = this.blogService.featured();
  }
}
