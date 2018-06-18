// Actions
import { PostReset } from "../../../app-store/actions";

// Angular
import { Component, Input } from "@angular/core";

// Bootstrap
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

// Models
import { Recover, Reset } from "../../../app-store/models";

// Ngxs
import { Store } from "@ngxs/store";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-modals-reset",
  templateUrl: "./reset.modal.pug",
  styleUrls: ["./reset.modal.scss"]
})
export class ResetModal {
  @Input() model: Reset;

  constructor(public activeModal: NgbActiveModal, private store: Store) {}

  onReset() {
    this.store.dispatch(new PostReset(false, this.model)).subscribe(() => {
      this.activeModal.close(this.model);
    });
  }
}
