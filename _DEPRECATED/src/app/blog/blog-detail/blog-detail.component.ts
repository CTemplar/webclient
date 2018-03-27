// Angular
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

// Models
import { Comment, Post } from '../shared/blog';

// Services
import { BlogService } from '../shared/blog.service';
import { UsersService } from '../../users/shared/users.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  comment = new Comment;
  error: string;
  post: Post;
  slug: string;

  constructor(
    public blogService: BlogService,
    public usersService: UsersService,
    private route: ActivatedRoute,
  ) {
  }

  addComment() {
    this.comment.post = this.blogService.post.id;
    this.blogService.addComment(this.comment)
      .subscribe(data => {
        this.blogService.comments.push(data);
      }, error => {
        this.error = 'Unable to sign in with provided credentials.';
      });
  }

  replyTo(comment: number) {
    this.comment.reply = comment;
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => this.post = this.blogService.detail(params['slug']));
  }
}
