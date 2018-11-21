import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ClearAuthErrorMessage, ClearSignUpState, FinalLoading, MembershipUpdate } from '../../../store/actions';
import { UpdateSignupData } from '../../../store/actions/auth.action';
import { PaymentMethod, PaymentType } from '../../../store/datatypes';
import { SharedService } from '../../../store/services';
import { DEFAULT_EMAIL_ADDRESS, DEFAULT_STORAGE } from '../../config';
import { DynamicScriptLoaderService } from '../../services/dynamic-script-loader.service';

@Component({
  selector: 'app-pricing-plans',
  templateUrl: './pricing-plans.component.html',
  styleUrls: ['./pricing-plans.component.scss']
})
export class PricingPlansComponent implements OnInit, OnChanges, OnDestroy {
  readonly defaultMonthlyPrice = 8;
  readonly defaultStorage = DEFAULT_STORAGE;
  readonly defaultEmailAddress = DEFAULT_EMAIL_ADDRESS;

  @Input() hideHeader: boolean;
  @Input() blockGapsZero: boolean; // Flag to add top and bottom gap conditionally
  @Input() showCurrentPlan: boolean;
  @Input() isPrime: boolean;
  @Input() openBillingInfoInModal: boolean;
  @Input() selectedCurrency: string;
  @Input() paymentType: PaymentType;
  @Input() paymentMethod: PaymentMethod;
  @Input() selectedStorage: number = this.defaultStorage;
  @Input() selectedEmailAddress: number = this.defaultEmailAddress;

  @ViewChild('billingInfoModal') billingInfoModal;

  private billingInfoModalRef: NgbModalRef;

  selectedIndex: number = -1; // Assuming no element are selected initially
  availableStorage = [];
  availableEmailAddress = [];
  monthlyPrice: number;
  annualPricePerMonth: number;
  annualPriceTotal: number;
  isValueChanged: boolean;

  constructor(private sharedService: SharedService,
              private store: Store<any>,
              private router: Router,
              private dynamicScriptLoader: DynamicScriptLoaderService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.sharedService.hideFooter.emit(true);
    for (let i = 6; i <= 50; i++) {
      this.availableStorage.push(i);
    }
    for (let i = 6; i <= 30; i += 3) {
      this.availableEmailAddress.push(i);
    }
    this.paymentType = this.paymentType || PaymentType.MONTHLY;
    this.paymentMethod = this.paymentMethod || PaymentMethod.STRIPE;
    this.selectedCurrency = this.selectedCurrency || 'USD';
    this.calculatePrices();
    this.store.dispatch(new FinalLoading({ loadingState: false }));
  }

  ngOnChanges(changes: any) {
    if (changes.selectedStorage || changes.selectedEmailAddress) {
      this.selectedStorage = changes.selectedStorage && changes.selectedStorage.currentValue > 0 ?
        changes.selectedStorage.currentValue : this.defaultStorage;
      this.selectedEmailAddress = changes.selectedEmailAddress && changes.selectedEmailAddress.currentValue > 0 ?
        changes.selectedEmailAddress.currentValue : this.defaultEmailAddress;
      this.calculatePrices();
    }
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
      this.loadStripeScripts();
      this.billingInfoModalRef = this.modalService.open(this.billingInfoModal, {
        centered: true,
        windowClass: 'modal-lg users-action-modal'
      });
    } else {
      this.store.dispatch(new ClearSignUpState());
      this.store.dispatch(new ClearAuthErrorMessage());
      // Add payment type for prime plan only
      if (id === 1) {
        this.loadStripeScripts();
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

  calculatePrices() {
    let monthlyPrice = this.defaultMonthlyPrice;
    monthlyPrice += (this.selectedStorage - this.defaultStorage);
    monthlyPrice += ((this.selectedEmailAddress - this.defaultEmailAddress) / 3);
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
