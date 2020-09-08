import { DonateActionAll, DonationActionTypes } from '../actions/donate.actions';
export const initialState: any = {};

export function reducer(state = initialState, action: DonateActionAll) {
  switch (action.type) {
    case DonationActionTypes.MAKE_STRIPE_DONATION:
    case DonationActionTypes.MAKE_STRIPE_DONATION_SUCCESS:
    case DonationActionTypes.MAKE_STRIPE_DONATION_FAILURE: {
      return state;
    }

    default: {
      return state;
    }
  }
}
