// Angular
import { Component } from "@angular/core";

// Bootstrap
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-pages-sign-in",
  templateUrl: "./pages-sign-in.component.html",
  styleUrls: ["./pages-sign-in.component.scss"]
})
export class PagesSignInComponent {
  activeModal: any;
  errorMessage: string;
  inputType = "password";

  constructor(private modalService: NgbModal) {}

  signIn() {
    
  }

  openModal(template) {
    this.activeModal = this.modalService.open(template, {
      centered: true,
      windowClass: "modal-md"
    });
  }

  resetPassword(data) {
    this.activeModal.close();
  }

  togglePassword() {
    this.inputType = this.inputType == "password" ? "text" : "password";
  }
}
