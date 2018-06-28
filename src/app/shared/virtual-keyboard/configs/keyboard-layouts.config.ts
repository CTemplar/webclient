
import { InjectionToken } from '@angular/core';
import { KeyboardClassKey } from '../enums/keyboard-class-key.enum';
import { IKeyboardLayouts } from '../interfaces/keyboard-layouts.interface';

const MAT_KEYBOARD_LAYOUTS = new InjectionToken<IKeyboardLayouts>('keyboard-layouts.config');
const keyboardLayouts: IKeyboardLayouts = {

  'US Standard': {
    'name': 'US Standard',
    'keys': [
      [
        ['`', '~'],
        ['1', '!'],
        ['2', '@'],
        ['3', '#'],
        ['4', '$'],
        ['5', '%'],
        ['6', '^'],
        ['7', '&'],
        ['8', '*'],
        ['9', '('],
        ['0', ')'],
        ['-', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['[', '{'],
        [']', '}'],
        ['\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A'],
        ['s', 'S'],
        ['d', 'D'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L'],
        [';', ':'],
        ['\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        [',', '<'],
        ['.', '>'],
        ['/', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['en-US']
  },
  'US International': {
    'name': 'US International',
    'keys': [
      [
        ['`', '~'],
        ['1', '!', '\u00a1', '\u00b9'],
        ['2', '@', '\u00b2'],
        ['3', '#', '\u00b3'],
        ['4', '$', '\u00a4', '\u00a3'],
        ['5', '%', '\u20ac'],
        ['6', '^', '\u00bc'],
        ['7', '&', '\u00bd'],
        ['8', '*', '\u00be'],
        ['9', '(', '\u2018'],
        ['0', ')', '\u2019'],
        ['-', '_', '\u00a5'],
        ['=', '+', '\u00d7', '\u00f7'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q', '\u00e4', '\u00c4'],
        ['w', 'W', '\u00e5', '\u00c5'],
        ['e', 'E', '\u00e9', '\u00c9'],
        ['r', 'R', '\u00ae'],
        ['t', 'T', '\u00fe', '\u00de'],
        ['y', 'Y', '\u00fc', '\u00dc'],
        ['u', 'U', '\u00fa', '\u00da'],
        ['i', 'I', '\u00ed', '\u00cd'],
        ['o', 'O', '\u00f3', '\u00d3'],
        ['p', 'P', '\u00f6', '\u00d6'],
        ['[', '{', '\u00ab'],
        [']', '}', '\u00bb'],
        ['\\', '|', '\u00ac', '\u00a6']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A', '\u00e1', '\u00c1'],
        ['s', 'S', '\u00df', '\u00a7'],
        ['d', 'D', '\u00f0', '\u00d0'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L', '\u00f8', '\u00d8'],
        [';', ':', '\u00b6', '\u00b0'],
        ['\'', '"', '\u00b4', '\u00a8'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['z', 'Z', '\u00e6', '\u00c6'],
        ['x', 'X'],
        ['c', 'C', '\u00a9', '\u00a2'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N', '\u00f1', '\u00d1'],
        ['m', 'M', '\u00b5'],
        [',', '<', '\u00e7', '\u00c7'],
        ['.', '>'],
        ['/', '?', '\u00bf'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt]
      ]
    ],
    'lang': ['en']
  }
};



export { keyboardLayouts, MAT_KEYBOARD_LAYOUTS };
