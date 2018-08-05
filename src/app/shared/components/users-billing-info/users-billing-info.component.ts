import { Component, OnInit, NgZone, Input, Output, EventEmitter } from '@angular/core';
// Service
import { SharedService } from '../../../store/services/index';
import {
  CheckTransaction,
  ClearWallet,
  CreateNewWallet,
  FinalLoading,
  GetBitcoinServiceValue,
  SignUp,
  SnackErrorPush
} from '../../../store/actions/index';
import { Store } from '@ngrx/store';
import {
  AppState,
  AuthState,
  BitcoinState,
  PaymentMethod,
  CheckTransactionResponse,
  SignupState,
  TransactionStatus
} from '../../../store/datatypes';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/observable/timer';
import { TakeUntilDestroy, OnDestroy } from 'ngx-take-until-destroy';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';


@TakeUntilDestroy()
@Component({
  selector: 'app-users-billing-info',
  templateUrl: './users-billing-info.component.html',
  styleUrls: ['./users-billing-info.component.scss']
})
export class UsersBillingInfoComponent implements OnDestroy, OnInit {
  @Input() isOpenedInModal: boolean;
  @Output() cancel = new EventEmitter<boolean>();

  cardNumber;
  billingForm: FormGroup;
  expiryMonth = 'Month';
  expiryYear = 'Year';
  cvc;
  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
  paymentMethod: PaymentMethod = PaymentMethod.STRIPE;
  paymentMethodType = PaymentMethod;
  seconds: number = 60;
  minutes: number = 60;
  bitcoinState: BitcoinState;
  signupState: SignupState;
  signupInProgress: boolean;

  stripePaymentValidation: any = {
    message: '',
    param: ''
  };
  showPaymentPending: boolean;
  paymentSuccess: boolean;

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
    if (!this.isOpenedInModal) {
      this.store.select(state => state.auth).takeUntil(this.destroyed$)
        .subscribe((authState: AuthState) => {
          this.signupState = authState.signupState;
          this.signupInProgress = authState.inProgress;
        });

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
    this.signupInProgress = true;
    (<any>window).Stripe.card.createToken({
      number: this.cardNumber,
      exp_month: this.expiryMonth,
      exp_year: this.expiryYear,
      cvc: this.cvc
    }, (status: number, response: any) => {
      // Wrapping inside the Angular zone
      this._zone.run(() => {
        this.signupInProgress = false;
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
      this.store.dispatch(new SignUp({
        ...this.signupState,
        stripe_token: token
      }));
    } else {
      this.store.dispatch(new SnackErrorPush('Cannot create account, please reload page and try again.'));
    }
  }

  bitcoinSignup() {
    if (this.bitcoinState.newWalletAddress && this.bitcoinState.redeemCode) {
      this.store.dispatch(new SignUp({
        ...this.signupState,
        from_address: this.bitcoinState.newWalletAddress,
        redeem_code: this.bitcoinState.redeemCode,
      }));
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
        'from_address': this.bitcoinState.newWalletAddress,
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
    if (this.isOpenedInModal) {
      this.cancel.emit(true);
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
