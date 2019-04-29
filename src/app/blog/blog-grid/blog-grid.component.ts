import { Component, OnInit } from '@angular/core';
import { Category, Post } from '../../store/models';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
  }, {
    id: 2,
    name: 'ARTICLE',
    color: '#ffcc00'
  }];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getBlogPosts().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  getBlogPosts() {
    const url = `/assets/blogs.json`;
    return this.http.get<Post[]>(url)
      .pipe(
        map(data => data['results'])
      );
  }

}
