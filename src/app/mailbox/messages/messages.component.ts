// Angular
import { Component, OnInit } from "@angular/core";

// Models
// import { Mail } from '../../store/models';

// Rxjs
import { Observable } from "rxjs";

// Store
import { Store } from "@ngxs/store";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-mailbox-messages",
  templateUrl: "./messages.component.pug",
  styleUrls: ["./messages.component.scss"]
})
export class MessagesComponent implements OnInit {
  // mails: Mail[];

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;

  constructor(private store: Store) {}

  ngOnInit() {
    // this.getMailsState$.subscribe((mails) => {
    //   this.mails = mails;
    // });
    //
    // this.getMails();
  }

  getMails() {
    // this.store.dispatch(new GetMails({limit: 1000, offset: 0}));
  }

  // == Show mail compose modal
  // == Setup click event to toggle mobile menu
  hideMailComposeModal() {
    // click handler
    const bool = this.isComposeVisible;
    this.isComposeVisible = false;
  }
}
