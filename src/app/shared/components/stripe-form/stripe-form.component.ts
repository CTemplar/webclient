import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/datatypes';
import { SnackErrorPush } from '../../../store';
import { DonationService } from '../../../store/services/donation.service';
import { MakeStripDonation } from '../../../store/actions/donate.actions';

@Component({
  selector: 'app-stripe-form',
  templateUrl: './stripe-form.component.html',
  styleUrls: ['./stripe-form.component.scss'],
})
export class StripeFormComponent implements OnInit {
  /**
   * Messages recieved from Stripe API will be displayed using this model
   */
  stripePaymentValidation: any = {
    message: '',
    param: '',
  };

  // Angular Reactive Form for binding it with inputs
  billingForm: FormGroup;

  /**
   * donationAmount : The amount user wants to donate to CTemplar
   * cardNumber: 16 digit long Credti/Debit card number
   * cvc: 3 or 4 digit decurity code of the card
   */
  donationAmount: number;
  cardNumber;
  expiryMonth = 'Month';
  expiryYear = 'Year';
  cvc;

  /**
   * For filling Month and Year dropdowns
   */
  months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  years = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];

  /**
   * Display loader on form submission
   */
  inProgress = false;

  constructor(
    private formBuilder: FormBuilder,
    private _zone: NgZone,
    private store: Store<AppState>,
    private donationService: DonationService,
  ) {}

  /**
   * Initializing billing form and adding validation check of 16 digits length
   */
  ngOnInit() {
    this.billingForm = this.formBuilder.group({
      cardNumber: ['', [Validators.minLength(16), Validators.maxLength(16)]],
    });
  }

  /**
   * Selection method for month and initiating form validation
   * @param month - Expiry month specified on the card
   */
  selectMonth(month) {
    this.expiryMonth = month;
    this.checkStripeValidation();
  }

  /**
   * @description
   * Selection method for year and initiating form validation
   *
   * @param year - Expiry year specified on the card
   */
  selectYear(year) {
    this.expiryYear = year;
    this.checkStripeValidation();
  }

  /**
   * @description
   * Checks the inputs validity after each on change event on cardNumber, expiryMonth and expiredYear and CVC
   *
   * As soon as the Stripe API returns an error on any input, respective param is assigned which highlights the input
   * by showing red border.
   */
  checkStripeValidation() {
    this.stripePaymentValidation.param = '';
    this.stripePaymentValidation.message = '';
    if (!(<any>window).Stripe.card.validateCardNumber(this.cardNumber)) {
      this.stripePaymentValidation.param = 'number';
    } else if (!(<any>window).Stripe.card.validateExpiry(this.expiryMonth, this.expiryYear)) {
      this.stripePaymentValidation.param = 'exp_year exp_month';
    } else if (!(<any>window).Stripe.card.validateCVC(this.cvc)) {
      this.stripePaymentValidation.param = 'cvc';
    }
  }

  /**
   * @description
   * Submits form to Stripe API after the inputs are validated
   *
   * After successful response from the Stripe API, token from the response is extracted
   * token is passed to a method that makes payment using CTemplar API
   */
  submitStripeForm() {
    this.inProgress = true;
    (<any>window).Stripe.card.createToken(
      {
        number: this.cardNumber,
        exp_month: this.expiryMonth,
        exp_year: this.expiryYear,
        cvc: this.cvc,
      },
      (status: number, response: any) => {
        // Wrapping inside the Angular zone
        this._zone.run(() => {
          this.inProgress = false;
          if (status === 200) {
            this.performStripeDonationTransaction(response.id);
          } else {
            this.stripePaymentValidation = {
              message: response.error.message,
              param: response.error.param,
            };
          }
        });
      },
    );
  }

  /**
   * @description
   * Peforms transaction after successfully validating information provided in the Stripe form
   *
   * @param token - string recieved from Stripe API
   */
  private performStripeDonationTransaction(token: any) {
    if (token) {
      this.store.dispatch(
        new MakeStripDonation({
          stripe_token: token,
          amount: this.donationAmount,
        }),
      );
    } else {
      this.store.dispatch(new SnackErrorPush('Cannot make donation, please reload page and try again.'));
    }
  }
}
