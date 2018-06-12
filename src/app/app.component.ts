// Actions
import { ShowCallToAction } from "./app-store/actions";

// Angular
import { Component, OnInit } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { environment } from "../environments/environment";

// Ngxs
import { Store } from "@ngxs/store";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  host: {
    "(window:onload)": "loadingHandler()",
    "(window:resize)": "onResize()"
  }
})
export class AppComponent implements OnInit {
  isLoading = true;
  isReady = false;
  production = environment.production; // we only enable loading page on production environment... if not, I'm going to be crazy :(

  constructor(public router: Router, private store: Store) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) this.isLoading = true;
      else if (event instanceof NavigationEnd) {
        if (
          ["/sign-in", "/sign-up", "/sign-up/next", "/pricing"].includes(
            this.router.url
          )
        )
          this.store.dispatch(new ShowCallToAction(false));
        else this.store.dispatch(new ShowCallToAction(true));
        this.loadingHandler();
      }
    });
  }

  loadingHandler() {
    if (this.isLoading)
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    else this.isReady = true;
  }

  // REVIEW: WTF? {
  windowIsResized: boolean = false;
  private resizeTimeout: number = null;
  onResize() {
    this.windowIsResized = true;
    if (this.resizeTimeout && this.windowIsResized) {
      // this.windowIsResized = true;
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(
      (() => (this.windowIsResized = false)).bind(this),
      10
    );
  }
  // }
}
