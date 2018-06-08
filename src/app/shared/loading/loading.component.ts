// Angular
import { Component, OnInit } from "@angular/core";

// Helpers
import { quotes } from "./loading-quotes";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"]
})
export class LoadingComponent implements OnInit {
  quote: any;

  ngOnInit() {
    this.quote = quotes[Math.floor(Math.random() * 5)];
  }
}
