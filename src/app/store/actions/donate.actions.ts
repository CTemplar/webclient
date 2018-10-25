import { Action } from '@ngrx/store';
export enum DonationActionTypes {
    MAKE_STRIPE_DONATION = '[DONATE] STRIPE DONATION',
    MAKE_STRIPE_DONATION_SUCCESS = '[DONATE] STRIPE DONATION SUCCESS',
    MAKE_STRIPE_DONATION_FAILURE = '[DONATE] STRIPE DONATION FAILURE',
}

export class MakeStripDonation implements Action {
    readonly type = DonationActionTypes.MAKE_STRIPE_DONATION;

    constructor(public payload: any) {}
}

export class MakeStripeDonationSuccess implements Action {
    readonly type = DonationActionTypes.MAKE_STRIPE_DONATION_SUCCESS;

    constructor(public payload: any) {}
}

export class MakeStripeDonationFailure implements Action {
    readonly type = DonationActionTypes.MAKE_STRIPE_DONATION_FAILURE;

    constructor(public payload: any) {}
}

export type DonateActionAll =
    MakeStripDonation
    | MakeStripeDonationSuccess
    | MakeStripeDonationFailure;
