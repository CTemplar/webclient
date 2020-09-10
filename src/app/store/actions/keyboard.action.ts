// Ngrx
import { Action } from '@ngrx/store';

export enum KeyboardActionTypes {
  KEYBOARD_FOCUSED = '[Keyboard] GetFocus',
  KEYBOARD_FOCUSED_OUT = '[Keyboard] GetFocusOut',
  KEY_PRESSED = '[Keyboard] KeyPressed',
  FOCUSED_INPUT = '[Keyboard] FocusedInput',
}

export class KeyboardFocus implements Action {
  readonly type = KeyboardActionTypes.KEYBOARD_FOCUSED;
  constructor(public payload: any) {}
}

export class KeyboardFocusOut implements Action {
  readonly type = KeyboardActionTypes.KEYBOARD_FOCUSED_OUT;
  constructor(public payload: any) {}
}

export class KeyPressed implements Action {
  readonly type = KeyboardActionTypes.KEY_PRESSED;
  constructor(public payload: any) {}
}

export class FocusedInputID implements Action {
  readonly type = KeyboardActionTypes.FOCUSED_INPUT;
  constructor(public payload: any) {}
}

export type KeyboardActionAll = KeyboardFocus | KeyboardFocusOut | KeyPressed | FocusedInputID;
