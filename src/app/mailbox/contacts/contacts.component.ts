// Angular
import { Component, OnInit } from "@angular/core";

// Bootstrap
import {
  NgbModal,
  ModalDismissReasons,
  NgbDropdownConfig
} from "@ng-bootstrap/ng-bootstrap";

// Ngxs
import { Store } from "@ngxs/store";

// Rjxs
import { Observable } from "rxjs";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-mailbox-contacts",
  templateUrl: "./contacts.component.pug",
  styleUrls: ["./contacts.component.scss"]
})
export class ContactsComponent implements OnInit {
  isLayoutSplitted: boolean = false;

  constructor(
    private store: Store,
    private modalService: NgbModal,
    config: NgbDropdownConfig
  ) {
    config.autoClose = "outside";
  }

  ngOnInit() {}

  private updateUsersStatus(): void {
    // this.getUsersState$.subscribe((state: UserState) => {
    //   this.userState = state;
    // });
  }

  initSplitContactLayout(): any {
    this.isLayoutSplitted = true;

    if (this.isLayoutSplitted === true) {
      window.document.documentElement.classList.add("no-scroll");
    }
  }

  destroySplitContactLayout(): any {
    this.isLayoutSplitted = false;

    if (this.isLayoutSplitted === false) {
      window.document.documentElement.classList.remove("no-scroll");
    }
  }

  // == Open change password NgbModal
  addUserContactModalOpen(addUserContent) {
    this.modalService.open(addUserContent, {
      centered: true,
      windowClass: "modal-sm users-action-modal"
    });
  }
}
