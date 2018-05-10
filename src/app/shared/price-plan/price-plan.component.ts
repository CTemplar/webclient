// Angular
import { Component, OnInit } from '@angular/core';

// Model
import { Storage, StorageData, PaymentData, Payment } from '../../store/models';

@Component({
  selector: 'app-price-plan',
  templateUrl: './price-plan.component.html',
  styleUrls: ['./price-plan.component.scss']
})
export class PricePlanComponent implements OnInit {

  public storageList: Storage[];
  public paymentPlans: Payment[];
  public selectedStorage: Storage;
  public selectedPayment: Payment;

  // == Defining public property as boolean
  public selectedIndex = -1; // Assuming no element are selected initially

  constructor() { }

  ngOnInit() {
    this.storageList = StorageData;
    this.selectedStorage = this.storageList.find(storage => storage.id === 1);
    this.paymentPlans = PaymentData;

    this.updatePaymentPlans();
    this.selectedPayment = this.paymentPlans.find(plan => plan.id === 1);
  }

  // == Toggle active state of the slide in price page
  toggleSlides(index) {
    this.selectedIndex = index;
    document.querySelector('.package-xs-tab > li').classList.remove('active');
    document.querySelector('.package-prime-col').classList.remove('active-slide');
  }

  selectedStorageHandler(item: any) {
    this.selectedStorage = item;
    this.updatePaymentPlans();
  }

  selectedPaymentPlanHandler(item: any) {
    this.selectedPayment = item;
  }

  updatePaymentPlans() {
    this.paymentPlans.forEach(plan => {
      if (plan.id === 1) {
        plan.monthlyFee = this.selectedStorage.price;
      } else {
        plan.monthlyFee = (this.selectedStorage.price * plan.monthlyDiscountRate).toFixed(1);
        plan.totalAnnualFee = (this.selectedStorage.price * plan.annualDiscountRate).toFixed(1);
      }
    });
  }

}
