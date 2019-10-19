import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import {
  CheckTransaction,
  ClearWallet,
  CreateNewWallet,
  FinalLoading,
  GetUpgradeAmount,
  SignUp,
  SnackErrorPush,
  UpgradeAccount
} from '../../../store/actions/index';
import {
  AppState,
  AuthState,
  BitcoinState,
  CheckTransactionResponse,
  PaymentMethod,
  PaymentType,
  PlanType,
  PricingPlan,
  SignupState,
  TransactionStatus,
  UserState
} from '../../../store/datatypes';
// Service
import { OpenPgpService, SharedService } from '../../../store/services/index';
import { UserAccountInitDialogComponent } from '../../../users/dialogs/user-account-init-dialog/user-account-init-dialog.component';
import { DynamicScriptLoaderService } from '../../services/dynamic-script-loader.service';
import { timer } from 'rxjs/internal/observable/timer';
import { apiUrl } from '../../config';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-users-billing-info',
  templateUrl: './users-billing-info.component.html',
  styleUrls: ['./users-billing-info.component.scss']
})
export class UsersBillingInfoComponent implements OnDestroy, OnInit {
  @Input() isUpgradeAccount: boolean;
  @Input() paymentType: PaymentType;
  @Input() paymentMethod: PaymentMethod;
  @Input() currency;
  @Input() storage: number;
  @Input() planType: PlanType = PlanType.PRIME;
  @Output() close = new EventEmitter<boolean>();

  paymentTypeEnum = PaymentType;
  cardNumber;
  billingForm: FormGroup;
  expiryMonth = 'Month';
  expiryYear = 'Year';
  cvc;
  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029'];
  paymentMethodType = PaymentMethod;
  seconds: number = 60;
  minutes: number = 60;
  bitcoinState: BitcoinState;
  signupState: SignupState;
  inProgress: boolean;
  planTypeEnum = PlanType;

  stripePaymentValidation: any = {
    message: '',
    param: ''
  };
  showPaymentPending: boolean;
  paymentSuccess: boolean;
  errorMessage: string;
  authState: AuthState;
  isScriptsLoaded: boolean;
  isScriptsLoading: boolean;
  apiUrl: string = apiUrl;
  currentPlan: PricingPlan;
  upgradeAmount: number;

  private checkTransactionResponse: CheckTransactionResponse;
  private timerObservable: Subscription;
  private modalRef: NgbModalRef;
  private btcTimer: Subscription;

  constructor(private sharedService: SharedService,
              private store: Store<AppState>,
              private router: Router,
              private formBuilder: FormBuilder,
              private openPgpService: OpenPgpService,
              private dynamicScriptLoader: DynamicScriptLoaderService,
              private modalService: NgbModal,
              private _zone: NgZone) {
  }

