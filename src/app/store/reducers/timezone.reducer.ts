import { TimezonesState } from '../datatypes';
import { TimezoneActionAll, TimezoneActionTypes } from '../actions/timezone.action';

// eslint-disable-next-line unicorn/no-object-as-default-parameter
export function reducer(state: any = { timezones: [] }, action: TimezoneActionAll): TimezonesState {
  switch (action.type) {
    case TimezoneActionTypes.TIMEZONE_GET_SUCCESS: {
      return {
        ...state,
        timezones: action.payload,
      };
    }
    default: {
      return state;
    }
  }
}
