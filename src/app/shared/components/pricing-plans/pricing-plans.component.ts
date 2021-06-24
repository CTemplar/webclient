import { Component, Input, ChangeDetectionStrategy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

import { ClearAuthErrorMessage, ClearSignUpState, FinalLoading } from '../../../store/actions';
import { UpdateSignupData } from '../../../store/actions/auth.action';
import { PaymentMethod, PaymentType, PlanType, PricingPlan } from '../../../store/datatypes';
import { LOADING_IMAGE, SharedService } from '../../../store/services';
import { DynamicScriptLoaderService } from '../../services/dynamic-script-loader.service';

@Component({
  selector: 'app-pricing-plans',
  templateUrl: './pricing-plans.component.html',
  styleUrls: ['./pricing-plans.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PricingPlansComponent implements OnInit {
  readonly planType = PlanType;

  @Input() hideHeader: boolean;

  @Input() blockGapsZero: boolean; // Flag to add top and bottom gap conditionally

  @Input() showCurrentPlan: boolean;

  @Input() userPlanType: PlanType = null;

  @Input() openBillingInfoInModal: boolean;

  @Input() selectedCurrency: string;

  @Input() paymentType: PaymentType = PaymentType.ANNUALLY;

  @Input() paymentMethod: PaymentMethod;

  @ViewChild('billingInfoModal') billingInfoModal: any;

  private billingInfoModalRef: NgbModalRef;

  selectedIndex = -1; // Assuming no element are selected initially

  selectedPlan: PlanType;

  availableStorage: number[] = [];

  availableEmailAddress: number[] = [];

  availableCustomDomain: number[] = [];

  pricingPlans$: BehaviorSubject<Array<PricingPlan>> = new BehaviorSubject<Array<PricingPlan>>([]);

  loadingImage = LOADING_IMAGE;

  paymentTypeEnum = PaymentType;

  selectedPaymentType: PaymentType = PaymentType.ANNUALLY;

  constructor(
    private sharedService: SharedService,
    private store: Store<any>,
    private router: Router,
    private dynamicScriptLoader: DynamicScriptLoaderService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    // eslint-disable-next-line no-plusplus
    for (let index = 6; index <= 50; index++) {
      this.availableStorage.push(index);
    }
    for (let index = 20; index <= 100; index += 10) {
      this.availableEmailAddress.push(index);
    }
    // eslint-disable-next-line no-plusplus
    for (let index = 2; index <= 10; index++) {
      this.availableCustomDomain.push(index);
    }
    this.paymentType = this.paymentType || PaymentType.MONTHLY;
    this.paymentMethod = this.paymentMethod || PaymentMethod.STRIPE;
    this.selectedCurrency = this.selectedCurrency || 'USD';
    this.store.dispatch(new FinalLoading({ loadingState: false }));
    this.sharedService.loadPricingPlans();
    this.setPricingPlans();
  }

  setPricingPlans() {
    if (SharedService.PRICING_PLANS_ARRAY.length > 0) {
      this.pricingPlans$.next(SharedService.PRICING_PLANS_ARRAY);
      return;
    }
    setTimeout(() => {
      this.setPricingPlans();
    }, 1000);
  }

  selectPlan(plan: PlanType, paymentType: PaymentType = null) {
    this.selectedPaymentType = paymentType || this.paymentType;
    this.selectedPlan = plan;
    this.store.dispatch(new ClearSignUpState());
    this.store.dispatch(new ClearAuthErrorMessage());
    this.store.dispatch(
      new UpdateSignupData({
        plan_type: this.selectedPlan,
        payment_type: this.paymentType,
        payment_method: this.paymentMethod,
        currency: this.selectedCurrency,
      }),
    );
    if (this.openBillingInfoInModal) {
      this.billingInfoModalRef = this.modalService.open(this.billingInfoModal, {
        centered: true,
        windowClass: 'modal-lg users-action-modal',
        backdrop: 'static',
      });
    } else if (plan === PlanType.FREE) {
      this.router.navigateByUrl(`/create-account?plan=${plan}`);
    } else {
      this.router.navigateByUrl(`/create-account?plan=${plan}&billing=${this.selectedPaymentType}`);
    }
  }

  togglePaymentType() {
    this.selectedPaymentType =
      this.selectedPaymentType === PaymentType.MONTHLY ? PaymentType.ANNUALLY : PaymentType.MONTHLY;
    this.paymentType = this.selectedPaymentType;
  }
}
