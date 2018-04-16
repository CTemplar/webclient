// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  id: string;
  blog: Post;

  constructor(private blogService: BlogService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.blog = this.blogService.findPostwithId(this.id);
    console.log(this.blog);
  }

}
