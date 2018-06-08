// Actions
import { GetPost } from "../../app-store/actions";

// Angular
import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";

// Ngxs
import { Select, Store } from "@ngxs/store";

// Rjxs
import { Observable } from "rxjs";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-pages-post",
  templateUrl: "./pages-post.component.html",
  styleUrls: ["./pages-post.component.scss"]
})
export class PagesPostComponent implements OnInit {
  @Select(state => state.blog.post)
  post$: Observable<any>;

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit() {
    this.route.params.subscribe(params =>
      this.store.dispatch(new GetPost(params["slug"]))
    );
  }
}
