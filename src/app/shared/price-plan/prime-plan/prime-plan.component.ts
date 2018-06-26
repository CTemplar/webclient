// Angular
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Model
import { Payment, Storage } from '../../../store/models';

@Component({
  selector: 'app-prime-plan',
  templateUrl: './prime-plan.component.html',
  styleUrls: ['./prime-plan.component.scss']
})
export class PrimePlanComponent implements OnInit {
  @Input('storageList') storageList: Storage[];
  @Input('selectedStorage') selectedStorage: Storage;
  @Input('paymentPlans') paymentPlans: Payment[];
  @Input('selectedPayment') selectedPayment: Payment;
  @Output('storageSelected') storageSelected = new EventEmitter();
  @Output('paymentPlanSelected') paymentPlanSelected = new EventEmitter();

  // == Defining public property as boolean
  public selectedIndex = -1; // Assuming no element are selected initially

  constructor() {
  }

  ngOnInit() {
  }

  // == Toggle active state of the slide in price page
  toggleSlides(index) {
    this.selectedIndex = index;
    document.querySelector('.package-xs-tab > li').classList.remove('active');
    document.querySelector('.package-prime-col').classList.remove('active-slide');
  }

  selectedStorageHandler(item: any) {
    this.storageSelected.next(item);
  }

  selectedPaymentPlanHandler(item: any) {
    this.paymentPlanSelected.next(item);
  }

  getMonthlyPlan() {
    return this.paymentPlans.find(plan => plan.id === 1);
  }

  getAnnualPlan() {
    return this.paymentPlans.find(plan => plan.id === 2);
  }
}
