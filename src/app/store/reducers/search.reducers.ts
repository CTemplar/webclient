import { SearchActionAll, SearchActionTypes } from '../actions/search.action';

export interface SearchState {
  searchText: string;
}

export const initialState: SearchState = { searchText: '' };

export function reducer(state = initialState, action: SearchActionAll): SearchState {
  switch (action.type) {
    case SearchActionTypes.CLEAR_SEARCH: {
      return { ...state };
    }
    default: {
      return state;
    }
  }
}
