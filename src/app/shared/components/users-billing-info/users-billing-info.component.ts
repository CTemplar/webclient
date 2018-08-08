import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import 'rxjs/add/observable/timer';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
  CheckTransaction,
  ClearWallet,
  CreateNewWallet,
  FinalLoading,
  GetBitcoinServiceValue,
  SignUp,
  SnackErrorPush, UpgradeAccount
} from '../../../store/actions/index';
import {
  AppState,
  AuthState,
  BitcoinState,
  CheckTransactionResponse,
  PaymentMethod,
  SignupState,
  TransactionStatus,
  PaymentType
} from '../../../store/datatypes';
// Service
import { SharedService } from '../../../store/services/index';

@TakeUntilDestroy()
@Component({
  selector: 'app-users-billing-info',
  templateUrl: './users-billing-info.component.html',
  styleUrls: ['./users-billing-info.component.scss']
})
export class UsersBillingInfoComponent implements OnDestroy, OnInit {
  @Input() isUpgradeAccount: boolean;
  @Input() paymentType: PaymentType;
  @Input() paymentMethod: PaymentMethod = PaymentMethod.STRIPE;
  @Output() close = new EventEmitter<boolean>();

  cardNumber;
  billingForm: FormGroup;
  expiryMonth = 'Month';
  expiryYear = 'Year';
  cvc;
  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
  paymentMethodType = PaymentMethod;
  seconds: number = 60;
  minutes: number = 60;
  bitcoinState: BitcoinState;
  signupState: SignupState;
  inProgress: boolean;

  stripePaymentValidation: any = {
    message: '',
    param: ''
  };
  showPaymentPending: boolean;
  paymentSuccess: boolean;
  errorMessage: string;

  readonly destroyed$: Observable<boolean>;
  private checkTransactionResponse: CheckTransactionResponse;
  private timerObservable: Subscription;

  constructor(private sharedService: SharedService,
              private store: Store<AppState>,
              private router: Router,
              private formBuilder: FormBuilder,
              private _zone: NgZone) {
  }

  ngOnInit() {
    this.sharedService.hideFooter.emit(true);
    setTimeout(() => this.store.dispatch(new FinalLoading({ loadingState: false })));

    this.billingForm = this.formBuilder.group({
      'cardNumber': ['', [Validators.minLength(16), Validators.maxLength(16)]]
    });
    this.store.select(state => state.bitcoin).takeUntil(this.destroyed$)
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
    this.store.select(state => state.auth).takeUntil(this.destroyed$)
      .subscribe((authState: AuthState) => {
        this.signupState = authState.signupState;
        if (this.inProgress && !authState.inProgress) {
          if (authState.errorMessage) {
            this.errorMessage = authState.errorMessage;
          } else {
            this.close.emit(true);
          }
        }
        this.inProgress = authState.inProgress;
      });

    if (!this.isUpgradeAccount) {
      setTimeout(() => {
        this.validateSignupData();
      }, 3000);
    }
  }

  timer() {
    if (this.timerObservable) {
      this.timerObservable.unsubscribe();
    }
    const timer = Observable.timer(1000, 1000);
    this.timerObservable = timer.takeUntil(this.destroyed$).subscribe(t => {
      this.seconds = ((3600 - t) % 60);
      this.minutes = ((3600 - t - this.seconds) / 60);
    });
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

  submitForm() {

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
        this.store.dispatch(new UpgradeAccount({ stripe_token: token, payment_type: this.paymentType}));
      } else {
        this.store.dispatch(new SignUp({
          ...this.signupState,
          stripe_token: token
        }));
      }
    } else {
      this.store.dispatch(new SnackErrorPush('Cannot create account, please reload page and try again.'));
    }
  }

  bitcoinSignup() {
    if (this.bitcoinState.newWalletAddress && this.bitcoinState.redeemCode) {
      if (this.isUpgradeAccount) {
        this.store.dispatch(new UpgradeAccount({
          from_address: this.bitcoinState.newWalletAddress,
          redeem_code: this.bitcoinState.redeemCode,
          payment_type: PaymentType.ANNUALLY
        }));
      } else {
        this.store.dispatch(new SignUp({
          ...this.signupState,
          from_address: this.bitcoinState.newWalletAddress,
          redeem_code: this.bitcoinState.redeemCode
        }));
      }
    } else {
      this.store.dispatch(new SnackErrorPush('No bitcoin wallet found, Unable to signup, please reload page and try again.'));
    }
  }

  checkTransaction() {
    if (this.checkTransactionResponse.status === TransactionStatus.PENDING ||
      this.checkTransactionResponse.status === TransactionStatus.RECEIVED ||
      this.checkTransactionResponse.status === TransactionStatus.SENT) {
      this.paymentSuccess = true;
      return;
    }
    setTimeout(() => {
      // check after every one minute
      this.store.dispatch(new CheckTransaction({
        'redeem_code': this.bitcoinState.redeemCode,
        'from_address': this.bitcoinState.newWalletAddress
      }));

      this.checkTransaction();
    }, 10 * 1000);

  }

  selectBitcoinMethod() {
    this.stripePaymentValidation = {
      message: '',
      param: ''
    };
    setTimeout(() => {
      this.showPaymentPending = true;
    }, 15000);

    this.store.dispatch(new GetBitcoinServiceValue());
    this.timer();
    this.paymentMethod = PaymentMethod.BITCOIN;
    this.paymentSuccess = false;
    this.createNewWallet();
    this.checkTransaction();
  }

  createNewWallet() {
    if (this.bitcoinState && this.bitcoinState.newWalletAddress) {
      return;
    }
    this.store.dispatch(new CreateNewWallet());
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

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
    this.store.dispatch(new ClearWallet());
    if (this.timerObservable) {
      this.timerObservable.unsubscribe();
    }
  }
}