  ngOnInit() {
    this.sharedService.hideFooter.emit(true);
    setTimeout(() => this.store.dispatch(new FinalLoading({ loadingState: false })));
    if (this.isUpgradeAccount) {
      if (this.planType === PlanType.FREE) {
        this.paymentType = null;
        this.paymentMethod = null;
      } else {
        this.store.select(state => state.user).pipe(untilDestroyed(this))
          .subscribe((userState: UserState) => {
            this.upgradeAmount = userState.upgradeAmount;
          });
      }
    }

    this.billingForm = this.formBuilder.group({
      'cardNumber': ['', [Validators.minLength(16), Validators.maxLength(16)]]
    });
    this.store.select(state => state.bitcoin).pipe(untilDestroyed(this))
      .subscribe((bitcoinState: BitcoinState) => {
        this.bitcoinState = bitcoinState;
        this.checkTransactionResponse = this.bitcoinState.checkTransactionResponse;
        if (this.checkTransactionResponse && (this.checkTransactionResponse.status === TransactionStatus.PENDING ||
          this.checkTransactionResponse.status === TransactionStatus.RECEIVED ||
          this.checkTransactionResponse.status === TransactionStatus.SENT)) {
          this.paymentSuccess = true;
          return;
        }
      });
    this.store.select(state => state.auth).pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        this.signupState = authState.signupState;
        if (SharedService.PRICING_PLANS && this.signupState.plan_type) {
          this.currentPlan = SharedService.PRICING_PLANS[this.signupState.plan_type];
        }

        this.authState = authState;
        if (this.inProgress && !authState.inProgress) {
          if (authState.errorMessage) {
            this.errorMessage = authState.errorMessage;
          } else {
            this.close.emit(true);
          }
        }
        if (!this.paymentType && !this.paymentMethod && this.planType !== PlanType.FREE) {
          this.planType = this.signupState.plan_type || this.planType;
          this.paymentType = this.signupState.payment_type || PaymentType.MONTHLY;
          this.paymentMethod = this.signupState.payment_method || PaymentMethod.STRIPE;
          this.currency = this.signupState.currency || 'USD';
        }
        if (this.paymentMethod === PaymentMethod.BITCOIN) {
          this.selectBitcoinMethod(false);
        } else if (this.paymentMethod === PaymentMethod.STRIPE) {
          this.loadStripeScripts();
        }
        this.inProgress = authState.inProgress;
      });

    if (!this.isUpgradeAccount) {
      setTimeout(() => {
        this.validateSignupData();
      }, 3000);
    }
    this.sharedService.loadPricingPlans();
  }

  timer() {
    if (this.timerObservable) {
      this.timerObservable.unsubscribe();
    }
    const timerRef: any = timer(1000, 1000);
    this.timerObservable = timerRef.pipe(untilDestroyed(this)).subscribe(t => {
      this.seconds = ((3600 - t) % 60);
      this.minutes = ((3600 - t - this.seconds) / 60);
    });
  }

  private loadStripeScripts() {
    this.paymentMethod = PaymentMethod.STRIPE;
    this.getUpgradeAmount();
    if (this.btcTimer) {
      this.btcTimer.unsubscribe();
      this.btcTimer = null;
    }
    if (this.isScriptsLoading || this.isScriptsLoaded) {
      return;
    }
    this.isScriptsLoading = true;
    this.dynamicScriptLoader.load('stripe').then(data => {
      this.dynamicScriptLoader.load('stripe-key').then(stripeKeyLoaded => {
        this.isScriptsLoaded = true;
        this.isScriptsLoading = false;
      });
    }).catch(error => console.log(error));
  }

  getToken() {
    this.inProgress = true;
    (<any>window).Stripe.card.createToken({
      number: this.cardNumber,
      exp_month: this.expiryMonth,
      exp_year: this.expiryYear,
      cvc: this.cvc
    }, (status: number, response: any) => {
      // Wrapping inside the Angular zone
      this._zone.run(() => {
        this.inProgress = false;
        if (status === 200) {
          this.stripeSignup(response.id);
        } else {
          this.stripePaymentValidation = {
            message: response.error.message,
            param: response.error.param
          };
        }
      });
    });
  }

  getUpgradeAmount() {
    if (this.isUpgradeAccount) {
      this.store.dispatch(new GetUpgradeAmount({
        plan_type: this.planType,
        payment_type: this.paymentType,
        payment_method: this.paymentMethod
      }));
    }
  }

  submitForm() {
    if (this.planType === PlanType.FREE && this.isUpgradeAccount) {
      this.store.dispatch(new UpgradeAccount({ stripe_token: null, payment_type: null, plan_type: this.planType }));
      return;
    }
    // Reset Stripe validation
    this.stripePaymentValidation = {
      message: '',
      param: ''
    };

    if (this.paymentMethod === PaymentMethod.STRIPE) {
      this.getToken();
    } else {
      this.bitcoinSignup();
    }
  }

  validateSignupData() {
    if (this.signupState && this.signupState.username && this.signupState.password) {
      return true;
    }
    this.router.navigateByUrl('/signup');
  }

  stripeSignup(token: any) {
    if (token) {
      if (this.isUpgradeAccount) {
        this.store.dispatch(new UpgradeAccount({
          stripe_token: token,
          payment_type: this.paymentType,
          plan_type: this.planType
        }));
      } else {
        this.inProgress = true;
        this.openAccountInitModal();
        this.openPgpService.generateUserKeys(this.signupState.username, this.signupState.password);
        this.waitForPGPKeys({ ...this.signupState, stripe_token: token });
      }
    } else {
      this.store.dispatch(new SnackErrorPush('Cannot create account, please reload page and try again.'));
    }
  }

  bitcoinSignup() {
    if (this.bitcoinState.newWalletAddress) {
      if (this.isUpgradeAccount) {
        this.store.dispatch(new UpgradeAccount({
          from_address: this.bitcoinState.newWalletAddress,
          payment_type: this.paymentType,
          plan_type: this.planType,
        }));
      } else {
        this.inProgress = true;
        this.openAccountInitModal();
        this.openPgpService.generateUserKeys(this.signupState.username, this.signupState.password);
        this.waitForPGPKeys({ ...this.signupState, from_address: this.bitcoinState.newWalletAddress });
      }
    } else {
      this.store.dispatch(new SnackErrorPush('No bitcoin wallet found, Unable to signup, please reload page and try again.'));
    }
  }

  waitForPGPKeys(data: any) {
    setTimeout(() => {
      const userKeys = this.openPgpService.getUserKeys();
      if (userKeys) {
        this.pgpKeyGenerationCompleted({ ...userKeys, ...data });
        return;
      }
      this.waitForPGPKeys(data);
    }, 1000);
  }

  pgpKeyGenerationCompleted(data: any) {
    if (this.modalRef) {
      this.modalRef.componentInstance.pgpGenerationCompleted();
    }
    this.store.dispatch(new SignUp({
      ...data,
      plan_type: this.planType,
      payment_type: this.paymentType,
      payment_method: this.paymentMethod
    }));
  }

  checkTransaction() {
    if (this.checkTransactionResponse.status === TransactionStatus.PENDING ||
      this.checkTransactionResponse.status === TransactionStatus.RECEIVED ||
      this.checkTransactionResponse.status === TransactionStatus.SENT) {
      this.paymentSuccess = true;
      return;
    }
    // check after every one minute
    this.store.dispatch(new CheckTransaction({ 'from_address': this.bitcoinState.newWalletAddress }));
  }

  selectBitcoinMethod(forceLoad: boolean = true) {
    this.paymentMethod = PaymentMethod.BITCOIN;
    this.paymentType = PaymentType.ANNUALLY;
    this.getUpgradeAmount();
    if (this.bitcoinState && this.bitcoinState.newWalletAddress && !forceLoad) {
      return;
    }
    this.stripePaymentValidation = {
      message: '',
      param: ''
    };
    setTimeout(() => {
      this.showPaymentPending = true;
    }, 15000);

    this.timer();
    this.paymentSuccess = false;
    this.createNewWallet();
    this.btcTimer = timer(15000, 10000)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(() => {
        this.checkTransaction();
      });
  }

  selectPaymentType(paymentType: PaymentType) {
    this.paymentType = paymentType;
    this.getUpgradeAmount();
  }

  createNewWallet() {
    this.store.dispatch(new CreateNewWallet({
      payment_type: this.paymentType,
      plan_type: this.planType,
      payment_method: this.paymentMethod,
    }));
  }

  selectMonth(month) {
    this.expiryMonth = month;
    this.checkStripeValidation();
  }

  selectYear(year) {
    this.expiryYear = year;
    this.checkStripeValidation();
  }

  checkStripeValidation() {
    this.stripePaymentValidation.message = '';
    if (!(<any>window).Stripe.card.validateCardNumber(this.cardNumber)) {
      this.stripePaymentValidation.param = 'number';
    } else if (!(<any>window).Stripe.card.validateExpiry(this.expiryMonth, this.expiryYear)) {
      this.stripePaymentValidation.param = 'exp_year exp_month';
    } else if (!(<any>window).Stripe.card.validateCVC(this.cvc)) {
      this.stripePaymentValidation.param = 'cvc';
    }
  }

  onCancel(event) {
    event.preventDefault();
    if (this.isUpgradeAccount) {
      this.close.emit(true);
    } else {
      this.router.navigateByUrl('/');
    }
  }

  openAccountInitModal() {
    this.modalRef = this.modalService.open(UserAccountInitDialogComponent, {
      centered: true,
      windowClass: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    });
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
    this.store.dispatch(new ClearWallet());
    if (this.timerObservable) {
      this.timerObservable.unsubscribe();
    }

    this.dynamicScriptLoader.removeStripeFromDOM();
  }
}
