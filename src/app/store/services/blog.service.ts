// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Helpers
// Models
import { Post } from '../models';
// Rxjs
import { map } from 'rxjs/operators';

// Services

@Injectable()
export class BlogService {
  post: Post;

  constructor(private http: HttpClient) {
  }

  getBlogPosts() {
    const url = `/assets/blogs.json`;
    return this.http.get<Post[]>(url)
    .pipe(
      map(data => data['results'])
    );
  }
}
