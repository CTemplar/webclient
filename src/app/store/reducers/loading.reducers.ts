// Custom Action
import { LoadingActionTypes, LoadingActionAll, RelatedBlogLoading } from '../actions';

// Model
import { LoadingState } from '../datatypes';

export const initialState: LoadingState = {
  RecentBlogLoading: true,
  RelatedBlogLoading: true,
  Loading: true
};

export function reducer(state = initialState, action: LoadingActionAll): LoadingState {
  switch (action.type) {
    case LoadingActionTypes.RECENT_LOADING: {
      return { ...state, RecentBlogLoading: true };
    }
    case LoadingActionTypes.RECENT_LOADED: {
      return { ...state, RecentBlogLoading: false };
    }
    case LoadingActionTypes.RELATED_LOADING: {
      return { ...state, RelatedBlogLoading: true };
    }
    case LoadingActionTypes.RELATED_LOADED: {
      return { ...state, RelatedBlogLoading: false };
    }
    case LoadingActionTypes.FINAL_LOADING: {
      return { ...state, Loading: action.payload.loadingState};
    }
    default: {
      return state;
    }
  }
}
