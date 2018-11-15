import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { DonationService } from '../services/donation.service';
import { Observable } from 'rxjs/Observable';
import { DonationActionTypes, MakeStripDonation, MakeStripeDonationSuccess, MakeStripeDonationFailure } from '../actions/donate.actions';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SnackErrorPush } from '../actions/users.action';
import { NotificationService } from '../services/notification.service';


@Injectable()
export class DonateEffects {

    constructor(
        private actions: Actions,
        private donationService: DonationService,
        private notificationService: NotificationService,
        private router: Router
    ) {}

    @Effect()
    makeStripeDonation: Observable<any> = this.actions
    .ofType(DonationActionTypes.MAKE_STRIPE_DONATION)
    .map((action: MakeStripDonation) => action.payload)
    .switchMap(payload => {
        return this.donationService.makeStripeDonation(payload)
        .pipe(
            map((payment_success) => new MakeStripeDonationSuccess(payment_success)),
            catchError((errorResponse) => [new SnackErrorPush({ message: errorResponse.error.detail })])
        );
    });

    @Effect({ dispatch: false })
    makeStripeDonationSuccess: Observable<any> = this.actions.pipe(
        ofType(DonationActionTypes.MAKE_STRIPE_DONATION_SUCCESS),
        tap((response) => {
          this.notificationService.showSnackBar('Donated Successfully. Thank you for your donation.', 'CLOSE', { duration: 10000 });
            this.router.navigateByUrl('/donate');
        })
    );

}
