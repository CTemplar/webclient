// Custom Action
import { BlogActionTypes, BlogActionAll } from '../actions/blog.actions';

// Model
import { BlogState } from '../datatypes';

export const initialState: BlogState = {
  posts: [],
  comments: [],
  categories: [],
  newPosts: [],
  errorMessage: null,
  relatedPosts: []
};

export function reducer(state = initialState, action: BlogActionAll): BlogState {
  switch (action.type) {
    case BlogActionTypes.PUT_POSTS: {
      state.posts = state.posts.concat(action.payload);
      state.newPosts = action.payload;
      return {
        ...state
      };
    }
    case BlogActionTypes.GET_COMMENTS: {
      state.comments = state.comments.concat(action.payload);
      return {
        ...state
      };
    }
    case BlogActionTypes.PUT_POST_DETAIL: {
      return {
        ...state,
        selectedPost: action.payload
      };
    }
    case BlogActionTypes.POST_COMMENT_FAILURE: {
      return {
        ...state,
        errorMessage: 'Failed'
      };
    }
    case BlogActionTypes.POST_COMMENT_SUCCESS: {
      return {
        ...state,
        errorMessage: 'success'
      };
    }

    case BlogActionTypes.PUT_RELATED_POSTS: {
      return {
        ...state,
        relatedPosts: action.payload
      };
    }
    default: {
      return state;
    }
  }
}
