import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { FinalLoading, MembershipUpdate } from '../../../store/actions';
import { SharedService } from '../../../store/services';
import { DynamicScriptLoaderService } from '../../services/dynamic-script-loader.service';
import { UpdateSignupData } from '../../../store/actions/auth.action';
import { PaymentType, PaymentMethod } from '../../../store/datatypes';

@Component({
  selector: 'app-pricing-plans',
  templateUrl: './pricing-plans.component.html',
  styleUrls: ['./pricing-plans.component.scss']
})
export class PricingPlansComponent implements OnInit, OnDestroy {
  readonly defaultMonthlyPrice = 8;
  readonly defaultAnnualPricePerMonth = 6;
  readonly defaultStorage = 5; // storage in GB
  readonly defaultEmailAddress = 1;

  public selectedIndex: number = -1; // Assuming no element are selected initially
  @Input() hideHeader: boolean;
  @Input() blockGapsZero: boolean; // Flag to add top and bottom gap conditionally
  @Input() showCurrentPlan: boolean;
  @Input() isPrime: boolean;
  @Input() openBillingInfoInModal: boolean;

  @ViewChild('billingInfoModal') billingInfoModal;

  private billingInfoModalRef: NgbModalRef;

  public selectedCurrency: string = 'USD';
  public paymentType: PaymentType = PaymentType.MONTHLY;
  public paymentMethod: PaymentMethod = PaymentMethod.STRIPE;
  availableStorage = [];
  availableEmailAddress = [];
  selectedStorage: number;
  selectedEmailAddress: number;
  monthlyPrice: number;
  annualPricePerMonth: number;
  annualPriceTotal: number;

  constructor(private sharedService: SharedService,
              private store: Store<any>,
              private router: Router,
              private dynamicScriptLoader: DynamicScriptLoaderService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.sharedService.hideFooter.emit(true);
    this.loadStripeScripts();
    for (let i = 6; i <= 50; i++) {
      this.availableStorage.push(i);
    }
    for (let i = 2; i <= 50; i++) {
      this.availableEmailAddress.push(i);
    }
    this.selectedStorage = this.defaultStorage;
    this.selectedEmailAddress = this.defaultEmailAddress;
    this.monthlyPrice = this.defaultMonthlyPrice;
    this.annualPricePerMonth = this.defaultAnnualPricePerMonth;
    this.annualPriceTotal = this.annualPricePerMonth * 12;
    this.store.dispatch(new FinalLoading({ loadingState: false }));
  }

  // == Toggle active state of the slide in price page
  toggleSlides(index) {
    this.selectedIndex = index;
    document.querySelector('.package-xs-tab > li').classList.remove('active');
    document
      .querySelector('.package-prime-col')
      .classList.remove('active-slide');
  }

  selectPlan(id) {
    this.store.dispatch(new MembershipUpdate({ id }));

    if (this.openBillingInfoInModal) {
      this.billingInfoModalRef = this.modalService.open(this.billingInfoModal, {
        centered: true,
        windowClass: 'modal-lg users-action-modal'
      });
    } else {
      // Add payment type for prime plan only
      if (id === 1) {
        this.store.dispatch(new UpdateSignupData({
          payment_type: this.paymentType,
          payment_method: this.paymentMethod,
          currency: this.selectedCurrency,
          memory: this.selectedStorage,
          email_count: this.selectedEmailAddress,
          monthlyPrice: this.monthlyPrice,
          annualPricePerMonth: this.annualPricePerMonth,
          annualPriceTotal: this.annualPriceTotal
        }));
      }
      this.router.navigateByUrl('/create-account');
    }
  }

  changeCurrency(currency) {
    this.selectedCurrency = currency;
  }

  changePaymentMethod(paymentMethod: PaymentMethod) {
    if (paymentMethod === PaymentMethod.BITCOIN) {
      this.paymentType = PaymentType.ANNUALLY;
    } else {
      this.paymentType = PaymentType.MONTHLY;
    }
  }

  calculatePrices() {
    let monthlyPrice = this.defaultMonthlyPrice;
    monthlyPrice += (this.selectedStorage - this.defaultStorage);
    monthlyPrice += (this.selectedEmailAddress - this.defaultEmailAddress);
    this.monthlyPrice = monthlyPrice;
    this.annualPricePerMonth = +(this.monthlyPrice * 0.75).toFixed(2);
    this.annualPriceTotal = +(this.annualPricePerMonth * 12).toFixed(2);
  }

  private loadStripeScripts() {
    this.dynamicScriptLoader.load('stripe').then(data => {
      this.dynamicScriptLoader.load('stripe-key').then(stripeKeyLoaded => {
        // Script Loaded Successfully
      });
    }).catch(error => console.log(error));
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
  }

}
