// Angular
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Model
import { Payment } from '../../../../core/models';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
@Component({
  selector: 'app-payment-selector',
  templateUrl: './payment-selector.component.html',
  styleUrls: ['./payment-selector.component.scss']
})
export class PaymentSelectorComponent implements OnInit {
  @Input('paymentPlans') paymentPlans: Payment[];

  @Input('selectedPayment') selectedPayment: Payment;

  @Output('paymentPlanSelected') paymentPlanSelected = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onItemSelect(item: any) {
    this.paymentPlanSelected.next(item);
  }
}
