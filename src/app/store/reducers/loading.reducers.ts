// Custom Action
import { LoadingActionTypes, LoadingActionAll } from '../actions';

// Model
import { LoadingState } from '../datatypes';

export const initialState: LoadingState = {
  blogLoading: false
};

export function reducer(state = initialState, action: LoadingActionAll): LoadingState {
  switch (action.type) {
    case LoadingActionTypes.LOADING: {
      return {
        blogLoading: true
      };
    }
    case LoadingActionTypes.LOADED: {
      return {
        blogLoading: false
      };
    }
    default: {
      return state;
    }
  }
}
