// Angular
import { ActivatedRoute } from "@angular/router";
import { Component } from "@angular/core";

// Ngxs
import { Select, Store } from "@ngxs/store";

// Rjxs
import { Observable } from "rxjs";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-mailbox-message",
  templateUrl: "./message.component.pug",
  styleUrls: ["./message.component.scss"]
})
export class MessageComponent {
  @Select(state => state.emails.mailbox[0].messages)
  messages$: Observable<any>;
  message: any;

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.messages$.subscribe(messages => {
        this.message = messages.find(message => message.id == params["id"]);
      });
    });
  }
}
