import { SearchActionAll, SearchActionTypes } from '../actions/search.action';

export interface SearchState {
  searchText: string;
  clearSearch: boolean;
}

export const initialState: SearchState = { searchText: '', clearSearch: false };

export function reducer(state = initialState, action: SearchActionAll): SearchState {
  switch (action.type) {
    case SearchActionTypes.UPDATE_SEARCH: {
      return {
        ...state, searchText: action.payload.searchText,
        clearSearch: action.payload.clearSearch,
      };
    }
    case SearchActionTypes.CLEAR_SEARCH: {
      return { ...state, searchText: '', clearSearch: true };
    }
    default: {
      return state;
    }
  }
}
