import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-failure-notice',
  templateUrl: './payment-failure-notice.component.html'
})
export class PaymentFailureNoticeComponent {

  constructor(private activeModal: NgbActiveModal,
              private router: Router) {
  }

  updatePayment() {
    this.router.navigateByUrl('/mail/settings');
    this.activeModal.close();
  }

}
