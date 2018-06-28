// Angular
import { Component, OnInit } from "@angular/core";

// Ngxs
import { Select, Store } from "@ngxs/store";

// Rjxs
import { Observable } from "rxjs";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-mailbox-messages",
  templateUrl: "./messages.component.pug",
  styleUrls: ["./messages.component.scss"]
})
export class MessagesComponent implements OnInit {
  @Select(state => state.emails.mailbox[0].messages)
  messages$: Observable<any>;

  constructor(private store: Store) {}

  ngOnInit() {}
}
