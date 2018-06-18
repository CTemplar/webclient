// Actions
import { GetMailbox } from "../app-store/actions";

// Angular
import { Component, OnInit, ViewEncapsulation } from "@angular/core";

// Ngxs
import { Select, Store } from "@ngxs/store";

// Rjxs
import { Observable } from "rxjs";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-mailbox",
  templateUrl: "./mailbox.component.pug",
  styleUrls: ["./mailbox.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class MailboxComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {
    // this.store.dispatch(new GetMailbox());
  }
}
