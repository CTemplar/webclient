// Angular
import { Component } from "@angular/core";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-mailbox-header",
  templateUrl: "./header.component.pug",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {
  // Public property of boolean type set false by default
  public menuIsOpened: boolean = false;
  // == Setup click event to toggle mobile menu
  toggleState($event) {
    // click handler
    const bool = this.menuIsOpened;
    this.menuIsOpened = bool === false ? true : false;
  }
}
