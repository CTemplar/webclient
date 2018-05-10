// Custom Action
import { LoadingActionTypes, LoadingActionAll } from '../actions/loading.action';

// Model
import { LoadingState } from '../datatypes';

export const initialState: LoadingState = {
  loading: false
};

export function reducer(state = initialState, action: LoadingActionAll): LoadingState {
  switch (action.type) {
    case LoadingActionTypes.LOADING: {
      return {
        loading: true
      };
    }
    case LoadingActionTypes.LOADED: {
      return {
        loading: false
      };
    }
    default: {
      return state;
    }
  }
}
