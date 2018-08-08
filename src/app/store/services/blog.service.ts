// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Helpers
import { apiHeaders, apiUrl } from '../../shared/config';

// Models
import { Comment, Post, Category } from '../models';

// Rxjs
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

// Services
import { SharedService } from './shared.service';

@Injectable()
export class BlogService {
  comments: Comment[];
  post: Post;
  posts: Post[];

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
  ) {}

  addComment(body): Observable<Comment> {
    const url = `${apiUrl}blog/comments/`;
    return this.http.post<Comment>(url, body, apiHeaders());
  }

  getPosts(limit = 500, offset = 0): Observable<Post[]> {
    const url = `${apiUrl}blog/posts/?limit=${limit}&offset=${offset}`;
    return this.http.get<Post[]>(url)
      .pipe(
        map(data => data['results'])
      );
  }

  cache() {
    this.getPosts().subscribe();
  }

  getPostwithSlug(slug) {
    const url = `${apiUrl}blog/posts/${slug}`;
    return this.http.get<Post>(url);
  }

  getRelatedPosts(cateogry) {
    const url = `${apiUrl}blog/posts/?category=${cateogry}`;
    return this.http.get<Post>(url)
    .pipe(
      map(data => data['results'])
    );
  }

  getCategories(limit = 500, offset = 0): Observable<Category[]> {
    const url = `${apiUrl}blog/categories/`;
    return this.http.get<Category[]>(url)
    .pipe(
      map(data => data['results'])
    );
  }

  getBlogPosts() {
    const url = `/assets/blogs.json`;
    return this.http.get<Post[]>(url)
    .pipe(
      map(data => data['results'])
    );
  }
}
