import { Component, OnInit } from '@angular/core';
import { Post, Category } from '../../../store/models';
import { BlogService } from '../../../store/services/blog.service';

@Component({
  selector: 'app-blog-grid',
  templateUrl: './blog-grid.component.html',
  styleUrls: ['./blog-grid.component.scss']
})
export class BlogGridComponent implements OnInit {

  posts: Post[] = [];

  categories: Category[] = [{
    id: 1,
    name: 'NEWS',
    color: '#ffcc00'
    },{
    id: 2,
    name: 'ARTICLE',
    color: '#ffcc00'
  }];

  constructor(private blogService: BlogService) { }

  ngOnInit() {
    this.blogService.getBlogPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

}
