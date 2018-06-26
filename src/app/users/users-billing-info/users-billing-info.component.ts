import { Component, OnInit, OnDestroy } from '@angular/core';

// Service
import { SharedService } from '../../store/services';
import { FinalLoading } from '../../store/actions';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/datatypes';

import { FormBuilder, FormGroup, Validators, PatternValidator, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-users-billing-info',
  templateUrl: './users-billing-info.component.html',
  styleUrls: ['./users-billing-info.component.scss']
})
export class UsersBillingInfoComponent implements OnDestroy, OnInit {

  constructor(private sharedService: SharedService,
              private store: Store<AuthState>,
              private formBuilder: FormBuilder) { }

  cardNumber;
  billingForm: FormGroup;
  expiryMonth = 'Month';
  expiryYear = 'Year';
  cvc;
  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];

  ngOnInit() {
    this.sharedService.hideFooter.emit(true);
    setTimeout(() => this.store.dispatch(new FinalLoading({ loadingState: false })));

    this.billingForm = this.formBuilder.group({
      'cardNumber': ['', [Validators.minLength(16), Validators.maxLength(16)]]
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

  selectMonth(month) {
    this.expiryMonth = month;
  }

  selectYear(year) {
    this.expiryYear = year;
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
  }
}
