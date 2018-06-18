// Angular
import { Component } from "@angular/core";

// Models
// import { Mail } from '../../store/models';

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

  ngOnInit() {
    this.message = this.messages$.find(function(obj) {
      return obj.id === 2;
    });
  }
}
