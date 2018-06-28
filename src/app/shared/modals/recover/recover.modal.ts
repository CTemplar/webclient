// Actions
import { PostRecover } from "../../../app-store/actions";

// Angular
import { Component } from "@angular/core";

// Bootstrap
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

// Models
import { Recover } from "../../../app-store/models";

// Ngxs
import { Store } from "@ngxs/store";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-modals-recover",
  templateUrl: "./recover.modal.pug",
  styleUrls: ["./recover.modal.scss"]
})
export class RecoverModal {
  model = new Recover();

  constructor(public activeModal: NgbActiveModal, private store: Store) {}

  onRecover() {
    this.store.dispatch(new PostRecover(this.model)).subscribe(() => {
      this.activeModal.close(this.model);
    });
  }
}
