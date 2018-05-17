// Custom Action
import { KeyboardActionTypes, KeyboardActionAll } from '../actions';

// Model
import { KeyboardState } from '../datatypes';

export const initialState: KeyboardState = { keyboardFocused: false, keyPressed: {key: ''}, focusedInput: '' };

export function reducer(state = initialState, action: KeyboardActionAll): KeyboardState {
  switch (action.type) {
    case KeyboardActionTypes.KEYBOARD_FOCUSED: {
      if (action.payload.keyboard === false) {
       return {...state, keyboardFocused: false};
      }
      return { ...state, keyboardFocused: !state.keyboardFocused };
    }
    case KeyboardActionTypes.KEYBOARD_FOCUSED_OUT: {
      return initialState;
    }
    case KeyboardActionTypes.KEY_PRESSED: {
      return { ...state, keyPressed: action.payload };
    }
    case KeyboardActionTypes.FOCUSED_INPUT: {
      return { ...state, focusedInput: action.payload };
    }
    default: {
      return state;
    }
  }
}
