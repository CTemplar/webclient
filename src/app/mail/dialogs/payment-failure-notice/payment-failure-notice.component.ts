import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-failure-notice',
  templateUrl: './payment-failure-notice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentFailureNoticeComponent {
  constructor(private activeModal: NgbActiveModal, private router: Router) {}

  updatePayment() {
    this.router.navigateByUrl('/mail/settings/dashboard-and-plans');
    this.activeModal.close();
  }
}
