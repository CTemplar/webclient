// Angular
import { Component } from "@angular/core";

// Bootstrap
import { NgbModal, NgbDropdownConfig } from "@ng-bootstrap/ng-bootstrap";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-mailbox-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent {
  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;

  constructor(private modalService: NgbModal, config: NgbDropdownConfig) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = "outside";
  }

  // == Open NgbModal
  open(content) {
    this.modalService.open(content, {
      centered: true,
      windowClass: "modal-sm"
    });
  }

  // == Show mail compose modal
  // == Setup click event to toggle mobile menu
  showMailComposeModal() {
    // click handler
    const bool = this.isComposeVisible;
    this.isComposeVisible = true;
  }

  // == Show mail compose modal
  // == Setup click event to toggle mobile menu
  hideMailComposeModal() {
    // click handler
    const bool = this.isComposeVisible;
    this.isComposeVisible = false;
  }
}
