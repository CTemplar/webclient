import { Component, Input, OnChanges, OnDestroy, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

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
export class PricingPlansComponent implements OnInit, OnChanges, OnDestroy {
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

  pricingPlans: Array<PricingPlan> = [];

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
    this.setPricingPlans();
  }

  ngOnChanges(changes: any) {}

  setPricingPlans() {
    if (SharedService.PRICING_PLANS_ARRAY.length > 0) {
      this.pricingPlans = SharedService.PRICING_PLANS_ARRAY;
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

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
  }
}
