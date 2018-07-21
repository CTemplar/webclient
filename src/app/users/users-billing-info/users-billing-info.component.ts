import { Component, OnInit } from '@angular/core';
// Service
import { SharedService } from '../../store/services';
import { CheckPendingBalance, ClearWallet, CreateNewWallet, FinalLoading, GetBitcoinServiceValue, SignUp } from '../../store/actions';
import { Store } from '@ngrx/store';
import { AppState, AuthState, BitcoinState, PendingBalanceResponse, SignupState } from '../../store/datatypes';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/observable/timer';
import { TakeUntilDestroy, OnDestroy } from 'ngx-take-until-destroy';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

@TakeUntilDestroy()
@Component({
  selector: 'app-users-billing-info',
  templateUrl: './users-billing-info.component.html',
  styleUrls: ['./users-billing-info.component.scss']
})
export class UsersBillingInfoComponent implements OnDestroy, OnInit {
  readonly destroyed$: Observable<boolean>;
  private pendingBalanceResponse: PendingBalanceResponse;
  public transactionSuccess: boolean;
  private timerObservable: Subscription;

  constructor(private sharedService: SharedService,
              private store: Store<AppState>,
              private formBuilder: FormBuilder) {
  }

  cardNumber;
  billingForm: FormGroup;
  expiryMonth = 'Month';
  expiryYear = 'Year';
  cvc;
  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
  paymentMethod: string = 'stripe';
  seconds: number = 60;
  minutes: number = 60;
  bitcoinState: BitcoinState;
  signupState: SignupState;
  signupInProgress: boolean;

  ngOnInit() {
    this.sharedService.hideFooter.emit(true);
    setTimeout(() => this.store.dispatch(new FinalLoading({ loadingState: false })));

    this.billingForm = this.formBuilder.group({
      'cardNumber': ['', [Validators.minLength(16), Validators.maxLength(16)]]
    });
    this.store.select(state => state.bitcoin).takeUntil(this.destroyed$)
      .subscribe((bitcoinState: BitcoinState) => {
        this.bitcoinState = bitcoinState;
        this.pendingBalanceResponse = this.bitcoinState.pendingBalanceResponse;
      });
    this.store.select(state => state.auth).takeUntil(this.destroyed$)
      .subscribe((authState: AuthState) => {
        this.signupState = authState.signupState;
        this.signupInProgress = authState.inProgress;
      });
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
    (<any>window).Stripe.card.createToken({
      number: this.cardNumber,
      exp_month: this.expiryMonth,
      exp_year: this.expiryYear,
      cvc: this.cvc
    }, (status: number, response: any) => {
      if (status === 200) {
        // TODO: add next step of subscription
        // console.log(`Success! Card token ${response.card.id}.`);
      } else {
        // console.log(response.error.message);
      }
    });
  }


  bitcoinSignup() {
    this.signupInProgress = true;
    this.store.dispatch(new SignUp({
      ...this.signupState,
      from_address: this.bitcoinState.newWalletAddress,
      redeem_code: this.bitcoinState.redeemCode,
    }));
  }

  checkPendingBalance() {
    if (this.pendingBalanceResponse.pending_balance > 0 &&
      this.pendingBalanceResponse.pending_balance >= this.pendingBalanceResponse.required_balance) {
      this.transactionSuccess = true;
      return;
    }
    setTimeout(() => {
      // check after every one minute
      this.store.dispatch(new CheckPendingBalance({
        'redeem_code': this.bitcoinState.redeemCode,
        'from_address': this.bitcoinState.newWalletAddress,
        'opt_timeout': 864000,             // time to wait the transaction is 24 hours
        'opt_interval': 1000               // interval to check transaction
      }));

      this.checkPendingBalance();
    }, 60 * 1000);

  }

  selectBitcoinMethod() {
    this.store.dispatch(new GetBitcoinServiceValue());
    this.timer();
    this.paymentMethod = 'bitcoin';
    this.createNewWallet();
    this.checkPendingBalance();
  }

  createNewWallet() {
    if (this.bitcoinState && this.bitcoinState.newWalletAddress) {
      return;
    }
    this.store.dispatch(new CreateNewWallet());
  }

  selectMonth(month) {
    this.expiryMonth = month;
  }

  selectYear(year) {
    this.expiryYear = year;
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
    this.store.dispatch(new ClearWallet());
    if (this.timerObservable) {
      this.timerObservable.unsubscribe();
    }
  }
}
