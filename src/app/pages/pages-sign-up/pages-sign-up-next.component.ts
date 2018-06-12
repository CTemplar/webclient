// Actions
import { PostSignUp } from "../../app-store/actions";

// Angular
import { Component } from "@angular/core";
import { Router } from "@angular/router";

// Bootstrap
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";

// Components
import { CaptchaModal, ProgressModal } from "../../shared/modals";

// Models
import { SignUp } from "../../app-store/models";

// Ngxs
import { Store } from "@ngxs/store";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-pages-sign-up-next",
  templateUrl: "./pages-sign-up-next.component.html",
  styleUrls: ["./pages-sign-up-next.component.scss"]
})
export class PagesSignUpNextComponent {
  activeModal: NgbModalRef;
  inputType = "password";
  model = new SignUp();

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private store: Store
  ) {}

  onSignUp() {
    const modalOptions = {
      centered: true,
      keyboard: false,
      windowClass: "modal-md"
    };
    this.activeModal = this.modalService.open(ProgressModal, modalOptions);
    this.store.dispatch(new PostSignUp(false, this.model)).subscribe(() => {
      this.activeModal.close();
      this.activeModal = this.modalService.open(CaptchaModal, modalOptions);
      this.activeModal.result.then(result => {
        this.model.recaptcha = result;
        this.store.dispatch(new PostSignUp(true, this.model)).subscribe(() => {
          this.router.navigate(["/mailbox"]);
        });
      });
    });
  }

  togglePassword() {
    this.inputType = this.inputType == "password" ? "text" : "password";
  }
}
