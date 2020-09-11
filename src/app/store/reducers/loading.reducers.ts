import { LoadingActionAll, LoadingActionTypes } from '../actions';
import { LoadingState } from '../datatypes';

export const initialState: LoadingState = {
  RecentBlogLoading: false,
  RelatedBlogLoading: false,
  Loading: false,
};

export function reducer(state = initialState, action: LoadingActionAll): LoadingState {
  switch (action.type) {
    case LoadingActionTypes.RECENT_LOADING: {
      return { ...state, RecentBlogLoading: action.payload.loadingState };
    }
    case LoadingActionTypes.RELATED_LOADING: {
      return { ...state, RelatedBlogLoading: action.payload.loadingState };
    }
    case LoadingActionTypes.FINAL_LOADING: {
      return { ...state, Loading: action.payload.loadingState };
    }
    default: {
      return state;
    }
  }
}
