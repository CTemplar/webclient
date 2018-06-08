// Angular
import { Component, OnInit } from "@angular/core";

// Ngxs
import { Select } from "@ngxs/store";

// Rjxs
import { Observable } from "rxjs";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-pages-posts",
  styleUrls: ["pages-posts.component.scss"],
  templateUrl: "./pages-posts.component.html"
})
export class PagesPostsComponent implements OnInit {
  @Select(state => state.blog.posts)
  posts$: Observable<any>;
  bigPost: any;
  pageEnd = 6;
  pageMax = false;
  pageStart = 0;
  pagePosts: any;
  posts: any;
  postsMax: number;

  ngOnInit() {
    this.posts$.subscribe(data => {
      this.bigPost = data[0];
      this.posts = data.slice(1);
      this.postsMax = data.length;
      this.pagePosts = data.slice(this.pageStart, this.pageEnd);
      if (this.pageEnd >= this.postsMax) this.pageMax = true;
    });
  }

  getMorePosts() {
    this.pageStart += 6;
    this.pageEnd += 6;
    if (this.pageEnd >= this.postsMax) this.pageMax = true;
    this.pagePosts = this.pagePosts.concat(
      this.posts.slice(this.pageStart, this.pageEnd)
    );
  }
}
