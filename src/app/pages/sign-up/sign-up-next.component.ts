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
  templateUrl: "./sign-up-next.component.pug",
  styleUrls: ["./sign-up-next.component.scss"]
})
export class SignUpNextComponent {
  activeModal: NgbModalRef;
  inputType = "password";
  model = new SignUp();

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private store: Store
  ) {}

  onSignUp() {}
  
  // onSignUp() {
  //   this.activeModal = this.modalService.open(ProgressModal, {
  //     backdrop: "static",
  //     centered: true,
  //     keyboard: false,
  //     windowClass: "modal-md"
  //   });
  //   this.store.dispatch(new PostSignUp(false, this.model)).subscribe(() => {
  //     this.activeModal.close();
  //     this.activeModal = this.modalService.open(CaptchaModal, {
  //       backdrop: "static",
  //       centered: true,
  //       keyboard: false,
  //       windowClass: "modal-md"
  //     });
  //     this.activeModal.result.then(result => {
  //       this.model.recaptcha = result;
  //       this.store.dispatch(new PostSignUp(true, this.model)).subscribe(() => {
  //         this.router.navigate(["/mailbox"]);
  //       });
  //     });
  //   });
  // }

  togglePassword() {
    this.inputType = this.inputType == "password" ? "text" : "password";
  }
}
