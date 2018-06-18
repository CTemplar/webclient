// Actions
import { PostRecover, PostReset, PostSignIn } from "../../app-store/actions";

// Angular
import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

// Bootstrap
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";

// Components
import { ProgressModal, RecoverModal, ResetModal } from "../../shared/modals";

// Models
import { SignIn } from "../../app-store/models";

// Ngxs
import { Store } from "@ngxs/store";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-pages-sign-in",
  templateUrl: "./sign-in.component.pug",
  styleUrls: ["./sign-in.component.scss"]
})
export class SignInComponent {
  activeModal: NgbModalRef;
  inputType = "password";
  model = new SignIn();

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private store: Store
  ) {}

  onRecover() {
    const modalOptions = {
      centered: true,
      windowClass: "modal-md"
    };
    this.activeModal = this.modalService.open(RecoverModal, modalOptions);
    this.activeModal.result.then(model => {
      this.activeModal = this.modalService.open(ResetModal, modalOptions);
      this.activeModal.componentInstance.model = model;
      this.activeModal.result.then(model => {
        this.activeModal = this.modalService.open(ProgressModal, {
          backdrop: "static",
          centered: true,
          keyboard: false,
          windowClass: "modal-md"
        });
        this.store.dispatch(new PostReset(true, model)).subscribe(() => {
          this.activeModal.close();
          this.router.navigate(["/mailbox"]);
        });
      });
    });
  }

  onSignIn() {
    this.store.dispatch(new PostSignIn(this.model)).subscribe(() => {
      this.router.navigate(["/mailbox"]);
    });
  }

  togglePassword() {
    this.inputType = this.inputType == "password" ? "text" : "password";
  }
}
