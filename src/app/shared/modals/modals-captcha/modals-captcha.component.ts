// Angular
import { Component } from "@angular/core";

// Bootstrap
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-modals-captcha",
  templateUrl: "./modals-captcha.component.html",
  styleUrls: ["./modals-captcha.component.scss"]
})
export class CaptchaModal {
  constructor(public activeModal: NgbActiveModal) {}

  result(recaptcha: string) {
    if (recaptcha) this.activeModal.close(recaptcha);
  }
}
