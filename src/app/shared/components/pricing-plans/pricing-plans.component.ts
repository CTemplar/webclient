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

  // == Defining public property as boolean
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

  constructor(private sharedService: SharedService,
              private store: Store<any>,
              private router: Router,
              private dynamicScriptLoader: DynamicScriptLoaderService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.sharedService.hideFooter.emit(true);
    this.loadStripeScripts();
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
        this.store.dispatch( new UpdateSignupData({ payment_type: this.paymentType }));
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
