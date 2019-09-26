import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ClearAuthErrorMessage, ClearSignUpState, FinalLoading, MembershipUpdate } from '../../../store/actions';
import { UpdateSignupData } from '../../../store/actions/auth.action';
import { PaymentMethod, PaymentType, PlanType } from '../../../store/datatypes';
import { SharedService } from '../../../store/services';
import { DEFAULT_CUSTOM_DOMAIN, DEFAULT_EMAIL_ADDRESS, DEFAULT_STORAGE } from '../../config';
import { DynamicScriptLoaderService } from '../../services/dynamic-script-loader.service';

@Component({
  selector: 'app-pricing-plans',
  templateUrl: './pricing-plans.component.html',
  styleUrls: ['./pricing-plans.component.scss']
})
export class PricingPlansComponent implements OnInit, OnChanges, OnDestroy {
  readonly defaultMonthlyPrice = 8;
  readonly championMonthlyPrice = 50;
  readonly championAnnualPricePerMonth = 37.5; // 25% discount on `championMonthlyPrice`
  readonly championAnnualPriceTotal = 450;
  readonly defaultStorage = DEFAULT_STORAGE;
  readonly defaultEmailAddress = DEFAULT_EMAIL_ADDRESS;
  readonly defaultCustomDomain = DEFAULT_CUSTOM_DOMAIN;
  readonly planType = PlanType;

  @Input() hideHeader: boolean;
  @Input() blockGapsZero: boolean; // Flag to add top and bottom gap conditionally
  @Input() showCurrentPlan: boolean;
  @Input() userPlanType: PlanType = PlanType.FREE;
  @Input() openBillingInfoInModal: boolean;
  @Input() selectedCurrency: string;
  @Input() paymentType: PaymentType;
  @Input() paymentMethod: PaymentMethod;
  @Input() selectedStorage: number = this.defaultStorage;
  @Input() selectedEmailAddress: number = this.defaultEmailAddress;
  @Input() selectedCustomDomain: number = this.defaultCustomDomain;

  @ViewChild('billingInfoModal', { static: false }) billingInfoModal;

  private billingInfoModalRef: NgbModalRef;

  selectedIndex: number = -1; // Assuming no element are selected initially
  selectedPlan: PlanType;
  availableStorage = [];
  availableEmailAddress = [];
  availableCustomDomain = [];
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
    for (let i = 20; i <= 100; i += 10) {
      this.availableEmailAddress.push(i);
    }
    for (let i = 2; i <= 10; i++) {
      this.availableCustomDomain.push(i);
    }
    this.paymentType = this.paymentType || PaymentType.MONTHLY;
    this.paymentMethod = this.paymentMethod || PaymentMethod.STRIPE;
    this.selectedCurrency = this.selectedCurrency || 'USD';
    this.store.dispatch(new FinalLoading({ loadingState: false }));
    this.sharedService.loadPricingPlans();
  }

  ngOnChanges(changes: any) {}

  // == Toggle active state of the slide in price page
  toggleSlides(index) {
    this.selectedIndex = index;
    document.querySelector('.package-xs-tab > li').classList.remove('active');
    document
      .querySelector('.package-prime-col')
      .classList.remove('active-slide');
  }

  selectPlan(plan: PlanType) {
    // this.store.dispatch(new MembershipUpdate({ id }));
    this.selectedPlan = plan;

    if (this.openBillingInfoInModal) {
      this.billingInfoModalRef = this.modalService.open(this.billingInfoModal, {
        centered: true,
        windowClass: 'modal-lg users-action-modal',
        backdrop: 'static',
      });
    } else {
      this.store.dispatch(new ClearSignUpState());
      this.store.dispatch(new ClearAuthErrorMessage());
      this.store.dispatch(new UpdateSignupData({
        plan_type: this.selectedPlan,
        payment_type: this.paymentType,
        payment_method: this.paymentMethod,
        currency: this.selectedCurrency
      }));
      this.router.navigateByUrl('/create-account');
    }
  }

  changeCurrency(currency) {
    this.selectedCurrency = currency;
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
  }

}
