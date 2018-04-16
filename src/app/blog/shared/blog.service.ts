// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Helpers
import { apiHeaders, apiUrl } from '../../shared/config';

// Models
import { Comment, Post } from './blog';

// Rxjs
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';

// Services
import { SharedService } from '../../shared/shared.service';

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


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
        map(data => data['results']),
        tap(data => {
          if (this.posts) {
            this.posts = this.posts.concat(data);
          } else {
            this.posts = data;
          }
        }),
      );
  }

  getComments(id: number): Observable<Comment[]> {
    const url = `${apiUrl}blog/comments/?limit=500&post=${id}`;
    return this.http.get<Comment[]>(url)
      .pipe(
        map(data => data['results']),
        tap(data => this.comments = data),
      );
  }

  cache() {
    this.getPosts().subscribe();
  }

  detail(slug: string) {
    this.post = this.posts.find(item => item.slug === slug);
    this.getComments(this.post.id).subscribe();
    return this.post;
  }

  featured() {
    return this.posts.find(item => item.featured === true);
  }

  list(page: number, limit: number) {
    const end = (page === NaN) ? limit : limit * page;
    const start = end - limit;
    return this.posts.slice(start, end);
  }

  findPostwithId(id) {
    return this.posts.find(item => item.id == id);
  }
}
