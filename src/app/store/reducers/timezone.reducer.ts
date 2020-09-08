import { TimezonesState } from '../datatypes';
import { TimezoneActionAll, TimezoneActionTypes } from '../actions/timezone.action';

export function reducer(state = { timezones: [] }, action: TimezoneActionAll): TimezonesState {
  switch (action.type) {
    case TimezoneActionTypes.TIMEZONE_GET_SUCCESS: {
      return {
        ...state,
        timezones: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
