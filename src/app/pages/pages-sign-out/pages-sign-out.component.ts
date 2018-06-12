// Actions
import { PostSignOut } from "../../app-store/actions";

// Angular
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

// Ngxs
import { Store } from "@ngxs/store";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-pages-sign-out",
  template: ""
})
export class PagesSignOutComponent implements OnInit {
  constructor(private router: Router, private store: Store) {}

  ngOnInit() {
    this.store
      .dispatch(new PostSignOut())
      .subscribe(() => this.router.navigate(["/sign-in"]));
  }
}
