import { InjectionToken } from '@angular/core';
import { KeyboardClassKey } from '../enums/keyboard-class-key.enum';
import { IKeyboardIcons } from '../interfaces/keyboard-icons.interface';

const MAT_KEYBOARD_ICONS = new InjectionToken<IKeyboardIcons>('keyboard-icons.config');
const keyboardIcons: IKeyboardIcons = {
  [KeyboardClassKey.Bksp]: 'keyboard_backspace',
  [KeyboardClassKey.Caps]: 'keyboard_capslock',
  [KeyboardClassKey.Enter]: 'keyboard_return',
  [KeyboardClassKey.Shift]: 'keyboard_arrow_up',
  [KeyboardClassKey.Space]: ' ',
  [KeyboardClassKey.Tab]: 'keyboard_tab'
};

export { IKeyboardIcons, MAT_KEYBOARD_ICONS, keyboardIcons };
