// Angular
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

// Models
import { Post } from '../blog';

// Services
import { BlogService } from "../blog.service";

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-blog-latest',
  templateUrl: './blog-latest.component.html',
  styleUrls: ['./blog-latest.component.scss']
})
export class BlogLatestComponent implements OnInit {
  @Input() columns = 'three';
  @Input() limit = 6;
  page = 1;
  page_max: number;
  @Input() pagination = false;
  posts: Post[];

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        if (!Number.isNaN(+params['page'])) {
          this.page = +params['page'];
          this.page_max = Math.ceil(this.blogService.posts.length / this.limit);
        }
        this.posts = this.blogService.list(this.page, this.limit);
      });
  }
}
