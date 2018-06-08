// Angular
import { Component, Input, OnInit } from "@angular/core";

// Ngxs
import { Store } from "@ngxs/store";

// Rjxs
import { Observable } from "rxjs";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-pages-posts-grid",
  templateUrl: "./pages-posts-grid.component.html",
  styleUrls: ["./pages-posts-grid.component.scss"]
})
export class PagesPostsGridComponent implements OnInit {
  @Input("posts") posts = null;
  @Input("columns") columns = 3;

  constructor(private store: Store) {}

  ngOnInit() {
    if (this.posts == null) {
      if (this.columns == 3)
        this.store
          .select(state => state.blog.posts)
          .subscribe(data => (this.posts = data.slice(0, 3)));
      else
        this.store
          .select(state => state.blog.related_posts)
          .subscribe(data => (this.posts = data));
    }
  }
}
