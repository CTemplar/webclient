// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Models
import { Post } from '../shared/blog';

// Services
import { BlogService } from '../shared/blog.service';

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

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.blogService.findPostwithSlug(this.slug).subscribe((data) => {
      this.blog = data;
    });
  }
}
