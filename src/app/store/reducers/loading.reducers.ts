// Custom Action
import { LoadingActionTypes, LoadingActionAll } from '../actions/loading.action';

// Model
import { LoadingState } from '../datatypes';

export const initialState: LoadingState = {
  loading: true
};

export function reducer(state = initialState, action: LoadingActionAll): LoadingState {
  switch (action.type) {
    case LoadingActionTypes.LOADING: {
      return {
        ...state,
        loading: true
      };
    }
    case LoadingActionTypes.LOADED: {
      return {
        ...state,
        loading: false
      };
    }
    default: {
      return state;
    }
  }
}
