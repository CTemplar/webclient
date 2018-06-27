/*
 * README from http://www.greywyvern.com/code/javascript/keyboard.js
 * ------
 *
 * - Lay out each keyboard in rows of sub-arrays.  Each sub-array
 *   represents one key.
 *
 * - Each sub-array consists of four slots described as follows:
 *     example: ["a", "A", "\u00e1", "\u00c1"]
 *
 *          a) Normal character
 *          A) Character + Shift/Caps
 *     \u00e1) Character + Alt/AltGr/AltLk
 *     \u00c1) Character + Shift/Caps + Alt/AltGr/AltLk
 *
 *   You may include sub-arrays which are fewer than four slots.
 *   In these cases, the missing slots will be blanked when the
 *   corresponding modifier key (Shift or AltGr) is pressed.
 *
 * - If the second slot of a sub-array matches one of the following
 *   strings:
 *     "Tab", "Caps", "Shift", "Enter", "Bksp",
 *     "Alt" OR "AltGr", "AltLk"
 *   then the function of the key will be the following,
 *   respectively:
 *     - Insert a tab
 *     - Toggle Caps Lock (technically a Shift Lock)
 *     - Next entered character will be the shifted character
 *     - Insert a newline (textarea), or close the keyboard
 *     - Delete the previous character
 *     - Next entered character will be the alternate character
 *     - Toggle Alt/AltGr Lock
 *
 *   The first slot of this sub-array will be the text to display
 *   on the corresponding key.  This allows for easy localisation
 *   of key names.
 *
 * - Layout dead keys (diacritic + letter) should be added as
 *   property/value pairs of objects with hash keys equal to the
 *   diacritic.  See the "this.VKI_deadkey" object below the layout
 *   definitions.  In each property/value pair, the value is what
 *   the diacritic would change the property name to.
 *
 * - Note that any characters beyond the normal ASCII set should be
 *   entered in escaped Unicode format.  (eg \u00a3 = Pound symbol)
 *   You can find Unicode values for characters here:
 *     http://unicode.org/charts/
 *
 * - To remove a keyboard, just delete it, or comment it out of the
 *   source code. If you decide to remove the US International
 *   keyboard layout, make sure you change the default layout
 *   (this.VKI_kt) above so it references an existing layout.
 *
 * CREDITS
 * -------
 *
 * See http://www.greywyvern.com/code/javascript/keyboard for examples
 * and usage instructions.
 *
 * Version 1.49 - November 8, 2011
 *   - Don't display language drop-down if only one keyboard available
 *
 *   See full changelog at:
 *     http://www.greywyvern.com/code/javascript/keyboard.changelog.txt
 *
 * Keyboard Credits
 *   - Yiddish (Yidish Lebt) keyboard layout by Simche Taub (jidysz.net)
 *   - Urdu Phonetic keyboard layout by Khalid Malik
 *   - Yiddish keyboard layout by Helmut Wollmersdorfer
 *   - Khmer keyboard layout by Sovann Heng (km-kh.com)
 *   - Dari keyboard layout by Saif Fazel
 *   - Kurdish keyboard layout by Ara Qadir
 *   - Assamese keyboard layout by Kanchan Gogoi
 *   - Bulgarian BDS keyboard layout by Milen Georgiev
 *   - Basic Japanese Hiragana/Katakana keyboard layout by Damjan
 *   - Ukrainian keyboard layout by Dmitry Nikitin
 *   - Macedonian keyboard layout by Damjan Dimitrioski
 *   - Pashto keyboard layout by Ahmad Wali Achakzai (qamosona.com)
 *   - Armenian Eastern and Western keyboard layouts by Hayastan Project (www.hayastan.co.uk)
 *   - Pinyin keyboard layout from a collaboration with Lou Winklemann
 *   - Kazakh keyboard layout by Alex Madyankin
 *   - Danish keyboard layout by Verner KjÃ¦rsgaard
 *   - Slovak keyboard layout by Daniel Lara (www.learningslovak.com)
 *   - Belarusian and Serbian Cyrillic keyboard layouts by Evgeniy Titov
 *   - Bulgarian Phonetic keyboard layout by Samuil Gospodinov
 *   - Swedish keyboard layout by HÃ¥kan Sandberg
 *   - Romanian keyboard layout by Aurel
 *   - Farsi (Persian) keyboard layout by Kaveh Bakhtiyari (www.bakhtiyari.com)
 *   - Burmese keyboard layout by Cetanapa
 *   - Bosnian/Croatian/Serbian Latin/Slovenian keyboard layout by Miran Zeljko
 *   - Hungarian keyboard layout by Antal Sall 'Hiromacu'
 *   - Arabic keyboard layout by Srinivas Reddy
 *   - Italian and Spanish (Spain) keyboard layouts by dictionarist.com
 *   - Lithuanian and Russian keyboard layouts by Ramunas
 *   - German keyboard layout by QuHno
 *   - French keyboard layout by Hidden Evil
 *   - Polish Programmers layout by moose
 *   - Turkish keyboard layouts by offcu
 *   - Dutch and US Int'l keyboard layouts by jerone
 *
 */
import { InjectionToken } from '@angular/core';
import { KeyboardClassKey } from '../enums/keyboard-class-key.enum';
import { IKeyboardLayouts } from '../interfaces/keyboard-layouts.interface';

const MAT_KEYBOARD_LAYOUTS = new InjectionToken<IKeyboardLayouts>('keyboard-layouts.config');
const keyboardLayouts: IKeyboardLayouts = {
  '\u0627\u0644\u0639\u0631\u0628\u064a\u0629': {
    'name': 'Arabic',
    'keys': [
      [
        ['\u0630', '\u0651 '],
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
        ['\u0636', '\u064e'],
        ['\u0635', '\u064b'],
        ['\u062b', '\u064f'],
        ['\u0642', '\u064c'],
        ['\u0641', '\u0644'],
        ['\u063a', '\u0625'],
        ['\u0639', '\u2018'],
        ['\u0647', '\u00f7'],
        ['\u062e', '\u00d7'],
        ['\u062d', '\u061b'],
        ['\u062c', '<'],
        ['\u062f', '>'],
        ['\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0634', '\u0650'],
        ['\u0633', '\u064d'],
        ['\u064a', ']'],
        ['\u0628', '['],
        ['\u0644', '\u0644'],
        ['\u0627', '\u0623'],
        ['\u062a', '\u0640'],
        ['\u0646', '\u060c'],
        ['\u0645', '/'],
        ['\u0643', ':'],
        ['\u0637', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0626', '~'],
        ['\u0621', '\u0652'],
        ['\u0624', '}'],
        ['\u0631', '{'],
        ['\u0644', '\u0644'],
        ['\u0649', '\u0622'],
        ['\u0629', '\u2019'],
        ['\u0648', ','],
        ['\u0632', '.'],
        ['\u0638', '\u061f'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt]
      ]
    ],
    'lang': ['ar']
  },
  '\u0985\u09b8\u09ae\u09c0\u09df\u09be': {
    'name': 'Assamese',
    'keys': [
      [
        ['+', '?'],
        ['\u09E7', '{', '\u09E7'],
        ['\u09E8', '}', '\u09E8'],
        ['\u09E9', '\u09CD\u09F0', '\u09E9'],
        ['\u09EA', '\u09F0\u09CD', '\u09EA'],
        ['\u09EB', '\u099C\u09CD\u09F0', '\u09EB'],
        ['\u09EC', '\u0995\u09CD\u09B7', '\u09EC'],
        ['\u09ED', '\u0995\u09CD\u09F0', '\u09ED'],
        ['\u09EE', '\u09B6\u09CD\u09F0', '\u09EE'],
        ['\u09EF', '(', '\u09EF'],
        ['\u09E6', ')', '\u09E6'],
        ['-', ''],
        ['\u09C3', '\u098B', '\u09E2', '\u09E0'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u09CC', '\u0994', '\u09D7'],
        ['\u09C8', '\u0990'],
        ['\u09BE', '\u0986'],
        ['\u09C0', '\u0988', '\u09E3', '\u09E1'],
        ['\u09C2', '\u098A'],
        ['\u09F1', '\u09AD'],
        ['\u09B9', '\u0999'],
        ['\u0997', '\u0998'],
        ['\u09A6', '\u09A7'],
        ['\u099C', '\u099D'],
        ['\u09A1', '\u09A2', '\u09DC', '\u09DD'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u09CB', '\u0993', '\u09F4', '\u09F5'],
        ['\u09C7', '\u098F', '\u09F6', '\u09F7'],
        ['\u09CD', '\u0985', '\u09F8', '\u09F9'],
        ['\u09BF', '\u0987', '\u09E2', '\u098C'],
        ['\u09C1', '\u0989'],
        ['\u09AA', '\u09AB'],
        ['\u09F0', '', '\u09F0', '\u09F1'],
        ['\u0995', '\u0996'],
        ['\u09A4', '\u09A5'],
        ['\u099A', '\u099B'],
        ['\u099F', '\u09A0'],
        ['\u09BC', '\u099E']
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u09CE', '\u0983'],
        ['\u0982', '\u0981', '\u09FA'],
        ['\u09AE', '\u09A3'],
        ['\u09A8', '\u09F7'],
        ['\u09AC', '"'],
        ['\u09B2', '\''],
        ['\u09B8', '\u09B6'],
        [',', '\u09B7'],
        ['.', ';'],
        ['\u09AF', '\u09DF'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['as']
  },
  '\u0410\u0437\u04d9\u0440\u0431\u0430\u0458\u04b9\u0430\u043d\u04b9\u0430': {
    'name': 'Azerbaijani Cyrillic',
    'keys': [
      [
        ['`', '~'],
        ['1', '!'],
        ['2', '"'],
        ['3', '\u2116'],
        ['4', ';'],
        ['5', '%'],
        ['6', ':'],
        ['7', '?'],
        ['8', '*'],
        ['9', '('],
        ['0', ')'],
        ['-', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0458', '\u0408'],
        ['\u04AF', '\u04AE'],
        ['\u0443', '\u0423'],
        ['\u043A', '\u041A'],
        ['\u0435', '\u0415'],
        ['\u043D', '\u041D'],
        ['\u0433', '\u0413'],
        ['\u0448', '\u0428'],
        ['\u04BB', '\u04BA'],
        ['\u0437', '\u0417'],
        ['\u0445', '\u0425'],
        ['\u04B9', '\u04B8'],
        ['\\', '/']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0444', '\u0424'],
        ['\u044B', '\u042B'],
        ['\u0432', '\u0412'],
        ['\u0430', '\u0410'],
        ['\u043F', '\u041F'],
        ['\u0440', '\u0420'],
        ['\u043E', '\u041E'],
        ['\u043B', '\u041B'],
        ['\u0434', '\u0414'],
        ['\u0436', '\u0416'],
        ['\u049D', '\u049C'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\\', '|'],
        ['\u04D9', '\u04D8'],
        ['\u0447', '\u0427'],
        ['\u0441', '\u0421'],
        ['\u043C', '\u041C'],
        ['\u0438', '\u0418'],
        ['\u0442', '\u0422'],
        ['\u0493', '\u0492'],
        ['\u0431', '\u0411'],
        ['\u04E9', '\u04E8'],
        ['.', ','],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['az-CYRL']
  },
  'Az\u0259rbaycanca': {
    'name': 'Azerbaijani Latin',
    'keys': [
      [
        ['`', '~'],
        ['1', '!'],
        ['2', '"'],
        ['3', '\u2166'],
        ['4', ';'],
        ['5', '%'],
        ['6', ':'],
        ['7', '?'],
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
        ['\u00FC', '\u00DC'],
        ['e', 'E'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', '\u0130'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00F6', '\u00D6'],
        ['\u011F', '\u011E'],
        ['\\', '/']
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
        ['\u0131', 'I'],
        ['\u0259', '\u018F'],
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
        ['\u00E7', '\u00C7'],
        ['\u015F', '\u015E'],
        ['.', ','],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['az']
  },
  '\u0411\u0435\u043b\u0430\u0440\u0443\u0441\u043a\u0430\u044f': {
    'name': 'Belarusian',
    'keys': [
      [
        ['\u0451', '\u0401'],
        ['1', '!'],
        ['2', '"'],
        ['3', '\u2116'],
        ['4', ';'],
        ['5', '%'],
        ['6', ':'],
        ['7', '?'],
        ['8', '*'],
        ['9', '('],
        ['0', ')'],
        ['-', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0439', '\u0419'],
        ['\u0446', '\u0426'],
        ['\u0443', '\u0423'],
        ['\u043a', '\u041a'],
        ['\u0435', '\u0415'],
        ['\u043d', '\u041d'],
        ['\u0433', '\u0413'],
        ['\u0448', '\u0428'],
        ['\u045e', '\u040e'],
        ['\u0437', '\u0417'],
        ['\u0445', '\u0425'],
        ['\'', '\''],
        ['\\', '/']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0444', '\u0424'],
        ['\u044b', '\u042b'],
        ['\u0432', '\u0412'],
        ['\u0430', '\u0410'],
        ['\u043f', '\u041f'],
        ['\u0440', '\u0420'],
        ['\u043e', '\u041e'],
        ['\u043b', '\u041b'],
        ['\u0434', '\u0414'],
        ['\u0436', '\u0416'],
        ['\u044d', '\u042d'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['/', '|'],
        ['\u044f', '\u042f'],
        ['\u0447', '\u0427'],
        ['\u0441', '\u0421'],
        ['\u043c', '\u041c'],
        ['\u0456', '\u0406'],
        ['\u0442', '\u0422'],
        ['\u044c', '\u042c'],
        ['\u0431', '\u0411'],
        ['\u044e', '\u042e'],
        ['.', ','],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['be']
  },
  'Belgische / Belge': {
    'name': 'Belgian',
    'keys': [
      [
        ['\u00b2', '\u00b3'],
        ['&', '1', '|'],
        ['\u00e9', '2', '@'],
        ['"', '3', '#'],
        ['\'', '4'],
        ['(', '5'],
        ['\u00a7', '6', '^'],
        ['\u00e8', '7'],
        ['!', '8'],
        ['\u00e7', '9', '{'],
        ['\u00e0', '0', '}'],
        [')', '\u00b0'],
        ['-', '_'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['a', 'A'],
        ['z', 'Z'],
        ['e', 'E', '\u20ac'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['^', '\u00a8', '['],
        ['$', '*', ']'],
        ['\u03bc', '\u00a3', '`']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['q', 'Q'],
        ['s', 'S'],
        ['d', 'D'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L'],
        ['m', 'M'],
        ['\u00f9', '%', '\u00b4'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>', '\\'],
        ['w', 'W'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        [',', '?'],
        [';', '.'],
        [':', '/'],
        ['=', '+', '~'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['nl-BE', 'fr-BE']
  },
  '\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438 \u0424\u043e\u043d\u0435\u0442\u0438\u0447\u0435\u043d': {
    'name': 'Bulgarian Phonetic',
    'keys': [
      [
        ['\u0447', '\u0427'],
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
        ['\u044F', '\u042F'],
        ['\u0432', '\u0412'],
        ['\u0435', '\u0415'],
        ['\u0440', '\u0420'],
        ['\u0442', '\u0422'],
        ['\u044A', '\u042A'],
        ['\u0443', '\u0423'],
        ['\u0438', '\u0418'],
        ['\u043E', '\u041E'],
        ['\u043F', '\u041F'],
        ['\u0448', '\u0428'],
        ['\u0449', '\u0429'],
        ['\u044E', '\u042E']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0430', '\u0410'],
        ['\u0441', '\u0421'],
        ['\u0434', '\u0414'],
        ['\u0444', '\u0424'],
        ['\u0433', '\u0413'],
        ['\u0445', '\u0425'],
        ['\u0439', '\u0419'],
        ['\u043A', '\u041A'],
        ['\u043B', '\u041B'],
        [';', ':'],
        ['\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0437', '\u0417'],
        ['\u044C', '\u042C'],
        ['\u0446', '\u0426'],
        ['\u0436', '\u0416'],
        ['\u0431', '\u0411'],
        ['\u043D', '\u041D'],
        ['\u043C', '\u041C'],
        [',', '<'],
        ['.', '>'],
        ['/', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['bg']
  },
  '\u0411\u044a\u043b\u0433\u0430\u0440\u0441\u043a\u0438': {
    'name': 'Bulgarian BDS',
    'keys': [
      [
        ['`', '~'],
        ['1', '!'],
        ['2', '?'],
        ['3', '+'],
        ['4', '"'],
        ['5', '%'],
        ['6', '='],
        ['7', ':'],
        ['8', '/'],
        ['9', '_'],
        ['0', '\u2116'],
        ['-', '\u0406'],
        ['=', 'V'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        [',', '\u044b'],
        ['\u0443', '\u0423'],
        ['\u0435', '\u0415'],
        ['\u0438', '\u0418'],
        ['\u0448', '\u0428'],
        ['\u0449', '\u0429'],
        ['\u043a', '\u041a'],
        ['\u0441', '\u0421'],
        ['\u0434', '\u0414'],
        ['\u0437', '\u0417'],
        ['\u0446', '\u0426'],
        [';', '\u00a7'],
        ['(', ')']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u044c', '\u042c'],
        ['\u044f', '\u042f'],
        ['\u0430', '\u0410'],
        ['\u043e', '\u041e'],
        ['\u0436', '\u0416'],
        ['\u0433', '\u0413'],
        ['\u0442', '\u0422'],
        ['\u043d', '\u041d'],
        ['\u0412', '\u0412'],
        ['\u043c', '\u041c'],
        ['\u0447', '\u0427'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u042e', '\u044e'],
        ['\u0439', '\u0419'],
        ['\u044a', '\u042a'],
        ['\u044d', '\u042d'],
        ['\u0444', '\u0424'],
        ['\u0445', '\u0425'],
        ['\u043f', '\u041f'],
        ['\u0440', '\u0420'],
        ['\u043b', '\u041b'],
        ['\u0431', '\u0411'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ]
  },
  '\u09ac\u09be\u0982\u09b2\u09be': {
    'name': 'Bengali',
    'keys': [
      [
        [''],
        ['1', '', '\u09E7'],
        ['2', '', '\u09E8'],
        ['3', '\u09CD\u09B0', '\u09E9'],
        ['4', '\u09B0\u09CD', '\u09EA'],
        ['5', '\u099C\u09CD\u09B0', '\u09EB'],
        ['6', '\u09A4\u09CD\u09B7', '\u09EC'],
        ['7', '\u0995\u09CD\u09B0', '\u09ED'],
        ['8', '\u09B6\u09CD\u09B0', '\u09EE'],
        ['9', '(', '\u09EF'],
        ['0', ')', '\u09E6'],
        ['-', '\u0983'],
        ['\u09C3', '\u098B', '\u09E2', '\u09E0'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u09CC', '\u0994', '\u09D7'],
        ['\u09C8', '\u0990'],
        ['\u09BE', '\u0986'],
        ['\u09C0', '\u0988', '\u09E3', '\u09E1'],
        ['\u09C2', '\u098A'],
        ['\u09AC', '\u09AD'],
        ['\u09B9', '\u0999'],
        ['\u0997', '\u0998'],
        ['\u09A6', '\u09A7'],
        ['\u099C', '\u099D'],
        ['\u09A1', '\u09A2', '\u09DC', '\u09DD'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u09CB', '\u0993', '\u09F4', '\u09F5'],
        ['\u09C7', '\u098F', '\u09F6', '\u09F7'],
        ['\u09CD', '\u0985', '\u09F8', '\u09F9'],
        ['\u09BF', '\u0987', '\u09E2', '\u098C'],
        ['\u09C1', '\u0989'],
        ['\u09AA', '\u09AB'],
        ['\u09B0', '', '\u09F0', '\u09F1'],
        ['\u0995', '\u0996'],
        ['\u09A4', '\u09A5'],
        ['\u099A', '\u099B'],
        ['\u099F', '\u09A0'],
        ['\u09BC', '\u099E']
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        [''],
        ['\u0982', '\u0981', '\u09FA'],
        ['\u09AE', '\u09A3'],
        ['\u09A8'],
        ['\u09AC'],
        ['\u09B2'],
        ['\u09B8', '\u09B6'],
        [',', '\u09B7'],
        ['.', '{'],
        ['\u09AF', '\u09DF'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['bn']
  },
  'Bosanski': {
    'name': 'Bosnian',
    'keys': [
      [
        ['\u00B8', '\u00A8'],
        ['1', '!', '~'],
        ['2', '"', '\u02C7'],
        ['3', '#', '^'],
        ['4', '$', '\u02D8'],
        ['5', '%', '\u00B0'],
        ['6', '&', '\u02DB'],
        ['7', '/', '`'],
        ['8', '(', '\u02D9'],
        ['9', ')', '\u00B4'],
        ['0', '=', '\u02DD'],
        ['\'', '?', '\u00A8'],
        ['+', '*', '\u00B8'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q', '\\'],
        ['w', 'W', '|'],
        ['e', 'E', '\u20AC'],
        ['r', 'R'],
        ['t', 'T'],
        ['z', 'Z'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u0161', '\u0160', '\u00F7'],
        ['\u0111', '\u0110', '\u00D7'],
        ['\u017E', '\u017D', '\u00A4']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A'],
        ['s', 'S'],
        ['d', 'D'],
        ['f', 'F', '['],
        ['g', 'G', ']'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K', '\u0142'],
        ['l', 'L', '\u0141'],
        ['\u010D', '\u010C'],
        ['\u0107', '\u0106', '\u00DF'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>'],
        ['y', 'Y'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V', '@'],
        ['b', 'B', '{'],
        ['n', 'N', '}'],
        ['m', 'M', '\u00A7'],
        [',', ';', '<'],
        ['.', ':', '>'],
        ['-', '_', '\u00A9'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['bs']
  },
  'Canadienne-fran\u00e7aise': {
    'name': 'Canadian French',
    'keys': [
      [
        ['#', '|', '\\'],
        ['1', '!', '\u00B1'],
        ['2', '"', '@'],
        ['3', '/', '\u00A3'],
        ['4', '$', '\u00A2'],
        ['5', '%', '\u00A4'],
        ['6', '?', '\u00AC'],
        ['7', '&', '\u00A6'],
        ['8', '*', '\u00B2'],
        ['9', '(', '\u00B3'],
        ['0', ')', '\u00BC'],
        ['-', '_', '\u00BD'],
        ['=', '+', '\u00BE'],
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
        ['o', 'O', '\u00A7'],
        ['p', 'P', '\u00B6'],
        ['^', '^', '['],
        ['\u00B8', '\u00A8', ']'],
        ['<', '>', '}']
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
        [';', ':', '~'],
        ['`', '`', '{'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u00AB', '\u00BB', '\u00B0'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M', '\u00B5'],
        [',', '\'', '\u00AF'],
        ['.', '.', '\u00AD'],
        ['\u00E9', '\u00C9', '\u00B4'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['fr-CA']
  },
  '\u010cesky': {
    'name': 'Czech',
    'keys': [
      [
        [';', '\u00b0', '`', '~'],
        ['+', '1', '!'],
        ['\u011B', '2', '@'],
        ['\u0161', '3', '#'],
        ['\u010D', '4', '$'],
        ['\u0159', '5', '%'],
        ['\u017E', '6', '^'],
        ['\u00FD', '7', '&'],
        ['\u00E1', '8', '*'],
        ['\u00ED', '9', '('],
        ['\u00E9', '0', ')'],
        ['=', '%', '-', '_'],
        ['\u00B4', '\u02c7', '=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E', '\u20AC'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00FA', '/', '[', '{'],
        [')', '(', ']', '}'],
        ['\u00A8', '\'', '\\', '|']
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
        ['\u016F', '"', ';', ':'],
        ['\u00A7', '!', '\u00a4', '^'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\\', '|', '', '\u02dd'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        [',', '?', '<', '\u00d7'],
        ['.', ':', '>', '\u00f7'],
        ['-', '_', '/', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt]
      ]
    ],
    'lang': ['cs']
  },
  'Dansk': {
    'name': 'Danish',
    'keys': [
      [
        ['\u00bd', '\u00a7'],
        ['1', '!'],
        ['2', '"', '@'],
        ['3', '#', '\u00a3'],
        ['4', '\u00a4', '$'],
        ['5', '%', '\u20ac'],
        ['6', '&'],
        ['7', '/', '{'],
        ['8', '(', '['],
        ['9', ')', ']'],
        ['0', '=', '}'],
        ['+', '?'],
        ['\u00b4', '`', '|'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E', '\u20ac'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00e5', '\u00c5'],
        ['\u00a8', '^', '~'],
        ['\'', '*']
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
        ['\u00e6', '\u00c6'],
        ['\u00f8', '\u00d8'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>', '\\'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M', '\u03bc', '\u039c'],
        [',', ';'],
        ['.', ':'],
        ['-', '_'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['da']
  },
  'Deutsch': {
    'name': 'German',
    'keys': [
      [
        ['^', '\u00b0'],
        ['1', '!'],
        ['2', '"', '\u00b2'],
        ['3', '\u00a7', '\u00b3'],
        ['4', '$'],
        ['5', '%'],
        ['6', '&'],
        ['7', '/', '{'],
        ['8', '(', '['],
        ['9', ')', ']'],
        ['0', '=', '}'],
        ['\u00df', '?', '\\'],
        ['\u00b4', '`'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q', '@'],
        ['w', 'W'],
        ['e', 'E', '\u20ac'],
        ['r', 'R'],
        ['t', 'T'],
        ['z', 'Z'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00fc', '\u00dc'],
        ['+', '*', '~'],
        ['#', '\'']
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
        ['\u00f6', '\u00d6'],
        ['\u00e4', '\u00c4'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>', '\u00a6'],
        ['y', 'Y'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M', '\u00b5'],
        [',', ';'],
        ['.', ':'],
        ['-', '_'],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['de']
  },
  'Dingbats': {
    'name': 'Dingbats',
    'keys': [
      [
        ['\u2764', '\u2765', '\u2766', '\u2767'],
        ['\u278a', '\u2780', '\u2776', '\u2768'],
        ['\u278b', '\u2781', '\u2777', '\u2769'],
        ['\u278c', '\u2782', '\u2778', '\u276a'],
        ['\u278d', '\u2783', '\u2779', '\u276b'],
        ['\u278e', '\u2784', '\u277a', '\u276c'],
        ['\u278f', '\u2785', '\u277b', '\u276d'],
        ['\u2790', '\u2786', '\u277c', '\u276e'],
        ['\u2791', '\u2787', '\u277d', '\u276f'],
        ['\u2792', '\u2788', '\u277e', '\u2770'],
        ['\u2793', '\u2789', '\u277f', '\u2771'],
        ['\u2795', '\u2796', '\u274c', '\u2797'],
        ['\u2702', '\u2704', '\u2701', '\u2703'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u2714', '\u2705', '\u2713'],
        ['\u2718', '\u2715', '\u2717', '\u2716'],
        ['\u271a', '\u2719', '\u271b', '\u271c'],
        ['\u271d', '\u271e', '\u271f', '\u2720'],
        ['\u2722', '\u2723', '\u2724', '\u2725'],
        ['\u2726', '\u2727', '\u2728', '\u2756'],
        ['\u2729', '\u272a', '\u272d', '\u2730'],
        ['\u272c', '\u272b', '\u272e', '\u272f'],
        ['\u2736', '\u2731', '\u2732', '\u2749'],
        ['\u273b', '\u273c', '\u273d', '\u273e'],
        ['\u2744', '\u2745', '\u2746', '\u2743'],
        ['\u2733', '\u2734', '\u2735', '\u2721'],
        ['\u2737', '\u2738', '\u2739', '\u273a']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u2799', '\u279a', '\u2798', '\u2758'],
        ['\u27b5', '\u27b6', '\u27b4', '\u2759'],
        ['\u27b8', '\u27b9', '\u27b7', '\u275a'],
        ['\u2794', '\u279c', '\u27ba', '\u27bb'],
        ['\u279d', '\u279e', '\u27a1', '\u2772'],
        ['\u27a9', '\u27aa', '\u27ab', '\u27ac'],
        ['\u27a4', '\u27a3', '\u27a2', '\u279b'],
        ['\u27b3', '\u27bc', '\u27bd', '\u2773'],
        ['\u27ad', '\u27ae', '\u27af', '\u27b1'],
        ['\u27a8', '\u27a6', '\u27a5', '\u27a7'],
        ['\u279f', '\u27a0', '\u27be', '\u27b2'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u270c', '\u270b', '\u270a', '\u270d'],
        ['\u274f', '\u2750', '\u2751', '\u2752'],
        ['\u273f', '\u2740', '\u2741', '\u2742'],
        ['\u2747', '\u2748', '\u274a', '\u274b'],
        ['\u2757', '\u2755', '\u2762', '\u2763'],
        ['\u2753', '\u2754', '\u27b0', '\u27bf'],
        ['\u270f', '\u2710', '\u270e', '\u2774'],
        ['\u2712', '\u2711', '\u274d', '\u274e'],
        ['\u2709', '\u2706', '\u2708', '\u2707'],
        ['\u275b', '\u275d', '\u2761', '\u2775'],
        ['\u275c', '\u275e', '\u275f', '\u2760'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.AltLk, KeyboardClassKey.AltLk, KeyboardClassKey.AltLk, KeyboardClassKey.AltLk],
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ]
  },
  '\u078b\u07a8\u0788\u07ac\u0780\u07a8\u0784\u07a6\u0790\u07b0': {
    'name': 'Divehi',
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
        ['9', ')'],
        ['0', '('],
        ['-', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u07ab', '\u00d7'],
        ['\u07ae', '\u2019'],
        ['\u07a7', '\u201c'],
        ['\u07a9', '/'],
        ['\u07ad', ':'],
        ['\u078e', '\u07a4'],
        ['\u0783', '\u079c'],
        ['\u0789', '\u07a3'],
        ['\u078c', '\u07a0'],
        ['\u0780', '\u0799'],
        ['\u078d', '\u00f7'],
        ['[', '{'],
        [']', '}']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u07a8', '<'],
        ['\u07aa', '>'],
        ['\u07b0', '.', ',', ','],
        ['\u07a6', '\u060c'],
        ['\u07ac', '"'],
        ['\u0788', '\u07a5'],
        ['\u0787', '\u07a2'],
        ['\u0782', '\u0798'],
        ['\u0786', '\u079a'],
        ['\u078a', '\u07a1'],
        ['\ufdf2', '\u061b', ';', ';'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\\', '|'],
        ['\u0792', '\u0796'],
        ['\u0791', '\u0795'],
        ['\u0790', '\u078f'],
        ['\u0794', '\u0797', '\u200D'],
        ['\u0785', '\u079f', '\u200C'],
        ['\u078b', '\u079b', '\u200E'],
        ['\u0784', '\u079D', '\u200F'],
        ['\u0781', '\\'],
        ['\u0793', '\u079e'],
        ['\u07af', '\u061f'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['dv']
  },
  'Dvorak': {
    'name': 'Dvorak',
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
        ['[', '{'],
        [']', '}'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\'', '"'],
        [',', '<'],
        ['.', '>'],
        ['p', 'P'],
        ['y', 'Y'],
        ['f', 'F'],
        ['g', 'G'],
        ['c', 'C'],
        ['r', 'R'],
        ['l', 'L'],
        ['/', '?'],
        ['=', '+'],
        ['\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A'],
        ['o', 'O'],
        ['e', 'E'],
        ['u', 'U'],
        ['i', 'I'],
        ['d', 'D'],
        ['h', 'H'],
        ['t', 'T'],
        ['n', 'N'],
        ['s', 'S'],
        ['-', '_'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        [';', ':'],
        ['q', 'Q'],
        ['j', 'J'],
        ['k', 'K'],
        ['x', 'X'],
        ['b', 'B'],
        ['m', 'M'],
        ['w', 'W'],
        ['v', 'V'],
        ['z', 'Z'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ]
  },
  '\u0395\u03bb\u03bb\u03b7\u03bd\u03b9\u03ba\u03ac': {
    'name': 'Greek',
    'keys': [
      [
        ['`', '~'],
        ['1', '!'],
        ['2', '@', '\u00b2'],
        ['3', '#', '\u00b3'],
        ['4', '$', '\u00a3'],
        ['5', '%', '\u00a7'],
        ['6', '^', '\u00b6'],
        ['7', '&'],
        ['8', '*', '\u00a4'],
        ['9', '(', '\u00a6'],
        ['0', ')', '\u00ba'],
        ['-', '_', '\u00b1'],
        ['=', '+', '\u00bd'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        [';', ':'],
        ['\u03c2', '^'],
        ['\u03b5', '\u0395'],
        ['\u03c1', '\u03a1'],
        ['\u03c4', '\u03a4'],
        ['\u03c5', '\u03a5'],
        ['\u03b8', '\u0398'],
        ['\u03b9', '\u0399'],
        ['\u03bf', '\u039f'],
        ['\u03c0', '\u03a0'],
        ['[', '{', '\u201c'],
        [']', '}', '\u201d'],
        ['\\', '|', '\u00ac']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u03b1', '\u0391'],
        ['\u03c3', '\u03a3'],
        ['\u03b4', '\u0394'],
        ['\u03c6', '\u03a6'],
        ['\u03b3', '\u0393'],
        ['\u03b7', '\u0397'],
        ['\u03be', '\u039e'],
        ['\u03ba', '\u039a'],
        ['\u03bb', '\u039b'],
        ['\u0384', '\u00a8', '\u0385'],
        ['\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>'],
        ['\u03b6', '\u0396'],
        ['\u03c7', '\u03a7'],
        ['\u03c8', '\u03a8'],
        ['\u03c9', '\u03a9'],
        ['\u03b2', '\u0392'],
        ['\u03bd', '\u039d'],
        ['\u03bc', '\u039c'],
        [',', '<'],
        ['.', '>'],
        ['/', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['el']
  },
  'Eesti': {
    'name': 'Estonian',
    'keys': [
      [
        ['\u02C7', '~'],
        ['1', '!'],
        ['2', '"', '@', '@'],
        ['3', '#', '\u00A3', '\u00A3'],
        ['4', '\u00A4', '$', '$'],
        ['5', '%', '\u20AC'],
        ['6', '&'],
        ['7', '/', '{', '{'],
        ['8', '(', '[', '['],
        ['9', ')', ']', ']'],
        ['0', '=', '}', '}'],
        ['+', '?', '\\', '\\'],
        ['\u00B4', '`'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E', '\u20AC'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00FC', '\u00DC'],
        ['\u00F5', '\u00D5', '\u00A7', '\u00A7'],
        ['\'', '*', '\u00BD', '\u00BD']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A'],
        ['s', 'S', '\u0161', '\u0160'],
        ['d', 'D'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L'],
        ['\u00F6', '\u00D6'],
        ['\u00E4', '\u00C4', '^', '^'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>', '|', '|'],
        ['z', 'Z', '\u017E', '\u017D'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        [',', ';'],
        ['.', ':'],
        ['-', '_'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['et']
  },
  'Espa\u00f1ol': {
    'name': 'Spanish',
    'keys': [
      [
        ['\u00ba', '\u00aa', '\\'],
        ['1', '!', '|'],
        ['2', '"', '@'],
        ['3', '\'', '#'],
        ['4', '$', '~'],
        ['5', '%', '\u20ac'],
        ['6', '&', '\u00ac'],
        ['7', '/'],
        ['8', '('],
        ['9', ')'],
        ['0', '='],
        ['\'', '?'],
        ['\u00a1', '\u00bf'],
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
        ['`', '^', '['],
        ['+', '*', ']'],
        ['\u00e7', '\u00c7', '}']
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
        ['\u00f1', '\u00d1'],
        ['\u00b4', '\u00a8', '{'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        [',', ';'],
        ['.', ':'],
        ['-', '_'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['es']
  },
  '\u062f\u0631\u06cc': {
    'name': 'Dari',
    'keys': [
      [
        ['\u200D', '\u00F7', '~'],
        ['\u06F1', '!', '`'],
        ['\u06F2', '\u066C', '@'],
        ['\u06F3', '\u066B', '#'],
        ['\u06F4', '\u060B', '$'],
        ['\u06F5', '\u066A', '%'],
        ['\u06F6', '\u00D7', '^'],
        ['\u06F7', '\u060C', '&'],
        ['\u06F8', '*', '\u2022'],
        ['\u06F9', ')', '\u200E'],
        ['\u06F0', '(', '\u200F'],
        ['-', '\u0640', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0636', '\u0652', '\u00B0'],
        ['\u0635', '\u064C'],
        ['\u062B', '\u064D', '\u20AC'],
        ['\u0642', '\u064B', '\uFD3E'],
        ['\u0641', '\u064F', '\uFD3F'],
        ['\u063A', '\u0650', '\u0656'],
        ['\u0639', '\u064E', '\u0659'],
        ['\u0647', '\u0651', '\u0655'],
        ['\u062E', ']', '\''],
        ['\u062D', '[', '"'],
        ['\u062C', '}', '\u0681'],
        ['\u0686', '{', '\u0685'],
        ['\\', '|', '?']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0634', '\u0624', '\u069A'],
        ['\u0633', '\u0626', '\u06CD'],
        ['\u06CC', '\u064A', '\u0649'],
        ['\u0628', '\u0625', '\u06D0'],
        ['\u0644', '\u0623', '\u06B7'],
        ['\u0627', '\u0622', '\u0671'],
        ['\u062A', '\u0629', '\u067C'],
        ['\u0646', '\u00BB', '\u06BC'],
        ['\u0645', '\u00AB', '\u06BA'],
        ['\u06A9', ':', ';'],
        ['\u06AF', '\u061B', '\u06AB'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0638', '\u0643', '\u06D2'],
        ['\u0637', '\u0653', '\u0691'],
        ['\u0632', '\u0698', '\u0696'],
        ['\u0631', '\u0670', '\u0693'],
        ['\u0630', '\u200C', '\u0688'],
        ['\u062F', '\u0654', '\u0689'],
        ['\u067E', '\u0621', '\u0679'],
        ['\u0648', '>', ','],
        ['.', '<', '\u06C7'],
        ['/', '\u061F', '\u06C9'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['fa-AF']
  },
  '\u0641\u0627\u0631\u0633\u06cc': {
    'name': 'Farsi',
    'keys': [
      [
        ['\u067e', '\u0651 '],
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
        ['\u0636', '\u064e'],
        ['\u0635', '\u064b'],
        ['\u062b', '\u064f'],
        ['\u0642', '\u064c'],
        ['\u0641', '\u0644'],
        ['\u063a', '\u0625'],
        ['\u0639', '\u2018'],
        ['\u0647', '\u00f7'],
        ['\u062e', '\u00d7'],
        ['\u062d', '\u061b'],
        ['\u062c', '<'],
        ['\u0686', '>'],
        ['\u0698', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0634', '\u0650'],
        ['\u0633', '\u064d'],
        ['\u064a', ']'],
        ['\u0628', '['],
        ['\u0644', '\u0644'],
        ['\u0627', '\u0623'],
        ['\u062a', '\u0640'],
        ['\u0646', '\u060c'],
        ['\u0645', '\\'],
        ['\u06af', ':'],
        ['\u0643', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0638', '~'],
        ['\u0637', '\u0652'],
        ['\u0632', '}'],
        ['\u0631', '{'],
        ['\u0630', '\u0644'],
        ['\u062f', '\u0622'],
        ['\u0626', '\u0621'],
        ['\u0648', ','],
        ['.', '.'],
        ['/', '\u061f'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt]
      ]
    ],
    'lang': ['fa']
  },
  'F\u00f8royskt': {
    'name': 'Faeroese',
    'keys': [
      [
        ['\u00BD', '\u00A7'],
        ['1', '!'],
        ['2', '"', '@'],
        ['3', '#', '\u00A3'],
        ['4', '\u00A4', '$'],
        ['5', '%', '\u20AC'],
        ['6', '&'],
        ['7', '/', '{'],
        ['8', '(', '['],
        ['9', ')', ']'],
        ['0', '=', '}'],
        ['+', '?'],
        ['\u00B4', '`', '|'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E', '\u20AC'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00E5', '\u00C5', '\u00A8'],
        ['\u00F0', '\u00D0', '~'],
        ['\'', '*']
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
        ['\u00E6', '\u00C6'],
        ['\u00F8', '\u00D8', '^'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>', '\\'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M', '\u00B5'],
        [',', ';'],
        ['.', ':'],
        ['-', '_'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['fo']
  },
  'Fran\u00e7ais': {
    'name': 'French',
    'keys': [
      [
        ['\u00b2', '\u00b3'],
        ['&', '1'],
        ['\u00e9', '2', '~'],
        ['"', '3', '#'],
        ['\'', '4', '{'],
        ['(', '5', '['],
        ['-', '6', '|'],
        ['\u00e8', '7', '`'],
        ['_', '8', '\\'],
        ['\u00e7', '9', '^'],
        ['\u00e0', '0', '@'],
        [')', '\u00b0', ']'],
        ['=', '+', '}'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['a', 'A'],
        ['z', 'Z'],
        ['e', 'E', '\u20ac'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['^', '\u00a8'],
        ['$', '\u00a3', '\u00a4'],
        ['*', '\u03bc']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['q', 'Q'],
        ['s', 'S'],
        ['d', 'D'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L'],
        ['m', 'M'],
        ['\u00f9', '%'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>'],
        ['w', 'W'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        [',', '?'],
        [';', '.'],
        [':', '/'],
        ['!', '\u00a7'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['fr']
  },
  'Gaeilge': {
    'name': 'Irish / Gaelic',
    'keys': [
      [
        ['`', '\u00AC', '\u00A6', '\u00A6'],
        ['1', '!'],
        ['2', '"'],
        ['3', '\u00A3'],
        ['4', '$', '\u20AC'],
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
        ['e', 'E', '\u00E9', '\u00C9'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y', '\u00FD', '\u00DD'],
        ['u', 'U', '\u00FA', '\u00DA'],
        ['i', 'I', '\u00ED', '\u00CD'],
        ['o', 'O', '\u00F3', '\u00D3'],
        ['p', 'P'],
        ['[', '{'],
        [']', '}'],
        ['#', '~']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A', '\u00E1', '\u00C1'],
        ['s', 'S'],
        ['d', 'D'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L'],
        [';', ':'],
        ['\'', '@', '\u00B4', '`'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\\', '|'],
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
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['ga', 'gd']
  },
  '\u0a97\u0ac1\u0a9c\u0ab0\u0abe\u0aa4\u0ac0': {
    'name': 'Gujarati',
    'keys': [
      [
        [''],
        ['1', '\u0A8D', '\u0AE7'],
        ['2', '\u0AC5', '\u0AE8'],
        ['3', '\u0ACD\u0AB0', '\u0AE9'],
        ['4', '\u0AB0\u0ACD', '\u0AEA'],
        ['5', '\u0A9C\u0ACD\u0A9E', '\u0AEB'],
        ['6', '\u0AA4\u0ACD\u0AB0', '\u0AEC'],
        ['7', '\u0A95\u0ACD\u0AB7', '\u0AED'],
        ['8', '\u0AB6\u0ACD\u0AB0', '\u0AEE'],
        ['9', '(', '\u0AEF'],
        ['0', ')', '\u0AE6'],
        ['-', '\u0A83'],
        ['\u0AC3', '\u0A8B', '\u0AC4', '\u0AE0'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0ACC', '\u0A94'],
        ['\u0AC8', '\u0A90'],
        ['\u0ABE', '\u0A86'],
        ['\u0AC0', '\u0A88'],
        ['\u0AC2', '\u0A8A'],
        ['\u0AAC', '\u0AAD'],
        ['\u0AB9', '\u0A99'],
        ['\u0A97', '\u0A98'],
        ['\u0AA6', '\u0AA7'],
        ['\u0A9C', '\u0A9D'],
        ['\u0AA1', '\u0AA2'],
        ['\u0ABC', '\u0A9E'],
        ['\u0AC9', '\u0A91']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0ACB', '\u0A93'],
        ['\u0AC7', '\u0A8F'],
        ['\u0ACD', '\u0A85'],
        ['\u0ABF', '\u0A87'],
        ['\u0AC1', '\u0A89'],
        ['\u0AAA', '\u0AAB'],
        ['\u0AB0'],
        ['\u0A95', '\u0A96'],
        ['\u0AA4', '\u0AA5'],
        ['\u0A9A', '\u0A9B'],
        ['\u0A9F', '\u0AA0'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        [''],
        ['\u0A82', '\u0A81', '', '\u0AD0'],
        ['\u0AAE', '\u0AA3'],
        ['\u0AA8'],
        ['\u0AB5'],
        ['\u0AB2', '\u0AB3'],
        ['\u0AB8', '\u0AB6'],
        [',', '\u0AB7'],
        ['.', '\u0964', '\u0965', '\u0ABD'],
        ['\u0AAF'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['gu']
  },
  '\u05e2\u05d1\u05e8\u05d9\u05ea': {
    'name': 'Hebrew',
    'keys': [
      [
        ['~', '`'],
        ['1', '!'],
        ['2', '@'],
        ['3', '#'],
        ['4', '$', '\u20aa'],
        ['5', '%'],
        ['6', '^'],
        ['7', '&'],
        ['8', '*'],
        ['9', ')'],
        ['0', '('],
        ['-', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['/', 'Q'],
        ['\'', 'W'],
        ['\u05e7', 'E', '\u20ac'],
        ['\u05e8', 'R'],
        ['\u05d0', 'T'],
        ['\u05d8', 'Y'],
        ['\u05d5', 'U', '\u05f0'],
        ['\u05df', 'I'],
        ['\u05dd', 'O'],
        ['\u05e4', 'P'],
        ['\\', '|'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u05e9', 'A'],
        ['\u05d3', 'S'],
        ['\u05d2', 'D'],
        ['\u05db', 'F'],
        ['\u05e2', 'G'],
        ['\u05d9', 'H', '\u05f2'],
        ['\u05d7', 'J', '\u05f1'],
        ['\u05dc', 'K'],
        ['\u05da', 'L'],
        ['\u05e3', ':'],
        [',', '"'],
        [']', '}'],
        ['[', '{']
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u05d6', 'Z'],
        ['\u05e1', 'X'],
        ['\u05d1', 'C'],
        ['\u05d4', 'V'],
        ['\u05e0', 'B'],
        ['\u05de', 'N'],
        ['\u05e6', 'M'],
        ['\u05ea', '>'],
        ['\u05e5', '<'],
        ['.', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['he']
  },
  '\u0926\u0947\u0935\u0928\u093e\u0917\u0930\u0940': {
    'name': 'Devanagari',
    'keys': [
      [
        ['\u094A', '\u0912'],
        ['1', '\u090D', '\u0967'],
        ['2', '\u0945', '\u0968'],
        ['3', '\u094D\u0930', '\u0969'],
        ['4', '\u0930\u094D', '\u096A'],
        ['5', '\u091C\u094D\u091E', '\u096B'],
        ['6', '\u0924\u094D\u0930', '\u096C'],
        ['7', '\u0915\u094D\u0937', '\u096D'],
        ['8', '\u0936\u094D\u0930', '\u096E'],
        ['9', '(', '\u096F'],
        ['0', ')', '\u0966'],
        ['-', '\u0903'],
        ['\u0943', '\u090B', '\u0944', '\u0960'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u094C', '\u0914'],
        ['\u0948', '\u0910'],
        ['\u093E', '\u0906'],
        ['\u0940', '\u0908', '\u0963', '\u0961'],
        ['\u0942', '\u090A'],
        ['\u092C', '\u092D'],
        ['\u0939', '\u0919'],
        ['\u0917', '\u0918', '\u095A'],
        ['\u0926', '\u0927'],
        ['\u091C', '\u091D', '\u095B'],
        ['\u0921', '\u0922', '\u095C', '\u095D'],
        ['\u093C', '\u091E'],
        ['\u0949', '\u0911']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u094B', '\u0913'],
        ['\u0947', '\u090F'],
        ['\u094D', '\u0905'],
        ['\u093F', '\u0907', '\u0962', '\u090C'],
        ['\u0941', '\u0909'],
        ['\u092A', '\u092B', '', '\u095E'],
        ['\u0930', '\u0931'],
        ['\u0915', '\u0916', '\u0958', '\u0959'],
        ['\u0924', '\u0925'],
        ['\u091A', '\u091B', '\u0952'],
        ['\u091F', '\u0920', '', '\u0951'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0946', '\u090E', '\u0953'],
        ['\u0902', '\u0901', '', '\u0950'],
        ['\u092E', '\u0923', '\u0954'],
        ['\u0928', '\u0929'],
        ['\u0935', '\u0934'],
        ['\u0932', '\u0933'],
        ['\u0938', '\u0936'],
        [',', '\u0937', '\u0970'],
        ['.', '\u0964', '\u0965', '\u093D'],
        ['\u092F', '\u095F'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['hi-DEVA']
  },
  '\u0939\u093f\u0902\u0926\u0940': {
    'name': 'Hindi',
    'keys': [
      [
        ['\u200d', '\u200c', '`', '~'],
        ['1', '\u090D', '\u0967', '!'],
        ['2', '\u0945', '\u0968', '@'],
        ['3', '\u094D\u0930', '\u0969', '#'],
        ['4', '\u0930\u094D', '\u096A', '$'],
        ['5', '\u091C\u094D\u091E', '\u096B', '%'],
        ['6', '\u0924\u094D\u0930', '\u096C', '^'],
        ['7', '\u0915\u094D\u0937', '\u096D', '&'],
        ['8', '\u0936\u094D\u0930', '\u096E', '*'],
        ['9', '(', '\u096F', '('],
        ['0', ')', '\u0966', ')'],
        ['-', '\u0903', '-', '_'],
        ['\u0943', '\u090B', '=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u094C', '\u0914'],
        ['\u0948', '\u0910'],
        ['\u093E', '\u0906'],
        ['\u0940', '\u0908'],
        ['\u0942', '\u090A'],
        ['\u092C', '\u092D'],
        ['\u0939', '\u0919'],
        ['\u0917', '\u0918'],
        ['\u0926', '\u0927'],
        ['\u091C', '\u091D'],
        ['\u0921', '\u0922', '[', '{'],
        ['\u093C', '\u091E', ']', '}'],
        ['\u0949', '\u0911', '\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u094B', '\u0913'],
        ['\u0947', '\u090F'],
        ['\u094D', '\u0905'],
        ['\u093F', '\u0907'],
        ['\u0941', '\u0909'],
        ['\u092A', '\u092B'],
        ['\u0930', '\u0931'],
        ['\u0915', '\u0916'],
        ['\u0924', '\u0925'],
        ['\u091A', '\u091B', ';', ':'],
        ['\u091F', '\u0920', '\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        [''],
        ['\u0902', '\u0901', '', '\u0950'],
        ['\u092E', '\u0923'],
        ['\u0928'],
        ['\u0935'],
        ['\u0932', '\u0933'],
        ['\u0938', '\u0936'],
        [',', '\u0937', ',', '<'],
        ['.', '\u0964', '.', '>'],
        ['\u092F', '\u095F', '/', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['hi']
  },
  '\u0540\u0561\u0575\u0565\u0580\u0565\u0576 \u0561\u0580\u0565\u0582\u0574\u0578\u0582\u057f\u0584': {
    'name': 'Western Armenian',
    'keys': [
      [
        ['\u055D', '\u055C'],
        [':', '1'],
        ['\u0571', '\u0541'],
        ['\u0575', '\u0545'],
        ['\u055B', '3'],
        [',', '4'],
        ['-', '9'],
        ['.', '\u0587'],
        ['\u00AB', '('],
        ['\u00BB', ')'],
        ['\u0585', '\u0555'],
        ['\u057C', '\u054C'],
        ['\u056A', '\u053A'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u056D', '\u053D'],
        ['\u057E', '\u054E'],
        ['\u0567', '\u0537'],
        ['\u0580', '\u0550'],
        ['\u0564', '\u0534'],
        ['\u0565', '\u0535'],
        ['\u0568', '\u0538'],
        ['\u056B', '\u053B'],
        ['\u0578', '\u0548'],
        ['\u0562', '\u0532'],
        ['\u0579', '\u0549'],
        ['\u057B', '\u054B'],
        ['\'', '\u055E']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0561', '\u0531'],
        ['\u057D', '\u054D'],
        ['\u057F', '\u054F'],
        ['\u0586', '\u0556'],
        ['\u056F', '\u053F'],
        ['\u0570', '\u0540'],
        ['\u0573', '\u0543'],
        ['\u0584', '\u0554'],
        ['\u056C', '\u053C'],
        ['\u0569', '\u0539'],
        ['\u0583', '\u0553'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0566', '\u0536'],
        ['\u0581', '\u0551'],
        ['\u0563', '\u0533'],
        ['\u0582', '\u0552'],
        ['\u057A', '\u054A'],
        ['\u0576', '\u0546'],
        ['\u0574', '\u0544'],
        ['\u0577', '\u0547'],
        ['\u0572', '\u0542'],
        ['\u056E', '\u053E'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['hy-AREVMATA']
  },
  '\u0540\u0561\u0575\u0565\u0580\u0565\u0576 \u0561\u0580\u0565\u0582\u0565\u056c\u0584': {
    'name': 'Eastern Armenian',
    'keys': [
      [
        ['\u055D', '\u055C'],
        [':', '1'],
        ['\u0571', '\u0541'],
        ['\u0575', '\u0545'],
        ['\u055B', '3'],
        [',', '4'],
        ['-', '9'],
        ['.', '\u0587'],
        ['\u00AB', '('],
        ['\u00BB', ')'],
        ['\u0585', '\u0555'],
        ['\u057C', '\u054C'],
        ['\u056A', '\u053A'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u056D', '\u053D'],
        ['\u0582', '\u0552'],
        ['\u0567', '\u0537'],
        ['\u0580', '\u0550'],
        ['\u057F', '\u054F'],
        ['\u0565', '\u0535'],
        ['\u0568', '\u0538'],
        ['\u056B', '\u053B'],
        ['\u0578', '\u0548'],
        ['\u057A', '\u054A'],
        ['\u0579', '\u0549'],
        ['\u057B', '\u054B'],
        ['\'', '\u055E']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0561', '\u0531'],
        ['\u057D', '\u054D'],
        ['\u0564', '\u0534'],
        ['\u0586', '\u0556'],
        ['\u0584', '\u0554'],
        ['\u0570', '\u0540'],
        ['\u0573', '\u0543'],
        ['\u056F', '\u053F'],
        ['\u056C', '\u053C'],
        ['\u0569', '\u0539'],
        ['\u0583', '\u0553'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0566', '\u0536'],
        ['\u0581', '\u0551'],
        ['\u0563', '\u0533'],
        ['\u057E', '\u054E'],
        ['\u0562', '\u0532'],
        ['\u0576', '\u0546'],
        ['\u0574', '\u0544'],
        ['\u0577', '\u0547'],
        ['\u0572', '\u0542'],
        ['\u056E', '\u053E'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['hy']
  },
  '\u00cdslenska': {
    'name': 'Icelandic',
    'keys': [
      [
        ['\u00B0', '\u00A8', '\u00B0'],
        ['1', '!'],
        ['2', '"'],
        ['3', '#'],
        ['4', '$'],
        ['5', '%', '\u20AC'],
        ['6', '&'],
        ['7', '/', '{'],
        ['8', '(', '['],
        ['9', ')', ']'],
        ['0', '=', '}'],
        ['\u00F6', '\u00D6', '\\'],
        ['-', '_'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q', '@'],
        ['w', 'W'],
        ['e', 'E', '\u20AC'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00F0', '\u00D0'],
        ['\'', '?', '~'],
        ['+', '*', '`']
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
        ['\u00E6', '\u00C6'],
        ['\u00B4', '\'', '^'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>', '|'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M', '\u00B5'],
        [',', ';'],
        ['.', ':'],
        ['\u00FE', '\u00DE'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['is']
  },
  'Italiano': {
    'name': 'Italian',
    'keys': [
      [
        ['\\', '|'],
        ['1', '!'],
        ['2', '"'],
        ['3', '\u00a3'],
        ['4', '$', '\u20ac'],
        ['5', '%'],
        ['6', '&'],
        ['7', '/'],
        ['8', '('],
        ['9', ')'],
        ['0', '='],
        ['\'', '?'],
        ['\u00ec', '^'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E', '\u20ac'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00e8', '\u00e9', '[', '{'],
        ['+', '*', ']', '}'],
        ['\u00f9', '\u00a7']
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
        ['\u00f2', '\u00e7', '@'],
        ['\u00e0', '\u00b0', '#'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        [',', ';'],
        ['.', ':'],
        ['-', '_'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['it']
  },
  '\u65e5\u672c\u8a9e': {
    'name': 'Japanese Hiragana/Katakana',
    'keys': [
      [
        ['\uff5e'],
        ['\u306c', '\u30cc'],
        ['\u3075', '\u30d5'],
        ['\u3042', '\u30a2', '\u3041', '\u30a1'],
        ['\u3046', '\u30a6', '\u3045', '\u30a5'],
        ['\u3048', '\u30a8', '\u3047', '\u30a7'],
        ['\u304a', '\u30aa', '\u3049', '\u30a9'],
        ['\u3084', '\u30e4', '\u3083', '\u30e3'],
        ['\u3086', '\u30e6', '\u3085', '\u30e5'],
        ['\u3088', '\u30e8', '\u3087', '\u30e7'],
        ['\u308f', '\u30ef', '\u3092', '\u30f2'],
        ['\u307b', '\u30db', '\u30fc', '\uff1d'],
        ['\u3078', '\u30d8', '\uff3e', '\uff5e'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u305f', '\u30bf'],
        ['\u3066', '\u30c6'],
        ['\u3044', '\u30a4', '\u3043', '\u30a3'],
        ['\u3059', '\u30b9'],
        ['\u304b', '\u30ab'],
        ['\u3093', '\u30f3'],
        ['\u306a', '\u30ca'],
        ['\u306b', '\u30cb'],
        ['\u3089', '\u30e9'],
        ['\u305b', '\u30bb'],
        ['\u3001', '\u3001', '\uff20', '\u2018'],
        ['\u3002', '\u3002', '\u300c', '\uff5b'],
        ['\uffe5', '', '', '\uff0a'],
        ['\u309B', '"', '\uffe5', '\uff5c']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u3061', '\u30c1'],
        ['\u3068', '\u30c8'],
        ['\u3057', '\u30b7'],
        ['\u306f', '\u30cf'],
        ['\u304d', '\u30ad'],
        ['\u304f', '\u30af'],
        ['\u307e', '\u30de'],
        ['\u306e', '\u30ce'],
        ['\u308c', '\u30ec', '\uff1b', '\uff0b'],
        ['\u3051', '\u30b1', '\uff1a', '\u30f6'],
        ['\u3080', '\u30e0', '\u300d', '\uff5d'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u3064', '\u30c4'],
        ['\u3055', '\u30b5'],
        ['\u305d', '\u30bd'],
        ['\u3072', '\u30d2'],
        ['\u3053', '\u30b3'],
        ['\u307f', '\u30df'],
        ['\u3082', '\u30e2'],
        ['\u306d', '\u30cd', '\u3001', '\uff1c'],
        ['\u308b', '\u30eb', '\u3002', '\uff1e'],
        ['\u3081', '\u30e1', '\u30fb', '\uff1f'],
        ['\u308d', '\u30ed', '', '\uff3f'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.AltLk, KeyboardClassKey.AltLk, KeyboardClassKey.AltLk, KeyboardClassKey.AltLk],
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt]
      ]
    ],
    'lang': ['ja']
  },
  '\u10e5\u10d0\u10e0\u10d7\u10e3\u10da\u10d8': {
    'name': 'Georgian',
    'keys': [
      [
        ['\u201E', '\u201C'],
        ['!', '1'],
        ['?', '2'],
        ['\u2116', '3'],
        ['\u00A7', '4'],
        ['%', '5'],
        [':', '6'],
        ['.', '7'],
        [';', '8'],
        [',', '9'],
        ['/', '0'],
        ['\u2013', '-'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u10E6', '\u10E6'],
        ['\u10EF', '\u10EF'],
        ['\u10E3', '\u10E3'],
        ['\u10D9', '\u10D9'],
        ['\u10D4', '\u10D4', '\u10F1'],
        ['\u10DC', '\u10DC'],
        ['\u10D2', '\u10D2'],
        ['\u10E8', '\u10E8'],
        ['\u10EC', '\u10EC'],
        ['\u10D6', '\u10D6'],
        ['\u10EE', '\u10EE', '\u10F4'],
        ['\u10EA', '\u10EA'],
        ['(', ')']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u10E4', '\u10E4', '\u10F6'],
        ['\u10EB', '\u10EB'],
        ['\u10D5', '\u10D5', '\u10F3'],
        ['\u10D7', '\u10D7'],
        ['\u10D0', '\u10D0'],
        ['\u10DE', '\u10DE'],
        ['\u10E0', '\u10E0'],
        ['\u10DD', '\u10DD'],
        ['\u10DA', '\u10DA'],
        ['\u10D3', '\u10D3'],
        ['\u10DF', '\u10DF'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u10ED', '\u10ED'],
        ['\u10E9', '\u10E9'],
        ['\u10E7', '\u10E7'],
        ['\u10E1', '\u10E1'],
        ['\u10DB', '\u10DB'],
        ['\u10D8', '\u10D8', '\u10F2'],
        ['\u10E2', '\u10E2'],
        ['\u10E5', '\u10E5'],
        ['\u10D1', '\u10D1'],
        ['\u10F0', '\u10F0', '\u10F5'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['ka']
  },
  '\u049a\u0430\u0437\u0430\u049b\u0448\u0430': {
    'name': 'Kazakh',
    'keys': [
      [
        ['(', ')'],
        ['"', '!'],
        ['\u04d9', '\u04d8'],
        ['\u0456', '\u0406'],
        ['\u04a3', '\u04a2'],
        ['\u0493', '\u0492'],
        [',', ';'],
        ['.', ':'],
        ['\u04af', '\u04ae'],
        ['\u04b1', '\u04b0'],
        ['\u049b', '\u049a'],
        ['\u04e9', '\u04e8'],
        ['\u04bb', '\u04ba'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0439', '\u0419'],
        ['\u0446', '\u0426'],
        ['\u0443', '\u0423'],
        ['\u043A', '\u041A'],
        ['\u0435', '\u0415'],
        ['\u043D', '\u041D'],
        ['\u0433', '\u0413'],
        ['\u0448', '\u0428'],
        ['\u0449', '\u0429'],
        ['\u0437', '\u0417'],
        ['\u0445', '\u0425'],
        ['\u044A', '\u042A'],
        ['\\', '/']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0444', '\u0424'],
        ['\u044B', '\u042B'],
        ['\u0432', '\u0412'],
        ['\u0430', '\u0410'],
        ['\u043F', '\u041F'],
        ['\u0440', '\u0420'],
        ['\u043E', '\u041E'],
        ['\u043B', '\u041B'],
        ['\u0434', '\u0414'],
        ['\u0436', '\u0416'],
        ['\u044D', '\u042D'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\\', '|'],
        ['\u044F', '\u042F'],
        ['\u0447', '\u0427'],
        ['\u0441', '\u0421'],
        ['\u043C', '\u041C'],
        ['\u0438', '\u0418'],
        ['\u0442', '\u0422'],
        ['\u044C', '\u042C'],
        ['\u0431', '\u0411'],
        ['\u044E', '\u042E'],
        ['\u2116', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['kk']
  },
  '\u1797\u17b6\u179f\u17b6\u1781\u17d2\u1798\u17c2\u179a': {
    'name': 'Khmer',
    'keys': [
      [
        ['\u00AB', '\u00BB', '\u200D'],
        ['\u17E1', '!', '\u200C', '\u17F1'],
        ['\u17E2', '\u17D7', '@', '\u17F2'],
        ['\u17E3', '"', '\u17D1', '\u17F3'],
        ['\u17E4', '\u17DB', '$', '\u17F4'],
        ['\u17E5', '%', '\u20AC', '\u17F5'],
        ['\u17E6', '\u17CD', '\u17D9', '\u17F6'],
        ['\u17E7', '\u17D0', '\u17DA', '\u17F7'],
        ['\u17E8', '\u17CF', '*', '\u17F8'],
        ['\u17E9', '(', '{', '\u17F9'],
        ['\u17E0', ')', '}', '\u17F0'],
        ['\u17A5', '\u17CC', 'x'],
        ['\u17B2', '=', '\u17CE'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u1786', '\u1788', '\u17DC', '\u19E0'],
        ['\u17B9', '\u17BA', '\u17DD', '\u19E1'],
        ['\u17C1', '\u17C2', '\u17AF', '\u19E2'],
        ['\u179A', '\u17AC', '\u17AB', '\u19E3'],
        ['\u178F', '\u1791', '\u17A8', '\u19E4'],
        ['\u1799', '\u17BD', '\u1799\u17BE\u1784', '\u19E5'],
        ['\u17BB', '\u17BC', '', '\u19E6'],
        ['\u17B7', '\u17B8', '\u17A6', '\u19E7'],
        ['\u17C4', '\u17C5', '\u17B1', '\u19E8'],
        ['\u1795', '\u1797', '\u17B0', '\u19E9'],
        ['\u17C0', '\u17BF', '\u17A9', '\u19EA'],
        ['\u17AA', '\u17A7', '\u17B3', '\u19EB'],
        ['\u17AE', '\u17AD', '\\']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u17B6', '\u17B6\u17C6', '\u17B5', '\u19EC'],
        ['\u179F', '\u17C3', '', '\u19ED'],
        ['\u178A', '\u178C', '\u17D3', '\u19EE'],
        ['\u1790', '\u1792', '', '\u19EF'],
        ['\u1784', '\u17A2', '\u17A4', '\u19F0'],
        ['\u17A0', '\u17C7', '\u17A3', '\u19F1'],
        ['\u17D2', '\u1789', '\u17B4', '\u19F2'],
        ['\u1780', '\u1782', '\u179D', '\u19F3'],
        ['\u179B', '\u17A1', '\u17D8', '\u19F4'],
        ['\u17BE', '\u17C4\u17C7', '\u17D6', '\u19F5'],
        ['\u17CB', '\u17C9', '\u17C8', '\u19F6'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u178B', '\u178D', '|', '\u19F7'],
        ['\u1781', '\u1783', '\u1781\u17D2\u1789\u17BB\u17C6', '\u19F8'],
        ['\u1785', '\u1787', '-', '\u19F9'],
        ['\u179C', '\u17C1\u17C7', '+', '\u19FA'],
        ['\u1794', '\u1796', '\u179E', '\u19FB'],
        ['\u1793', '\u178E', '[', '\u19FC'],
        ['\u1798', '\u17C6', ']', '\u19FD'],
        ['\u17BB\u17C6', '\u17BB\u17C7', ',', '\u19FE'],
        ['\u17D4', '\u17D5', '.', '\u19FF'],
        ['\u17CA', '?', '/'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        ['\u200B', ' ', '\u00A0', ' '],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['km']
  },
  '\u0c95\u0ca8\u0ccd\u0ca8\u0ca1': {
    'name': 'Kannada',
    'keys': [
      [
        ['\u0CCA', '\u0C92'],
        ['1', '', '\u0CE7'],
        ['2', '', '\u0CE8'],
        ['3', '\u0CCD\u0CB0', '\u0CE9'],
        ['4', '\u0CB0\u0CCD', '\u0CEA'],
        ['5', '\u0C9C\u0CCD\u0C9E', '\u0CEB'],
        ['6', '\u0CA4\u0CCD\u0CB0', '\u0CEC'],
        ['7', '\u0C95\u0CCD\u0CB7', '\u0CED'],
        ['8', '\u0CB6\u0CCD\u0CB0', '\u0CEE'],
        ['9', '(', '\u0CEF'],
        ['0', ')', '\u0CE6'],
        ['-', '\u0C83'],
        ['\u0CC3', '\u0C8B', '\u0CC4', '\u0CE0'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0CCC', '\u0C94'],
        ['\u0CC8', '\u0C90', '\u0CD6'],
        ['\u0CBE', '\u0C86'],
        ['\u0CC0', '\u0C88', '', '\u0CE1'],
        ['\u0CC2', '\u0C8A'],
        ['\u0CAC', '\u0CAD'],
        ['\u0CB9', '\u0C99'],
        ['\u0C97', '\u0C98'],
        ['\u0CA6', '\u0CA7'],
        ['\u0C9C', '\u0C9D'],
        ['\u0CA1', '\u0CA2'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0CCB', '\u0C93'],
        ['\u0CC7', '\u0C8F', '\u0CD5'],
        ['\u0CCD', '\u0C85'],
        ['\u0CBF', '\u0C87', '', '\u0C8C'],
        ['\u0CC1', '\u0C89'],
        ['\u0CAA', '\u0CAB', '', '\u0CDE'],
        ['\u0CB0', '\u0CB1'],
        ['\u0C95', '\u0C96'],
        ['\u0CA4', '\u0CA5'],
        ['\u0C9A', '\u0C9B'],
        ['\u0C9F', '\u0CA0'],
        ['', '\u0C9E']
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0CC6', '\u0C8F'],
        ['\u0C82'],
        ['\u0CAE', '\u0CA3'],
        ['\u0CA8'],
        ['\u0CB5'],
        ['\u0CB2', '\u0CB3'],
        ['\u0CB8', '\u0CB6'],
        [',', '\u0CB7'],
        ['.', '|'],
        ['\u0CAF'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['kn']
  },
  '\ud55c\uad6d\uc5b4': {
    'name': 'Korean',
    'keys': [
      [
        ['`', '~', '`', '~'],
        ['1', '!', '1', '!'],
        ['2', '@', '2', '@'],
        ['3', '#', '3', '#'],
        ['4', '$', '4', '$'],
        ['5', '%', '5', '%'],
        ['6', '^', '6', '^'],
        ['7', '&', '7', '&'],
        ['8', '*', '8', '*'],
        ['9', ')', '9', ')'],
        ['0', '(', '0', '('],
        ['-', '_', '-', '_'],
        ['=', '+', '=', '+'],
        ['\u20A9', '|', '\u20A9', '|'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u1107', '\u1108', 'q', 'Q'],
        ['\u110C', '\u110D', 'w', 'W'],
        ['\u1103', '\u1104', 'e', 'E'],
        ['\u1100', '\u1101', 'r', 'R'],
        ['\u1109', '\u110A', 't', 'T'],
        ['\u116D', '', 'y', 'Y'],
        ['\u1167', '', 'u', 'U'],
        ['\u1163', '', 'i', 'I'],
        ['\u1162', '\u1164', 'o', 'O'],
        ['\u1166', '\u1168', 'p', 'P'],
        ['[', '{', '[', '{'],
        [']', '}', ']', '}']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u1106', '', 'a', 'A'],
        ['\u1102', '', 's', 'S'],
        ['\u110B', '', 'd', 'D'],
        ['\u1105', '', 'f', 'F'],
        ['\u1112', '', 'g', 'G'],
        ['\u1169', '', 'h', 'H'],
        ['\u1165', '', 'j', 'J'],
        ['\u1161', '', 'k', 'K'],
        ['\u1175', '', 'l', 'L'],
        [';', ':', ';', ':'],
        ['\'', '"', '\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u110F', '', 'z', 'Z'],
        ['\u1110', '', 'x', 'X'],
        ['\u110E', '', 'c', 'C'],
        ['\u1111', '', 'v', 'V'],
        ['\u1172', '', 'b', 'B'],
        ['\u116E', '', 'n', 'N'],
        ['\u1173', '', 'm', 'M'],
        [',', '<', ',', '<'],
        ['.', '>', '.', '>'],
        ['/', '?', '/', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        ['Kor', KeyboardClassKey.Alt]
      ]
    ],
    'lang': ['ko']
  },
  'Kurd\u00ee': {
    'name': 'Kurdish',
    'keys': [
      [
        ['\u20ac', '~'],
        ['\u0661', '!'],
        ['\u0662', '@'],
        ['\u0663', '#'],
        ['\u0664', '$'],
        ['\u0665', '%'],
        ['\u0666', '^'],
        ['\u0667', '&'],
        ['\u0668', '*'],
        ['\u0669', '('],
        ['\u0660', ')'],
        ['-', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0642', '`'],
        ['\u0648', '\u0648\u0648'],
        ['\u06d5', '\u064a'],
        ['\u0631', '\u0695'],
        ['\u062a', '\u0637'],
        ['\u06cc', '\u06ce'],
        ['\u0626', '\u0621'],
        ['\u062d', '\u0639'],
        ['\u06c6', '\u0624'],
        ['\u067e', '\u062b'],
        ['[', '{'],
        [']', '}'],
        ['\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0627', '\u0622'],
        ['\u0633', '\u0634'],
        ['\u062f', '\u0630'],
        ['\u0641', '\u0625'],
        ['\u06af', '\u063a'],
        ['\u0647', '\u200c'],
        ['\u0698', '\u0623'],
        ['\u06a9', '\u0643'],
        ['\u0644', '\u06b5'],
        ['\u061b', ':'],
        ['\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0632', '\u0636'],
        ['\u062e', '\u0635'],
        ['\u062c', '\u0686'],
        ['\u06a4', '\u0638'],
        ['\u0628', '\u0649'],
        ['\u0646', '\u0629'],
        ['\u0645', '\u0640'],
        ['\u060c', '<'],
        ['.', '>'],
        ['/', '\u061f'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['ku']
  },
  '\u041a\u044b\u0440\u0433\u044b\u0437\u0447\u0430': {
    'name': 'Kyrgyz',
    'keys': [
      [
        ['\u0451', '\u0401'],
        ['1', '!'],
        ['2', '"'],
        ['3', '\u2116'],
        ['4', ';'],
        ['5', '%'],
        ['6', ':'],
        ['7', '?'],
        ['8', '*'],
        ['9', '('],
        ['0', ')'],
        ['-', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0439', '\u0419'],
        ['\u0446', '\u0426'],
        ['\u0443', '\u0423', '\u04AF', '\u04AE'],
        ['\u043A', '\u041A'],
        ['\u0435', '\u0415'],
        ['\u043D', '\u041D', '\u04A3', '\u04A2'],
        ['\u0433', '\u0413'],
        ['\u0448', '\u0428'],
        ['\u0449', '\u0429'],
        ['\u0437', '\u0417'],
        ['\u0445', '\u0425'],
        ['\u044A', '\u042A'],
        ['\\', '/']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0444', '\u0424'],
        ['\u044B', '\u042B'],
        ['\u0432', '\u0412'],
        ['\u0430', '\u0410'],
        ['\u043F', '\u041F'],
        ['\u0440', '\u0420'],
        ['\u043E', '\u041E', '\u04E9', '\u04E8'],
        ['\u043B', '\u041B'],
        ['\u0434', '\u0414'],
        ['\u0436', '\u0416'],
        ['\u044D', '\u042D'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u044F', '\u042F'],
        ['\u0447', '\u0427'],
        ['\u0441', '\u0421'],
        ['\u043C', '\u041C'],
        ['\u0438', '\u0418'],
        ['\u0442', '\u0422'],
        ['\u044C', '\u042C'],
        ['\u0431', '\u0411'],
        ['\u044E', '\u042E'],
        ['.', ','],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['ky']
  },
  'Latvie\u0161u': {
    'name': 'Latvian',
    'keys': [
      [
        ['\u00AD', '?'],
        ['1', '!', '\u00AB'],
        ['2', '\u00AB', '', '@'],
        ['3', '\u00BB', '', '#'],
        ['4', '$', '\u20AC', '$'],
        ['5', '%', '"', '~'],
        ['6', '/', '\u2019', '^'],
        ['7', '&', '', '\u00B1'],
        ['8', '\u00D7', ':'],
        ['9', '('],
        ['0', ')'],
        ['-', '_', '\u2013', '\u2014'],
        ['f', 'F', '=', ';'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u016B', '\u016A', 'q', 'Q'],
        ['g', 'G', '\u0123', '\u0122'],
        ['j', 'J'],
        ['r', 'R', '\u0157', '\u0156'],
        ['m', 'M', 'w', 'W'],
        ['v', 'V', 'y', 'Y'],
        ['n', 'N'],
        ['z', 'Z'],
        ['\u0113', '\u0112'],
        ['\u010D', '\u010C'],
        ['\u017E', '\u017D', '[', '{'],
        ['h', 'H', ']', '}'],
        ['\u0137', '\u0136']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0161', '\u0160'],
        ['u', 'U'],
        ['s', 'S'],
        ['i', 'I'],
        ['l', 'L'],
        ['d', 'D'],
        ['a', 'A'],
        ['t', 'T'],
        ['e', 'E', '\u20AC'],
        ['c', 'C'],
        ['\u00B4', '\u00B0', '\u00B4', '\u00A8'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0146', '\u0145'],
        ['b', 'B', 'x', 'X'],
        ['\u012B', '\u012A'],
        ['k', 'K', '\u0137', '\u0136'],
        ['p', 'P'],
        ['o', 'O', '\u00F5', '\u00D5'],
        ['\u0101', '\u0100'],
        [',', ';', '<'],
        ['.', ':', '>'],
        ['\u013C', '\u013B'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['lv']
  },
  'Lietuvi\u0173': {
    'name': 'Lithuanian',
    'keys': [
      [
        ['`', '~'],
        ['\u0105', '\u0104'],
        ['\u010D', '\u010C'],
        ['\u0119', '\u0118'],
        ['\u0117', '\u0116'],
        ['\u012F', '\u012E'],
        ['\u0161', '\u0160'],
        ['\u0173', '\u0172'],
        ['\u016B', '\u016A'],
        ['\u201E', '('],
        ['\u201C', ')'],
        ['-', '_'],
        ['\u017E', '\u017D'],
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
        ['\u2013', '\u20AC'],
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
    'lang': ['lt']
  },
  'Magyar': {
    'name': 'Hungarian',
    'keys': [
      [
        ['0', '\u00a7'],
        ['1', '\'', '~'],
        ['2', '"', '\u02c7'],
        ['3', '+', '\u02c6'],
        ['4', '!', '\u02d8'],
        ['5', '%', '\u00b0'],
        ['6', '/', '\u02db'],
        ['7', '=', '`'],
        ['8', '(', '\u02d9'],
        ['9', ')', '\u00b4'],
        ['\u00f6', '\u00d6', '\u02dd'],
        ['\u00fc', '\u00dc', '\u00a8'],
        ['\u00f3', '\u00d3', '\u00b8'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q', '\\'],
        ['w', 'W', '|'],
        ['e', 'E', '\u00c4'],
        ['r', 'R'],
        ['t', 'T'],
        ['z', 'Z'],
        ['u', 'U', '\u20ac'],
        ['i', 'I', '\u00cd'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u0151', '\u0150', '\u00f7'],
        ['\u00fa', '\u00da', '\u00d7'],
        ['\u0171', '\u0170', '\u00a4']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A', '\u00e4'],
        ['s', 'S', '\u0111'],
        ['d', 'D', '\u0110'],
        ['f', 'F', '['],
        ['g', 'G', ']'],
        ['h', 'H'],
        ['j', 'J', '\u00ed'],
        ['k', 'K', '\u0141'],
        ['l', 'L', '\u0142'],
        ['\u00e9', '\u00c9', '$'],
        ['\u00e1', '\u00c1', '\u00df'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u00ed', '\u00cd', '<'],
        ['y', 'Y', '>'],
        ['x', 'X', '#'],
        ['c', 'C', '&'],
        ['v', 'V', '@'],
        ['b', 'B', '{'],
        ['n', 'N', '}'],
        ['m', 'M', '<'],
        [',', '?', ';'],
        ['.', ':', '>'],
        ['-', '_', '*'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['hu']
  },
  'Malti': {
    'name': 'Maltese 48',
    'keys': [
      [
        ['\u010B', '\u010A', '`'],
        ['1', '!'],
        ['2', '"'],
        ['3', '\u20ac', '\u00A3'],
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
        ['e', 'E', '\u00E8', '\u00C8'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U', '\u00F9', '\u00D9'],
        ['i', 'I', '\u00EC', '\u00cc'],
        ['o', 'O', '\u00F2', '\u00D2'],
        ['p', 'P'],
        ['\u0121', '\u0120', '[', '{'],
        ['\u0127', '\u0126', ']', '}'],
        ['#', '\u017e']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A', '\u00E0', '\u00C0'],
        ['s', 'S'],
        ['d', 'D'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L'],
        [';', ':'],
        ['\'', '@'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u017c', '\u017b', '\\', '|'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        [',', '<'],
        ['.', '>'],
        ['/', '?', '', '`'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['mt']
  },
  '\u041c\u0430\u043a\u0435\u0434\u043e\u043d\u0441\u043a\u0438': {
    'name': 'Macedonian Cyrillic',
    'keys': [
      [
        ['`', '~'],
        ['1', '!'],
        ['2', '\u201E'],
        ['3', '\u201C'],
        ['4', '\u2019'],
        ['5', '%'],
        ['6', '\u2018'],
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
        ['\u0459', '\u0409'],
        ['\u045A', '\u040A'],
        ['\u0435', '\u0415', '\u20AC'],
        ['\u0440', '\u0420'],
        ['\u0442', '\u0422'],
        ['\u0455', '\u0405'],
        ['\u0443', '\u0423'],
        ['\u0438', '\u0418'],
        ['\u043E', '\u041E'],
        ['\u043F', '\u041F'],
        ['\u0448', '\u0428', '\u0402'],
        ['\u0453', '\u0403', '\u0452'],
        ['\u0436', '\u0416']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0430', '\u0410'],
        ['\u0441', '\u0421'],
        ['\u0434', '\u0414'],
        ['\u0444', '\u0424', '['],
        ['\u0433', '\u0413', ']'],
        ['\u0445', '\u0425'],
        ['\u0458', '\u0408'],
        ['\u043A', '\u041A'],
        ['\u043B', '\u041B'],
        ['\u0447', '\u0427', '\u040B'],
        ['\u045C', '\u040C', '\u045B'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0451', '\u0401'],
        ['\u0437', '\u0417'],
        ['\u045F', '\u040F'],
        ['\u0446', '\u0426'],
        ['\u0432', '\u0412', '@'],
        ['\u0431', '\u0411', '{'],
        ['\u043D', '\u041D', '}'],
        ['\u043C', '\u041C', '\u00A7'],
        [',', ';'],
        ['.', ':'],
        ['/', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['mk']
  },
  '\u0d2e\u0d32\u0d2f\u0d3e\u0d33\u0d02': {
    'name': 'Malayalam',
    'keys': [
      [
        ['\u0D4A', '\u0D12'],
        ['1', '', '\u0D67'],
        ['2', '', '\u0D68'],
        ['3', '\u0D4D\u0D30', '\u0D69'],
        ['4', '', '\u0D6A'],
        ['5', '', '\u0D6B'],
        ['6', '', '\u0D6C'],
        ['7', '\u0D15\u0D4D\u0D37', '\u0D6D'],
        ['8', '', '\u0D6E'],
        ['9', '(', '\u0D6F'],
        ['0', ')', '\u0D66'],
        ['-', '\u0D03'],
        ['\u0D43', '\u0D0B', '', '\u0D60'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0D4C', '\u0D14', '\u0D57'],
        ['\u0D48', '\u0D10'],
        ['\u0D3E', '\u0D06'],
        ['\u0D40', '\u0D08', '', '\u0D61'],
        ['\u0D42', '\u0D0A'],
        ['\u0D2C', '\u0D2D'],
        ['\u0D39', '\u0D19'],
        ['\u0D17', '\u0D18'],
        ['\u0D26', '\u0D27'],
        ['\u0D1C', '\u0D1D'],
        ['\u0D21', '\u0D22'],
        ['', '\u0D1E']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0D4B', '\u0D13'],
        ['\u0D47', '\u0D0F'],
        ['\u0D4D', '\u0D05', '', '\u0D0C'],
        ['\u0D3F', '\u0D07'],
        ['\u0D41', '\u0D09'],
        ['\u0D2A', '\u0D2B'],
        ['\u0D30', '\u0D31'],
        ['\u0D15', '\u0D16'],
        ['\u0D24', '\u0D25'],
        ['\u0D1A', '\u0D1B'],
        ['\u0D1F', '\u0D20'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0D46', '\u0D0F'],
        ['\u0D02'],
        ['\u0D2E', '\u0D23'],
        ['\u0D28'],
        ['\u0D35', '\u0D34'],
        ['\u0D32', '\u0D33'],
        ['\u0D38', '\u0D36'],
        [',', '\u0D37'],
        ['.'],
        ['\u0D2F'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['ml']
  },
  'Misc. Symbols': {
    'name': 'Misc. Symbols',
    'keys': [
      [
        ['\u2605', '\u2606', '\u260e', '\u260f'],
        ['\u2648', '\u2673', '\u2659', '\u2630'],
        ['\u2649', '\u2674', '\u2658', '\u2631'],
        ['\u264a', '\u2675', '\u2657', '\u2632'],
        ['\u264b', '\u2676', '\u2656', '\u2633'],
        ['\u264c', '\u2677', '\u2655', '\u2634'],
        ['\u264d', '\u2678', '\u2654', '\u2635'],
        ['\u264e', '\u2679', '\u265f', '\u2636'],
        ['\u264f', '\u267a', '\u265e', '\u2637'],
        ['\u2650', '\u267b', '\u265d', '\u2686'],
        ['\u2651', '\u267c', '\u265c', '\u2687'],
        ['\u2652', '\u267d', '\u265b', '\u2688'],
        ['\u2653', '\u2672', '\u265a', '\u2689'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        ['\u263f', '\u2680', '\u268a', '\u26a2'],
        ['\u2640', '\u2681', '\u268b', '\u26a3'],
        ['\u2641', '\u2682', '\u268c', '\u26a4'],
        ['\u2642', '\u2683', '\u268d', '\u26a5'],
        ['\u2643', '\u2684', '\u268e', '\u26a6'],
        ['\u2644', '\u2685', '\u268f', '\u26a7'],
        ['\u2645', '\u2620', '\u26ff', '\u26a8'],
        ['\u2646', '\u2622', '\u2692', '\u26a9'],
        ['\u2647', '\u2623', '\u2693', '\u26b2'],
        ['\u2669', '\u266d', '\u2694', '\u26ac'],
        ['\u266a', '\u266e', '\u2695', '\u26ad'],
        ['\u266b', '\u266f', '\u2696', '\u26ae'],
        ['\u266c', '\u2607', '\u2697', '\u26af'],
        ['\u26f9', '\u2608', '\u2698', '\u26b0'],
        ['\u267f', '\u262e', '\u2638', '\u2609']
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u261e', '\u261c', '\u261d', '\u261f'],
        ['\u261b', '\u261a', '\u2618', '\u2619'],
        ['\u2602', '\u2614', '\u26f1', '\u26d9'],
        ['\u2615', '\u2668', '\u26fe', '\u26d8'],
        ['\u263a', '\u2639', '\u263b', '\u26dc'],
        ['\u2617', '\u2616', '\u26ca', '\u26c9'],
        ['\u2660', '\u2663', '\u2665', '\u2666'],
        ['\u2664', '\u2667', '\u2661', '\u2662'],
        ['\u26c2', '\u26c0', '\u26c3', '\u26c1'],
        ['\u2624', '\u2625', '\u269a', '\u26b1'],
        ['\u2610', '\u2611', '\u2612', '\u2613'],
        ['\u2628', '\u2626', '\u2627', '\u2629'],
        ['\u262a', '\u262b', '\u262c', '\u262d'],
        ['\u26fa', '\u26fb', '\u26fc', '\u26fd']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u262f', '\u2670', '\u2671', '\u267e'],
        ['\u263c', '\u2699', '\u263d', '\u263e'],
        ['\u26c4', '\u2603', '\u26c7', '\u26c6'],
        ['\u26a0', '\u26a1', '\u2621', '\u26d4'],
        ['\u26e4', '\u26e5', '\u26e6', '\u26e7'],
        ['\u260a', '\u260b', '\u260c', '\u260d'],
        ['\u269c', '\u269b', '\u269d', '\u2604'],
        ['\u26b3', '\u26b4', '\u26b5', '\u26b6'],
        ['\u26b7', '\u26bf', '\u26b8', '\u26f8'],
        ['\u26b9', '\u26ba', '\u26bb', '\u26bc'],
        ['\u26bd', '\u26be', '\u269f', '\u269e'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u2600', '\u2601', '\u26c5', '\u26c8'],
        ['\u2691', '\u2690', '\u26ab', '\u26aa'],
        ['\u26cb', '\u26cc', '\u26cd', '\u26ce'],
        ['\u26cf', '\u26d0', '\u26d1', '\u26d2'],
        ['\u26d3', '\u26d5', '\u26d6', '\u26d7'],
        ['\u26da', '\u26db', '\u26dd', '\u26de'],
        ['\u26df', '\u26e0', '\u26e1', '\u26e2'],
        ['\u26e3', '\u26e8', '\u26e9', '\u26ea'],
        ['\u26eb', '\u26ec', '\u26ed', '\u26ee'],
        ['\u26ef', '\u26f0', '\u26f2', '\u26f3'],
        ['\u26f4', '\u26f5', '\u26f6', '\u26f7'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.AltLk, KeyboardClassKey.AltLk, KeyboardClassKey.AltLk, KeyboardClassKey.AltLk],
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt]
      ]
    ]
  },
  '\u041c\u043e\u043d\u0433\u043e\u043b': {
    'name': 'Mongolian Cyrillic',
    'keys': [
      [
        ['=', '+'],
        ['\u2116', '1'],
        ['-', '2'],
        ['"', '3'],
        ['\u20AE', '4'],
        [':', '5'],
        ['.', '6'],
        ['_', '7'],
        [',', '8'],
        ['%', '9'],
        ['?', '0'],
        ['\u0435', '\u0415'],
        ['\u0449', '\u0429'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0444', '\u0424'],
        ['\u0446', '\u0426'],
        ['\u0443', '\u0423'],
        ['\u0436', '\u0416'],
        ['\u044d', '\u042d'],
        ['\u043D', '\u041D'],
        ['\u0433', '\u0413'],
        ['\u0448', '\u0428'],
        ['\u04af', '\u04AE'],
        ['\u0437', '\u0417'],
        ['\u043A', '\u041a'],
        ['\u044A', '\u042A'],
        ['\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0439', '\u0419'],
        ['\u044B', '\u042B'],
        ['\u0431', '\u0411'],
        ['\u04e9', '\u04e8'],
        ['\u0430', '\u0410'],
        ['\u0445', '\u0425'],
        ['\u0440', '\u0420'],
        ['\u043e', '\u041e'],
        ['\u043B', '\u041b'],
        ['\u0434', '\u0414'],
        ['\u043f', '\u041f'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u044F', '\u042F'],
        ['\u0447', '\u0427'],
        ['\u0451', '\u0401'],
        ['\u0441', '\u0421'],
        ['\u043c', '\u041c'],
        ['\u0438', '\u0418'],
        ['\u0442', '\u0422'],
        ['\u044c', '\u042c'],
        ['\u0432', '\u0412'],
        ['\u044e', '\u042e'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['mn']
  },
  '\u092e\u0930\u093e\u0920\u0940': {
    'name': 'Marathi',
    'keys': [
      [
        ['', '', '`', '~'],
        ['\u0967', '\u090D', '1', '!'],
        ['\u0968', '\u0945', '2', '@'],
        ['\u0969', '\u094D\u0930', '3', '#'],
        ['\u096A', '\u0930\u094D', '4', '$'],
        ['\u096B', '\u091C\u094D\u091E', '5', '%'],
        ['\u096C', '\u0924\u094D\u0930', '6', '^'],
        ['\u096D', '\u0915\u094D\u0937', '7', '&'],
        ['\u096E', '\u0936\u094D\u0930', '8', '*'],
        ['\u096F', '(', '9', '('],
        ['\u0966', ')', '0', ')'],
        ['-', '\u0903', '-', '_'],
        ['\u0943', '\u090B', '=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u094C', '\u0914'],
        ['\u0948', '\u0910'],
        ['\u093E', '\u0906'],
        ['\u0940', '\u0908'],
        ['\u0942', '\u090A'],
        ['\u092C', '\u092D'],
        ['\u0939', '\u0919'],
        ['\u0917', '\u0918'],
        ['\u0926', '\u0927'],
        ['\u091C', '\u091D'],
        ['\u0921', '\u0922', '[', '{'],
        ['\u093C', '\u091E', ']', '}'],
        ['\u0949', '\u0911', '\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u094B', '\u0913'],
        ['\u0947', '\u090F'],
        ['\u094D', '\u0905'],
        ['\u093F', '\u0907'],
        ['\u0941', '\u0909'],
        ['\u092A', '\u092B'],
        ['\u0930', '\u0931'],
        ['\u0915', '\u0916'],
        ['\u0924', '\u0925'],
        ['\u091A', '\u091B', ';', ':'],
        ['\u091F', '\u0920', '\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        [''],
        ['\u0902', '\u0901', '', '\u0950'],
        ['\u092E', '\u0923'],
        ['\u0928'],
        ['\u0935'],
        ['\u0932', '\u0933'],
        ['\u0938', '\u0936'],
        [',', '\u0937', ',', '<'],
        ['.', '\u0964', '.', '>'],
        ['\u092F', '\u095F', '/', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['mr']
  },
  '\u1019\u103c\u1014\u103a\u1019\u102c\u1018\u102c\u101e\u102c': {
    'name': 'Burmese',
    'keys': [
      [
        ['\u1039`', '~'],
        ['\u1041', '\u100D'],
        ['\u1042', '\u100E'],
        ['\u1043', '\u100B'],
        ['\u1044', '\u1000\u103B\u1015\u103A'],
        ['\u1045', '%'],
        ['\u1046', '/'],
        ['\u1047', '\u101B'],
        ['\u1048', '\u1002'],
        ['\u1049', '('],
        ['\u1040', ')'],
        ['-', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u1006', '\u1029'],
        ['\u1010', '\u1040'],
        ['\u1014', '\u103F'],
        ['\u1019', '\u1023'],
        ['\u1021', '\u1024'],
        ['\u1015', '\u104C'],
        ['\u1000', '\u1009'],
        ['\u1004', '\u104D'],
        ['\u101E', '\u1025'],
        ['\u1005', '\u100F'],
        ['\u101F', '\u1027'],
        ['\u2018', '\u2019'],
        ['\u104F', '\u100B\u1039\u100C']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u200B\u1031', '\u1017'],
        ['\u200B\u103B', '\u200B\u103E'],
        ['\u200B\u102D', '\u200B\u102E'],
        ['\u200B\u103A', '\u1004\u103A\u1039\u200B'],
        ['\u200B\u102B', '\u200B\u103D'],
        ['\u200B\u1037', '\u200B\u1036'],
        ['\u200B\u103C', '\u200B\u1032'],
        ['\u200B\u102F', '\u200B\u102F'],
        ['\u200B\u1030', '\u200B\u1030'],
        ['\u200B\u1038', '\u200B\u102B\u103A'],
        ['\u1012', '\u1013'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u1016', '\u1007'],
        ['\u1011', '\u100C'],
        ['\u1001', '\u1003'],
        ['\u101C', '\u1020'],
        ['\u1018', '\u1026'],
        ['\u100A', '\u1008'],
        ['\u200B\u102C', '\u102A'],
        ['\u101A', '\u101B'],
        ['.', '\u101B'],
        ['\u104B', '\u104A'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['my']
  },
  'Nederlands': {
    'name': 'Dutch',
    'keys': [
      [
        ['@', '\u00a7', '\u00ac'],
        ['1', '!', '\u00b9'],
        ['2', '"', '\u00b2'],
        ['3', '#', '\u00b3'],
        ['4', '$', '\u00bc'],
        ['5', '%', '\u00bd'],
        ['6', '&', '\u00be'],
        ['7', '_', '\u00a3'],
        ['8', '(', '{'],
        ['9', ')', '}'],
        ['0', '\''],
        ['/', '?', '\\'],
        ['\u00b0', '~', '\u00b8'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E', '\u20ac'],
        ['r', 'R', '\u00b6'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00a8', '^'],
        ['*', '|'],
        ['<', '>']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A'],
        ['s', 'S', '\u00df'],
        ['d', 'D'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L'],
        ['+', '\u00b1'],
        ['\u00b4', '`'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        [']', '[', '\u00a6'],
        ['z', 'Z', '\u00ab'],
        ['x', 'X', '\u00bb'],
        ['c', 'C', '\u00a2'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M', '\u00b5'],
        [',', ';'],
        ['.', ':', '\u00b7'],
        ['-', '='],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['nl']
  },
  'Norsk': {
    'name': 'Norwegian',
    'keys': [
      [
        ['|', '\u00a7'],
        ['1', '!'],
        ['2', '"', '@'],
        ['3', '#', '\u00a3'],
        ['4', '\u00a4', '$'],
        ['5', '%'],
        ['6', '&'],
        ['7', '/', '{'],
        ['8', '(', '['],
        ['9', ')', ']'],
        ['0', '=', '}'],
        ['+', '?'],
        ['\\', '`', '\u00b4'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E', '\u20ac'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00e5', '\u00c5'],
        ['\u00a8', '^', '~'],
        ['\'', '*']
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
        ['\u00f8', '\u00d8'],
        ['\u00e6', '\u00c6'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M', '\u03bc', '\u039c'],
        [',', ';'],
        ['.', ':'],
        ['-', '_'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['no', 'nb', 'nn']
  },
  '\u067e\u069a\u062a\u0648': {
    'name': 'Pashto',
    'keys': [
      [
        ['\u200d', '\u00f7', '`'],
        ['\u06f1', '!', '`'],
        ['\u06f2', '\u066c', '@'],
        ['\u06f3', '\u066b', '\u066b'],
        ['\u06f4', '\u00a4', '\u00a3'],
        ['\u06f5', '\u066a', '%'],
        ['\u06f6', '\u00d7', '^'],
        ['\u06f7', '\u00ab', '&'],
        ['\u06f8', '\u00bb', '*'],
        ['\u06f9', '(', '\ufdf2'],
        ['\u06f0', ')', '\ufefb'],
        ['-', '\u0640', '_'],
        ['=', '+', '\ufe87', '\u00f7'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0636', '\u0652', '\u06d5'],
        ['\u0635', '\u064c', '\u0653'],
        ['\u062b', '\u064d', '\u20ac'],
        ['\u0642', '\u064b', '\ufef7'],
        ['\u0641', '\u064f', '\ufef5'],
        ['\u063a', '\u0650', '\''],
        ['\u0639', '\u064e', '\ufe84'],
        ['\u0647', '\u0651', '\u0670'],
        ['\u062e', '\u0681', '\''],
        ['\u062d', '\u0685', '"'],
        ['\u062c', ']', '}'],
        ['\u0686', '[', '{'],
        ['\\', '\u066d', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0634', '\u069a', '\ufbb0'],
        ['\u0633', '\u06cd', '\u06d2'],
        ['\u06cc', '\u064a', '\u06d2'],
        ['\u0628', '\u067e', '\u06ba'],
        ['\u0644', '\u0623', '\u06b7'],
        ['\u0627', '\u0622', '\u0671'],
        ['\u062a', '\u067c', '\u0679'],
        ['\u0646', '\u06bc', '<'],
        ['\u0645', '\u0629', '>'],
        ['\u06a9', ':', '\u0643'],
        ['\u06af', '\u061b', '\u06ab'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0638', '\u0626', '?'],
        ['\u0637', '\u06d0', ';'],
        ['\u0632', '\u0698', '\u0655'],
        ['\u0631', '\u0621', '\u0654'],
        ['\u0630', '\u200c', '\u0625'],
        ['\u062f', '\u0689', '\u0688'],
        ['\u0693', '\u0624', '\u0691'],
        ['\u0648', '\u060c', ','],
        ['\u0696', '.', '\u06c7'],
        ['/', '\u061f', '\u06c9'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, '\u064d']
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt]
      ]
    ],
    'lang': ['ps']
  },
  '\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40': {
    'name': 'Punjabi (Gurmukhi)',
    'keys': [
      [
        [''],
        ['1', '\u0A4D\u0A35', '\u0A67', '\u0A67'],
        ['2', '\u0A4D\u0A2F', '\u0A68', '\u0A68'],
        ['3', '\u0A4D\u0A30', '\u0A69', '\u0A69'],
        ['4', '\u0A71', '\u0A6A', '\u0A6A'],
        ['5', '', '\u0A6B', '\u0A6B'],
        ['6', '', '\u0A6C', '\u0A6C'],
        ['7', '', '\u0A6D', '\u0A6D'],
        ['8', '', '\u0A6E', '\u0A6E'],
        ['9', '(', '\u0A6F', '\u0A6F'],
        ['0', ')', '\u0A66', '\u0A66'],
        ['-'],
        [''],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0A4C', '\u0A14'],
        ['\u0A48', '\u0A10'],
        ['\u0A3E', '\u0A06'],
        ['\u0A40', '\u0A08'],
        ['\u0A42', '\u0A0A'],
        ['\u0A2C', '\u0A2D'],
        ['\u0A39', '\u0A19'],
        ['\u0A17', '\u0A18', '\u0A5A', '\u0A5A'],
        ['\u0A26', '\u0A27'],
        ['\u0A1C', '\u0A1D', '\u0A5B', '\u0A5B'],
        ['\u0A21', '\u0A22', '\u0A5C', '\u0A5C'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0A4B', '\u0A13'],
        ['\u0A47', '\u0A0F'],
        ['\u0A4D', '\u0A05'],
        ['\u0A3F', '\u0A07'],
        ['\u0A41', '\u0A09'],
        ['\u0A2A', '\u0A2B', '\u0A5E', '\u0A5E'],
        ['\u0A30'],
        ['\u0A15', '\u0A16', '\u0A59', '\u0A59'],
        ['\u0A24', '\u0A25'],
        ['\u0A1A', '\u0A1B'],
        ['\u0A1F', '\u0A20'],
        ['\u0A3C', '\u0A1E']
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        [''],
        ['\u0A02', '\u0A02'],
        ['\u0A2E', '\u0A23'],
        ['\u0A28'],
        ['\u0A35', '\u0A72', '\u0A73', '\u0A73'],
        ['\u0A32', '\u0A33'],
        ['\u0A38', '\u0A36'],
        [','],
        ['.', '|', '\u0965', '\u0965'],
        ['\u0A2F'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['pa']
  },
  '\u62fc\u97f3 (Pinyin)': {
    'name': 'Pinyin',
    'keys': [
      [
        ['`', '~', '\u4e93', '\u301C'],
        ['1', '!', '\uFF62'],
        ['2', '@', '\uFF63'],
        ['3', '#', '\u301D'],
        ['4', '$', '\u301E'],
        ['5', '%', '\u301F'],
        ['6', '^', '\u3008'],
        ['7', '&', '\u3009'],
        ['8', '*', '\u302F'],
        ['9', '(', '\u300A'],
        ['0', ')', '\u300B'],
        ['-', '_', '\u300E'],
        ['=', '+', '\u300F'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q', '\u0101', '\u0100'],
        ['w', 'W', '\u00E1', '\u00C1'],
        ['e', 'E', '\u01CE', '\u01CD'],
        ['r', 'R', '\u00E0', '\u00C0'],
        ['t', 'T', '\u0113', '\u0112'],
        ['y', 'Y', '\u00E9', '\u00C9'],
        ['u', 'U', '\u011B', '\u011A'],
        ['i', 'I', '\u00E8', '\u00C8'],
        ['o', 'O', '\u012B', '\u012A'],
        ['p', 'P', '\u00ED', '\u00CD'],
        ['[', '{', '\u01D0', '\u01CF'],
        [']', '}', '\u00EC', '\u00CC'],
        ['\\', '|', '\u3020']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A', '\u014D', '\u014C'],
        ['s', 'S', '\u00F3', '\u00D3'],
        ['d', 'D', '\u01D2', '\u01D1'],
        ['f', 'F', '\u00F2', '\u00D2'],
        ['g', 'G', '\u00fc', '\u00dc'],
        ['h', 'H', '\u016B', '\u016A'],
        ['j', 'J', '\u00FA', '\u00DA'],
        ['k', 'K', '\u01D4', '\u01D3'],
        ['l', 'L', '\u00F9', '\u00D9'],
        [';', ':'],
        ['\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['z', 'Z', '\u01D6', '\u01D5'],
        ['x', 'X', '\u01D8', '\u01D7'],
        ['c', 'C', '\u01DA', '\u01D9'],
        ['v', 'V', '\u01DC', '\u01DB'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        [',', '<', '\u3001'],
        ['.', '>', '\u3002'],
        ['/', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.AltLk, KeyboardClassKey.AltLk, KeyboardClassKey.AltLk, KeyboardClassKey.AltLk],
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt]
      ]
    ],
    'lang': ['zh-LATN']
  },
  'Polski': {
    'name': 'Polish (214)',
    'keys': [
      [
        ['\u02DB', '\u00B7'],
        ['1', '!', '~'],
        ['2', '"', '\u02C7'],
        ['3', '#', '^'],
        ['4', '\u00A4', '\u02D8'],
        ['5', '%', '\u00B0'],
        ['6', '&', '\u02DB'],
        ['7', '/', '`'],
        ['8', '(', '\u00B7'],
        ['9', ')', '\u00B4'],
        ['0', '=', '\u02DD'],
        ['+', '?', '\u00A8'],
        ['\'', '*', '\u00B8'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q', '\\'],
        ['w', 'W', '\u00A6'],
        ['e', 'E'],
        ['r', 'R'],
        ['t', 'T'],
        ['z', 'Z'],
        ['u', 'U', '\u20AC'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u017C', '\u0144', '\u00F7'],
        ['\u015B', '\u0107', '\u00D7'],
        ['\u00F3', '\u017A']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A'],
        ['s', 'S', '\u0111'],
        ['d', 'D', '\u0110'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L'],
        ['\u0142', '\u0141', '$'],
        ['\u0105', '\u0119', '\u00DF'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>'],
        ['y', 'Y'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V', '@'],
        ['b', 'B', '{'],
        ['n', 'N', '}'],
        ['m', 'M', '\u00A7'],
        [',', ';', '<'],
        ['.', ':', '>'],
        ['-', '_'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ]
  },
  'Polski Programisty': {
    'name': 'Polish Programmers',
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
        ['e', 'E', '\u0119', '\u0118'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O', '\u00f3', '\u00d3'],
        ['p', 'P'],
        ['[', '{'],
        [']', '}'],
        ['\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A', '\u0105', '\u0104'],
        ['s', 'S', '\u015b', '\u015a'],
        ['d', 'D'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L', '\u0142', '\u0141'],
        [';', ':'],
        ['\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['z', 'Z', '\u017c', '\u017b'],
        ['x', 'X', '\u017a', '\u0179'],
        ['c', 'C', '\u0107', '\u0106'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N', '\u0144', '\u0143'],
        ['m', 'M'],
        [',', '<'],
        ['.', '>'],
        ['/', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt]
      ]
    ],
    'lang': ['pl']
  },
  'Portugu\u00eas Brasileiro': {
    'name': 'Portuguese (Brazil)',
    'keys': [
      [
        ['\'', '"'],
        ['1', '!', '\u00b9'],
        ['2', '@', '\u00b2'],
        ['3', '#', '\u00b3'],
        ['4', '$', '\u00a3'],
        ['5', '%', '\u00a2'],
        ['6', '\u00a8', '\u00ac'],
        ['7', '&'],
        ['8', '*'],
        ['9', '('],
        ['0', ')'],
        ['-', '_'],
        ['=', '+', '\u00a7'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q', '/'],
        ['w', 'W', '?'],
        ['e', 'E', '\u20ac'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00b4', '`'],
        ['[', '{', '\u00aa'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
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
        ['\u00e7', '\u00c7'],
        ['~', '^'],
        [']', '}', '\u00ba'],
        ['/', '?']
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\\', '|'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C', '\u20a2'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        [',', '<'],
        ['.', '>'],
        [':', ':'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['pt-BR']
  },
  'Portugu\u00eas': {
    'name': 'Portuguese',
    'keys': [
      [
        ['\\', '|'],
        ['1', '!'],
        ['2', '"', '@'],
        ['3', '#', '\u00a3'],
        ['4', '$', '\u00a7'],
        ['5', '%'],
        ['6', '&'],
        ['7', '/', '{'],
        ['8', '(', '['],
        ['9', ')', ']'],
        ['0', '=', '}'],
        ['\'', '?'],
        ['\u00ab', '\u00bb'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E', '\u20ac'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['+', '*', '\u00a8'],
        ['\u00b4', '`'],
        ['~', '^']
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
        ['\u00e7', '\u00c7'],
        ['\u00ba', '\u00aa'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>', '\\'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        [',', ';'],
        ['.', ':'],
        ['-', '_'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['pt']
  },
  'Rom\u00e2n\u0103': {
    'name': 'Romanian',
    'keys': [
      [
        ['\u201E', '\u201D', '`', '~'],
        ['1', '!', '~'],
        ['2', '@', '\u02C7'],
        ['3', '#', '^'],
        ['4', '$', '\u02D8'],
        ['5', '%', '\u00B0'],
        ['6', '^', '\u02DB'],
        ['7', '&', '`'],
        ['8', '*', '\u02D9'],
        ['9', '(', '\u00B4'],
        ['0', ')', '\u02DD'],
        ['-', '_', '\u00A8'],
        ['=', '+', '\u00B8', '\u00B1'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E', '\u20AC'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P', '\u00A7'],
        ['\u0103', '\u0102', '[', '{'],
        ['\u00EE', '\u00CE', ']', '}'],
        ['\u00E2', '\u00C2', '\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A'],
        ['s', 'S', '\u00df'],
        ['d', 'D', '\u00f0', '\u00D0'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L', '\u0142', '\u0141'],
        ['\u0219', '\u0218', ';', ':'],
        ['\u021B', '\u021A', '\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\\', '|'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C', '\u00A9'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        [',', ';', '<', '\u00AB'],
        ['.', ':', '>', '\u00BB'],
        ['/', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['ro']
  },
  '\u0420\u0443\u0441\u0441\u043a\u0438\u0439': {
    'name': 'Russian',
    'keys': [
      [
        ['\u0451', '\u0401'],
        ['1', '!'],
        ['2', '"'],
        ['3', '\u2116'],
        ['4', ';'],
        ['5', '%'],
        ['6', ':'],
        ['7', '?'],
        ['8', '*'],
        ['9', '('],
        ['0', ')'],
        ['-', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0439', '\u0419'],
        ['\u0446', '\u0426'],
        ['\u0443', '\u0423'],
        ['\u043A', '\u041A'],
        ['\u0435', '\u0415'],
        ['\u043D', '\u041D'],
        ['\u0433', '\u0413'],
        ['\u0448', '\u0428'],
        ['\u0449', '\u0429'],
        ['\u0437', '\u0417'],
        ['\u0445', '\u0425'],
        ['\u044A', '\u042A'],
        ['\\', '/']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0444', '\u0424'],
        ['\u044B', '\u042B'],
        ['\u0432', '\u0412'],
        ['\u0430', '\u0410'],
        ['\u043F', '\u041F'],
        ['\u0440', '\u0420'],
        ['\u043E', '\u041E'],
        ['\u043B', '\u041B'],
        ['\u0434', '\u0414'],
        ['\u0436', '\u0416'],
        ['\u044D', '\u042D'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['/', '|'],
        ['\u044F', '\u042F'],
        ['\u0447', '\u0427'],
        ['\u0441', '\u0421'],
        ['\u043C', '\u041C'],
        ['\u0438', '\u0418'],
        ['\u0442', '\u0422'],
        ['\u044C', '\u042C'],
        ['\u0431', '\u0411'],
        ['\u044E', '\u042E'],
        ['.', ','],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['ru']
  },
  'Schweizerdeutsch': {
    'name': 'Swiss German',
    'keys': [
      [
        ['\u00A7', '\u00B0'],
        ['1', '+', '\u00A6'],
        ['2', '"', '@'],
        ['3', '*', '#'],
        ['4', '\u00E7', '\u00B0'],
        ['5', '%', '\u00A7'],
        ['6', '&', '\u00AC'],
        ['7', '/', '|'],
        ['8', '(', '\u00A2'],
        ['9', ')'],
        ['0', '='],
        ['\'', '?', '\u00B4'],
        ['^', '`', '~'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E', '\u20AC'],
        ['r', 'R'],
        ['t', 'T'],
        ['z', 'Z'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00FC', '\u00E8', '['],
        ['\u00A8', '!', ']'],
        ['$', '\u00A3', '}']
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
        ['\u00F6', '\u00E9'],
        ['\u00E4', '\u00E0', '{'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>', '\\'],
        ['y', 'Y'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        [',', ';'],
        ['.', ':'],
        ['-', '_'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['de-CH']
  },
  'Shqip': {
    'name': 'Albanian',
    'keys': [
      [
        ['\\', '|'],
        ['1', '!', '~'],
        ['2', '"', '\u02C7'],
        ['3', '#', '^'],
        ['4', '$', '\u02D8'],
        ['5', '%', '\u00B0'],
        ['6', '^', '\u02DB'],
        ['7', '&', '`'],
        ['8', '*', '\u02D9'],
        ['9', '(', '\u00B4'],
        ['0', ')', '\u02DD'],
        ['-', '_', '\u00A8'],
        ['=', '+', '\u00B8'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q', '\\'],
        ['w', 'W', '|'],
        ['e', 'E'],
        ['r', 'R'],
        ['t', 'T'],
        ['z', 'Z'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00E7', '\u00C7', '\u00F7'],
        ['[', '{', '\u00DF'],
        [']', '}', '\u00A4']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A'],
        ['s', 'S', '\u0111'],
        ['d', 'D', '\u0110'],
        ['f', 'F', '['],
        ['g', 'G', ']'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K', '\u0142'],
        ['l', 'L', '\u0141'],
        ['\u00EB', '\u00CB', '$'],
        ['@', '\'', '\u00D7'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>'],
        ['y', 'Y'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V', '@'],
        ['b', 'B', '{'],
        ['n', 'N', '}'],
        ['m', 'M', '\u00A7'],
        [',', ';', '<'],
        ['.', ':', '>'],
        ['/', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['sq']
  },
  'Sloven\u010dina': {
    'name': 'Slovak',
    'keys': [
      [
        [';', '\u00b0'],
        ['+', '1', '~'],
        ['\u013E', '2', '\u02C7'],
        ['\u0161', '3', '^'],
        ['\u010D', '4', '\u02D8'],
        ['\u0165', '5', '\u00B0'],
        ['\u017E', '6', '\u02DB'],
        ['\u00FD', '7', '`'],
        ['\u00E1', '8', '\u02D9'],
        ['\u00ED', '9', '\u00B4'],
        ['\u00E9', '0', '\u02DD'],
        ['=', '%', '\u00A8'],
        ['\u00B4', '\u02c7', '\u00B8'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q', '\\'],
        ['w', 'W', '|'],
        ['e', 'E', '\u20AC'],
        ['r', 'R'],
        ['t', 'T'],
        ['z', 'Z'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P', '\''],
        ['\u00FA', '/', '\u00F7'],
        ['\u00E4', '(', '\u00D7'],
        ['\u0148', ')', '\u00A4']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A'],
        ['s', 'S', '\u0111'],
        ['d', 'D', '\u0110'],
        ['f', 'F', '['],
        ['g', 'G', ']'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K', '\u0142'],
        ['l', 'L', '\u0141'],
        ['\u00F4', '"', '$'],
        ['\u00A7', '!', '\u00DF'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['&', '*', '<'],
        ['y', 'Y', '>'],
        ['x', 'X', '#'],
        ['c', 'C', '&'],
        ['v', 'V', '@'],
        ['b', 'B', '{'],
        ['n', 'N', '}'],
        ['m', 'M'],
        [',', '?', '<'],
        ['.', ':', '>'],
        ['-', '_', '*'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['sk']
  },
  '\u0441\u0440\u043f\u0441\u043a\u0438': {
    'name': 'Serbian Cyrillic',
    'keys': [
      [
        ['`', '~'],
        ['1', '!'],
        ['2', '"'],
        ['3', '#'],
        ['4', '$'],
        ['5', '%'],
        ['6', '&'],
        ['7', '/'],
        ['8', '('],
        ['9', ')'],
        ['0', '='],
        ['\'', '?'],
        ['+', '*'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0459', '\u0409'],
        ['\u045a', '\u040a'],
        ['\u0435', '\u0415', '\u20ac'],
        ['\u0440', '\u0420'],
        ['\u0442', '\u0422'],
        ['\u0437', '\u0417'],
        ['\u0443', '\u0423'],
        ['\u0438', '\u0418'],
        ['\u043e', '\u041e'],
        ['\u043f', '\u041f'],
        ['\u0448', '\u0428'],
        ['\u0452', '\u0402'],
        ['\u0436', '\u0416']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0430', '\u0410'],
        ['\u0441', '\u0421'],
        ['\u0434', '\u0414'],
        ['\u0444', '\u0424'],
        ['\u0433', '\u0413'],
        ['\u0445', '\u0425'],
        ['\u0458', '\u0408'],
        ['\u043a', '\u041a'],
        ['\u043b', '\u041b'],
        ['\u0447', '\u0427'],
        ['\u045b', '\u040b'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>'],
        ['\u0455', '\u0405'],
        ['\u045f', '\u040f'],
        ['\u0446', '\u0426'],
        ['\u0432', '\u0412'],
        ['\u0431', '\u0411'],
        ['\u043d', '\u041d'],
        ['\u043c', '\u041c'],
        [',', ';', '<'],
        ['.', ':', '>'],
        ['-', '_', '\u00a9'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['sr-CYRL']
  },
  'Suomi': {
    'name': 'Finnish',
    'keys': [
      [
        ['\u00a7', '\u00BD'],
        ['1', '!'],
        ['2', '"', '@'],
        ['3', '#', '\u00A3'],
        ['4', '\u00A4', '$'],
        ['5', '%', '\u20AC'],
        ['6', '&'],
        ['7', '/', '{'],
        ['8', '(', '['],
        ['9', ')', ']'],
        ['0', '=', '}'],
        ['+', '?', '\\'],
        ['\u00B4', '`'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q', '\u00E2', '\u00C2'],
        ['w', 'W'],
        ['e', 'E', '\u20AC'],
        ['r', 'R'],
        ['t', 'T', '\u0167', '\u0166'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I', '\u00ef', '\u00CF'],
        ['o', 'O', '\u00f5', '\u00D5'],
        ['p', 'P'],
        ['\u00E5', '\u00C5'],
        ['\u00A8', '^', '~'],
        ['\'', '*']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A', '\u00E1', '\u00C1'],
        ['s', 'S', '\u0161', '\u0160'],
        ['d', 'D', '\u0111', '\u0110'],
        ['f', 'F', '\u01e5', '\u01E4'],
        ['g', 'G', '\u01E7', '\u01E6'],
        ['h', 'H', '\u021F', '\u021e'],
        ['j', 'J'],
        ['k', 'K', '\u01e9', '\u01E8'],
        ['l', 'L'],
        ['\u00F6', '\u00D6', '\u00F8', '\u00D8'],
        ['\u00E4', '\u00C4', '\u00E6', '\u00C6'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>', '|'],
        ['z', 'Z', '\u017E', '\u017D'],
        ['x', 'X'],
        ['c', 'C', '\u010d', '\u010C'],
        ['v', 'V', '\u01EF', '\u01EE'],
        ['b', 'B', '\u0292', '\u01B7'],
        ['n', 'N', '\u014B', '\u014A'],
        ['m', 'M', '\u00B5'],
        [',', ';'],
        ['.', ':'],
        ['-', '_'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt],
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['fi']
  },
  'Svenska': {
    'name': 'Swedish',
    'keys': [
      [
        ['\u00a7', '\u00bd'],
        ['1', '!'],
        ['2', '"', '@'],
        ['3', '#', '\u00a3'],
        ['4', '\u00a4', '$'],
        ['5', '%', '\u20ac'],
        ['6', '&'],
        ['7', '/', '{'],
        ['8', '(', '['],
        ['9', ')', ']'],
        ['0', '=', '}'],
        ['+', '?', '\\'],
        ['\u00b4', '`'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E', '\u20ac'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00e5', '\u00c5'],
        ['\u00a8', '^', '~'],
        ['\'', '*']
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
        ['\u00f6', '\u00d6'],
        ['\u00e4', '\u00c4'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>', '|'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M', '\u03bc', '\u039c'],
        [',', ';'],
        ['.', ':'],
        ['-', '_'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['sv']
  },
  'Swiss Fran\u00e7ais': {
    'name': 'Swiss French',
    'keys': [
      [
        ['\u00A7', '\u00B0'],
        ['1', '+', '\u00A6'],
        ['2', '"', '@'],
        ['3', '*', '#'],
        ['4', '\u00E7', '\u00B0'],
        ['5', '%', '\u00A7'],
        ['6', '&', '\u00AC'],
        ['7', '/', '|'],
        ['8', '(', '\u00A2'],
        ['9', ')'],
        ['0', '='],
        ['\'', '?', '\u00B4'],
        ['^', '`', '~'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q'],
        ['w', 'W'],
        ['e', 'E', '\u20AC'],
        ['r', 'R'],
        ['t', 'T'],
        ['z', 'Z'],
        ['u', 'U'],
        ['i', 'I'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u00E8', '\u00FC', '['],
        ['\u00A8', '!', ']'],
        ['$', '\u00A3', '}']
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
        ['\u00E9', '\u00F6'],
        ['\u00E0', '\u00E4', '{'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>', '\\'],
        ['y', 'Y'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        [',', ';'],
        ['.', ':'],
        ['-', '_'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['fr-CH']
  },
  '\u0723\u0718\u072a\u071d\u071d\u0710': {
    'name': 'Syriac',
    'keys': [
      [
        ['\u070f', '\u032e', '\u0651', '\u0651'],
        ['1', '!', '\u0701', '\u0701'],
        ['2', '\u030a', '\u0702', '\u0702'],
        ['3', '\u0325', '\u0703', '\u0703'],
        ['4', '\u0749', '\u0704', '\u0704'],
        ['5', '\u2670', '\u0705', '\u0705'],
        ['6', '\u2671', '\u0708', '\u0708'],
        ['7', '\u070a', '\u0709', '\u0709'],
        ['8', '\u00bb', '\u070B', '\u070B'],
        ['9', ')', '\u070C', '\u070C'],
        ['0', '(', '\u070D', '\u070D'],
        ['-', '\u00ab', '\u250C', '\u250C'],
        ['=', '+', '\u2510', '\u2510'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0714', '\u0730', '\u064E', '\u064E'],
        ['\u0728', '\u0733', '\u064B', '\u064B'],
        ['\u0716', '\u0736', '\u064F', '\u064F'],
        ['\u0729', '\u073A', '\u064C', '\u064C'],
        ['\u0726', '\u073D', '\u0653', '\u0653'],
        ['\u071c', '\u0740', '\u0654', '\u0654'],
        ['\u0725', '\u0741', '\u0747', '\u0747'],
        ['\u0717', '\u0308', '\u0743', '\u0743'],
        ['\u071e', '\u0304', '\u0745', '\u0745'],
        ['\u071a', '\u0307', '\u032D', '\u032D'],
        ['\u0713', '\u0303'],
        ['\u0715', '\u074A'],
        ['\u0706', ':']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u072b', '\u0731', '\u0650', '\u0650'],
        ['\u0723', '\u0734', '\u064d', '\u064d'],
        ['\u071d', '\u0737'],
        ['\u0712', '\u073b', '\u0621', '\u0621'],
        ['\u0720', '\u073e', '\u0655', '\u0655'],
        ['\u0710', '\u0711', '\u0670', '\u0670'],
        ['\u072c', '\u0640', '\u0748', '\u0748'],
        ['\u0722', '\u0324', '\u0744', '\u0744'],
        ['\u0721', '\u0331', '\u0746', '\u0746'],
        ['\u071f', '\u0323'],
        ['\u071b', '\u0330'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        [']', '\u0732'],
        ['[', '\u0735', '\u0652', '\u0652'],
        ['\u0724', '\u0738'],
        ['\u072a', '\u073c', '\u200D'],
        ['\u0727', '\u073f', '\u200C'],
        ['\u0700', '\u0739', '\u200E'],
        ['.', '\u0742', '\u200F'],
        ['\u0718', '\u060c'],
        ['\u0719', '\u061b'],
        ['\u0707', '\u061F'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['syc']
  },
  '\u0ba4\u0bae\u0bbf\u0bb4\u0bcd': {
    'name': 'Tamil',
    'keys': [
      [
        ['\u0BCA', '\u0B92'],
        ['1', '', '\u0BE7'],
        ['2', '', '\u0BE8'],
        ['3', '', '\u0BE9'],
        ['4', '', '\u0BEA'],
        ['5', '', '\u0BEB'],
        ['6', '\u0BA4\u0BCD\u0BB0', '\u0BEC'],
        ['7', '\u0B95\u0BCD\u0BB7', '\u0BED'],
        ['8', '\u0BB7\u0BCD\u0BB0', '\u0BEE'],
        ['9', '', '\u0BEF'],
        ['0', '', '\u0BF0'],
        ['-', '\u0B83', '\u0BF1'],
        ['', '', '\u0BF2'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0BCC', '\u0B94'],
        ['\u0BC8', '\u0B90'],
        ['\u0BBE', '\u0B86'],
        ['\u0BC0', '\u0B88'],
        ['\u0BC2', '\u0B8A'],
        ['\u0BAA', '\u0BAA'],
        ['\u0BB9', '\u0B99'],
        ['\u0B95', '\u0B95'],
        ['\u0BA4', '\u0BA4'],
        ['\u0B9C', '\u0B9A'],
        ['\u0B9F', '\u0B9F'],
        ['\u0B9E']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0BCB', '\u0B93'],
        ['\u0BC7', '\u0B8F'],
        ['\u0BCD', '\u0B85'],
        ['\u0BBF', '\u0B87'],
        ['\u0BC1', '\u0B89'],
        ['\u0BAA', '\u0BAA'],
        ['\u0BB0', '\u0BB1'],
        ['\u0B95', '\u0B95'],
        ['\u0BA4', '\u0BA4'],
        ['\u0B9A', '\u0B9A'],
        ['\u0B9F', '\u0B9F'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0BC6', '\u0B8E'],
        [''],
        ['\u0BAE', '\u0BA3'],
        ['\u0BA8', '\u0BA9'],
        ['\u0BB5', '\u0BB4'],
        ['\u0BB2', '\u0BB3'],
        ['\u0BB8', '\u0BB7'],
        [',', '\u0BB7'],
        ['.', '\u0BB8\u0BCD\u0BB0\u0BC0'],
        ['\u0BAF', '\u0BAF'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['ta']
  },
  '\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41': {
    'name': 'Telugu',
    'keys': [
      [
        ['\u0C4A', '\u0C12'],
        ['1', '', '\u0C67'],
        ['2', '', '\u0C68'],
        ['3', '\u0C4D\u0C30', '\u0C69'],
        ['4', '', '\u0C6A'],
        ['5', '\u0C1C\u0C4D\u0C1E', '\u0C6B'],
        ['6', '\u0C24\u0C4D\u0C30', '\u0C6C'],
        ['7', '\u0C15\u0C4D\u0C37', '\u0C6D'],
        ['8', '\u0C36\u0C4D\u0C30', '\u0C6E'],
        ['9', '(', '\u0C6F'],
        ['0', ')', '\u0C66'],
        ['-', '\u0C03'],
        ['\u0C43', '\u0C0B', '\u0C44'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0C4C', '\u0C14'],
        ['\u0C48', '\u0C10', '\u0C56'],
        ['\u0C3E', '\u0C06'],
        ['\u0C40', '\u0C08', '', '\u0C61'],
        ['\u0C42', '\u0C0A'],
        ['\u0C2C'],
        ['\u0C39', '\u0C19'],
        ['\u0C17', '\u0C18'],
        ['\u0C26', '\u0C27'],
        ['\u0C1C', '\u0C1D'],
        ['\u0C21', '\u0C22'],
        ['', '\u0C1E']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0C4B', '\u0C13'],
        ['\u0C47', '\u0C0F', '\u0C55'],
        ['\u0C4D', '\u0C05'],
        ['\u0C3F', '\u0C07', '', '\u0C0C'],
        ['\u0C41', '\u0C09'],
        ['\u0C2A', '\u0C2B'],
        ['\u0C30', '\u0C31'],
        ['\u0C15', '\u0C16'],
        ['\u0C24', '\u0C25'],
        ['\u0C1A', '\u0C1B'],
        ['\u0C1F', '\u0C25'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0C46', '\u0C0E'],
        ['\u0C02', '\u0C01'],
        ['\u0C2E', '\u0C23'],
        ['\u0C28', '\u0C28'],
        ['\u0C35'],
        ['\u0C32', '\u0C33'],
        ['\u0C38', '\u0C36'],
        [',', '\u0C37'],
        ['.'],
        ['\u0C2F'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['te']
  },
  'Ti\u1ebfng Vi\u1ec7t': {
    'name': 'Vietnamese',
    'keys': [
      [
        ['`', '~', '`', '~'],
        ['\u0103', '\u0102', '1', '!'],
        ['\u00E2', '\u00C2', '2', '@'],
        ['\u00EA', '\u00CA', '3', '#'],
        ['\u00F4', '\u00D4', '4', '$'],
        ['\u0300', '\u0300', '5', '%'],
        ['\u0309', '\u0309', '6', '^'],
        ['\u0303', '\u0303', '7', '&'],
        ['\u0301', '\u0301', '8', '*'],
        ['\u0323', '\u0323', '9', '('],
        ['\u0111', '\u0110', '0', ')'],
        ['-', '_', '-', '_'],
        ['\u20AB', '+', '=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q', 'q', 'Q'],
        ['w', 'W', 'w', 'W'],
        ['e', 'E', 'e', 'E'],
        ['r', 'R', 'r', 'R'],
        ['t', 'T', 't', 'T'],
        ['y', 'Y', 'y', 'Y'],
        ['u', 'U', 'u', 'U'],
        ['i', 'I', 'i', 'I'],
        ['o', 'O', 'o', 'O'],
        ['p', 'P', 'p', 'P'],
        ['\u01B0', '\u01AF', '[', '{'],
        ['\u01A1', '\u01A0', ']', '}'],
        ['\\', '|', '\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A', 'a', 'A'],
        ['s', 'S', 's', 'S'],
        ['d', 'D', 'd', 'D'],
        ['f', 'F', 'f', 'F'],
        ['g', 'G', 'g', 'G'],
        ['h', 'H', 'h', 'H'],
        ['j', 'J', 'j', 'J'],
        ['k', 'K', 'k', 'K'],
        ['l', 'L', 'l', 'L'],
        [';', ':', ';', ':'],
        ['\'', '"', '\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['z', 'Z', 'z', 'Z'],
        ['x', 'X', 'x', 'X'],
        ['c', 'C', 'c', 'C'],
        ['v', 'V', 'v', 'V'],
        ['b', 'B', 'b', 'B'],
        ['n', 'N', 'n', 'N'],
        ['m', 'M', 'm', 'M'],
        [',', '<', ',', '<'],
        ['.', '>', '.', '>'],
        ['/', '?', '/', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['vi']
  },
  '\u0e44\u0e17\u0e22 Kedmanee': {
    'name': 'Thai Kedmanee',
    'keys': [
      [
        ['_', '%'],
        ['\u0E45', '+'],
        ['/', '\u0E51'],
        ['-', '\u0E52'],
        ['\u0E20', '\u0E53'],
        ['\u0E16', '\u0E54'],
        ['\u0E38', '\u0E39'],
        ['\u0E36', '\u0E3F'],
        ['\u0E04', '\u0E55'],
        ['\u0E15', '\u0E56'],
        ['\u0E08', '\u0E57'],
        ['\u0E02', '\u0E58'],
        ['\u0E0A', '\u0E59'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0E46', '\u0E50'],
        ['\u0E44', '"'],
        ['\u0E33', '\u0E0E'],
        ['\u0E1E', '\u0E11'],
        ['\u0E30', '\u0E18'],
        ['\u0E31', '\u0E4D'],
        ['\u0E35', '\u0E4A'],
        ['\u0E23', '\u0E13'],
        ['\u0E19', '\u0E2F'],
        ['\u0E22', '\u0E0D'],
        ['\u0E1A', '\u0E10'],
        ['\u0E25', ','],
        ['\u0E03', '\u0E05']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0E1F', '\u0E24'],
        ['\u0E2B', '\u0E06'],
        ['\u0E01', '\u0E0F'],
        ['\u0E14', '\u0E42'],
        ['\u0E40', '\u0E0C'],
        ['\u0E49', '\u0E47'],
        ['\u0E48', '\u0E4B'],
        ['\u0E32', '\u0E29'],
        ['\u0E2A', '\u0E28'],
        ['\u0E27', '\u0E0B'],
        ['\u0E07', '.'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0E1C', '('],
        ['\u0E1B', ')'],
        ['\u0E41', '\u0E09'],
        ['\u0E2D', '\u0E2E'],
        ['\u0E34', '\u0E3A'],
        ['\u0E37', '\u0E4C'],
        ['\u0E17', '?'],
        ['\u0E21', '\u0E12'],
        ['\u0E43', '\u0E2C'],
        ['\u0E1D', '\u0E26'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['th']
  },
  '\u0e44\u0e17\u0e22 Pattachote': {
    'name': 'Thai Pattachote',
    'keys': [
      [
        ['_', '\u0E3F'],
        ['=', '+'],
        ['\u0E52', '"'],
        ['\u0E53', '/'],
        ['\u0E54', ','],
        ['\u0E55', '?'],
        ['\u0E39', '\u0E38'],
        ['\u0E57', '_'],
        ['\u0E58', '.'],
        ['\u0E59', '('],
        ['\u0E50', ')'],
        ['\u0E51', '-'],
        ['\u0E56', '%'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0E47', '\u0E4A'],
        ['\u0E15', '\u0E24'],
        ['\u0E22', '\u0E46'],
        ['\u0E2D', '\u0E0D'],
        ['\u0E23', '\u0E29'],
        ['\u0E48', '\u0E36'],
        ['\u0E14', '\u0E1D'],
        ['\u0E21', '\u0E0B'],
        ['\u0E27', '\u0E16'],
        ['\u0E41', '\u0E12'],
        ['\u0E43', '\u0E2F'],
        ['\u0E0C', '\u0E26'],
        ['\uF8C7', '\u0E4D']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0E49', '\u0E4B'],
        ['\u0E17', '\u0E18'],
        ['\u0E07', '\u0E33'],
        ['\u0E01', '\u0E13'],
        ['\u0E31', '\u0E4C'],
        ['\u0E35', '\u0E37'],
        ['\u0E32', '\u0E1C'],
        ['\u0E19', '\u0E0A'],
        ['\u0E40', '\u0E42'],
        ['\u0E44', '\u0E06'],
        ['\u0E02', '\u0E11'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0E1A', '\u0E0E'],
        ['\u0E1B', '\u0E0F'],
        ['\u0E25', '\u0E10'],
        ['\u0E2B', '\u0E20'],
        ['\u0E34', '\u0E31'],
        ['\u0E04', '\u0E28'],
        ['\u0E2A', '\u0E2E'],
        ['\u0E30', '\u0E1F'],
        ['\u0E08', '\u0E09'],
        ['\u0E1E', '\u0E2C'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ]
  },
  '\u0422\u0430\u0442\u0430\u0440\u0447\u0430': {
    'name': 'Tatar',
    'keys': [
      [
        ['\u04BB', '\u04BA', '\u0451', '\u0401'],
        ['1', '!'],
        ['2', '"', '@'],
        ['3', '\u2116', '#'],
        ['4', ';', '$'],
        ['5', '%'],
        ['6', ':'],
        ['7', '?', '['],
        ['8', '*', ']'],
        ['9', '(', '{'],
        ['0', ')', '}'],
        ['-', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0439', '\u0419'],
        ['\u04E9', '\u04E8', '\u0446', '\u0426'],
        ['\u0443', '\u0423'],
        ['\u043A', '\u041A'],
        ['\u0435', '\u0415'],
        ['\u043D', '\u041D'],
        ['\u0433', '\u0413'],
        ['\u0448', '\u0428'],
        ['\u04D9', '\u04D8', '\u0449', '\u0429'],
        ['\u0437', '\u0417'],
        ['\u0445', '\u0425'],
        ['\u04AF', '\u04AE', '\u044A', '\u042A'],
        ['\\', '/']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0444', '\u0424'],
        ['\u044B', '\u042B'],
        ['\u0432', '\u0412'],
        ['\u0430', '\u0410'],
        ['\u043F', '\u041F'],
        ['\u0440', '\u0420'],
        ['\u043E', '\u041E'],
        ['\u043B', '\u041B'],
        ['\u0434', '\u0414'],
        ['\u04A3', '\u04A2', '\u0436', '\u0416'],
        ['\u044D', '\u042D', '\''],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0491', '\u0490'],
        ['\u044F', '\u042F'],
        ['\u0447', '\u0427'],
        ['\u0441', '\u0421'],
        ['\u043C', '\u041C'],
        ['\u0438', '\u0418'],
        ['\u0442', '\u0422'],
        ['\u0497', '\u0496', '\u044C', '\u042C'],
        ['\u0431', '\u0411', '<'],
        ['\u044E', '\u042E', '>'],
        ['.', ','],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['tt']
  },
  'T\u00fcrk\u00e7e F': {
    'name': 'Turkish F',
    'keys': [
      [
        ['+', '*', '\u00ac'],
        ['1', '!', '\u00b9', '\u00a1'],
        ['2', '"', '\u00b2'],
        ['3', '^', '#', '\u00b3'],
        ['4', '$', '\u00bc', '\u00a4'],
        ['5', '%', '\u00bd'],
        ['6', '&', '\u00be'],
        ['7', '\'', '{'],
        ['8', '(', '['],
        ['9', ')', ']'],
        ['0', '=', '}'],
        ['/', '?', '\\', '\u00bf'],
        ['-', '_', '|'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['f', 'F', '@'],
        ['g', 'G'],
        ['\u011f', '\u011e'],
        ['\u0131', 'I', '\u00b6', '\u00ae'],
        ['o', 'O'],
        ['d', 'D', '\u00a5'],
        ['r', 'R'],
        ['n', 'N'],
        ['h', 'H', '\u00f8', '\u00d8'],
        ['p', 'P', '\u00a3'],
        ['q', 'Q', '\u00a8'],
        ['w', 'W', '~'],
        ['x', 'X', '`']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['u', 'U', '\u00e6', '\u00c6'],
        ['i', '\u0130', '\u00df', '\u00a7'],
        ['e', 'E', '\u20ac'],
        ['a', 'A', ' ', '\u00aa'],
        ['\u00fc', '\u00dc'],
        ['t', 'T'],
        ['k', 'K'],
        ['m', 'M'],
        ['l', 'L'],
        ['y', 'Y', '\u00b4'],
        ['\u015f', '\u015e'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>', '|', '\u00a6'],
        ['j', 'J', '\u00ab', '<'],
        ['\u00f6', '\u00d6', '\u00bb', '>'],
        ['v', 'V', '\u00a2', '\u00a9'],
        ['c', 'C'],
        ['\u00e7', '\u00c7'],
        ['z', 'Z'],
        ['s', 'S', '\u00b5', '\u00ba'],
        ['b', 'B', '\u00d7'],
        ['.', ':', '\u00f7'],
        [',', ';', '-'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ]
  },
  'T\u00fcrk\u00e7e Q': {
    'name': 'Turkish Q',
    'keys': [
      [
        ['"', '\u00e9', '<'],
        ['1', '!', '>'],
        ['2', '\'', '\u00a3'],
        ['3', '^', '#'],
        ['4', '+', '$'],
        ['5', '%', '\u00bd'],
        ['6', '&'],
        ['7', '/', '{'],
        ['8', '(', '['],
        ['9', ')', ']'],
        ['0', '=', '}'],
        ['*', '?', '\\'],
        ['-', '_', '|'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['q', 'Q', '@'],
        ['w', 'W'],
        ['e', 'E', '\u20ac'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U'],
        ['\u0131', 'I', 'i', '\u0130'],
        ['o', 'O'],
        ['p', 'P'],
        ['\u011f', '\u011e', '\u00a8'],
        ['\u00fc', '\u00dc', '~'],
        [',', ';', '`']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A', '\u00e6', '\u00c6'],
        ['s', 'S', '\u00df'],
        ['d', 'D'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L'],
        ['\u015f', '\u015e', '\u00b4'],
        ['i', '\u0130'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['<', '>', '|'],
        ['z', 'Z'],
        ['x', 'X'],
        ['c', 'C'],
        ['v', 'V'],
        ['b', 'B'],
        ['n', 'N'],
        ['m', 'M'],
        ['\u00f6', '\u00d6'],
        ['\u00e7', '\u00c7'],
        ['.', ':'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['tr']
  },
  '\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430': {
    'name': 'Ukrainian',
    'keys': [
      [
        ['\u00b4', '~'],
        ['1', '!'],
        ['2', '"'],
        ['3', '\u2116'],
        ['4', ';'],
        ['5', '%'],
        ['6', ':'],
        ['7', '?'],
        ['8', '*'],
        ['9', '('],
        ['0', ')'],
        ['-', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0439', '\u0419'],
        ['\u0446', '\u0426'],
        ['\u0443', '\u0423'],
        ['\u043A', '\u041A'],
        ['\u0435', '\u0415'],
        ['\u043D', '\u041D'],
        ['\u0433', '\u0413'],
        ['\u0448', '\u0428'],
        ['\u0449', '\u0429'],
        ['\u0437', '\u0417'],
        ['\u0445', '\u0425'],
        ['\u0457', '\u0407'],
        ['\u0491', '\u0490']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0444', '\u0424'],
        ['\u0456', '\u0406'],
        ['\u0432', '\u0412'],
        ['\u0430', '\u0410'],
        ['\u043F', '\u041F'],
        ['\u0440', '\u0420'],
        ['\u043E', '\u041E'],
        ['\u043B', '\u041B'],
        ['\u0434', '\u0414'],
        ['\u0436', '\u0416'],
        ['\u0454', '\u0404'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u044F', '\u042F'],
        ['\u0447', '\u0427'],
        ['\u0441', '\u0421'],
        ['\u043C', '\u041C'],
        ['\u0438', '\u0418'],
        ['\u0442', '\u0422'],
        ['\u044C', '\u042C'],
        ['\u0431', '\u0411'],
        ['\u044E', '\u042E'],
        ['.', ','],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['uk']
  },
  'United Kingdom': {
    'name': 'United Kingdom',
    'keys': [
      [
        ['`', '\u00ac', '\u00a6'],
        ['1', '!'],
        ['2', '"'],
        ['3', '\u00a3'],
        ['4', '$', '\u20ac'],
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
        ['e', 'E', '\u00e9', '\u00c9'],
        ['r', 'R'],
        ['t', 'T'],
        ['y', 'Y'],
        ['u', 'U', '\u00fa', '\u00da'],
        ['i', 'I', '\u00ed', '\u00cd'],
        ['o', 'O', '\u00f3', '\u00d3'],
        ['p', 'P'],
        ['[', '{'],
        [']', '}'],
        ['#', '~']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['a', 'A', '\u00e1', '\u00c1'],
        ['s', 'S'],
        ['d', 'D'],
        ['f', 'F'],
        ['g', 'G'],
        ['h', 'H'],
        ['j', 'J'],
        ['k', 'K'],
        ['l', 'L'],
        [';', ':'],
        ['\'', '@'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\\', '|'],
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
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr, KeyboardClassKey.AltGr]
      ]
    ],
    'lang': ['en-GB']
  },
  '\u0627\u0631\u062f\u0648': {
    'name': 'Urdu',
    'keys': [
      [
        ['`', '~'],
        ['1', '!'],
        ['2', '@'],
        ['3', '#'],
        ['4', '$'],
        ['5', '\u066A'],
        ['6', '^'],
        ['7', '\u06D6'],
        ['8', '\u066D'],
        ['9', ')'],
        ['0', '('],
        ['-', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0637', '\u0638'],
        ['\u0635', '\u0636'],
        ['\u06be', '\u0630'],
        ['\u062f', '\u0688'],
        ['\u0679', '\u062B'],
        ['\u067e', '\u0651'],
        ['\u062a', '\u06C3'],
        ['\u0628', '\u0640'],
        ['\u062c', '\u0686'],
        ['\u062d', '\u062E'],
        [']', '}'],
        ['[', '{'],
        ['\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0645', '\u0698'],
        ['\u0648', '\u0632'],
        ['\u0631', '\u0691'],
        ['\u0646', '\u06BA'],
        ['\u0644', '\u06C2'],
        ['\u06c1', '\u0621'],
        ['\u0627', '\u0622'],
        ['\u06A9', '\u06AF'],
        ['\u06CC', '\u064A'],
        ['\u061b', ':'],
        ['\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0642', '\u200D'],
        ['\u0641', '\u200C'],
        ['\u06D2', '\u06D3'],
        ['\u0633', '\u200E'],
        ['\u0634', '\u0624'],
        ['\u063a', '\u0626'],
        ['\u0639', '\u200F'],
        ['\u060C', '>'],
        ['\u06D4', '<'],
        ['/', '\u061F'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['ur']
  },
  '\u0627\u0631\u062f\u0648 Phonetic': {
    'name': 'Urdu Phonetic',
    'keys': [
      [
        ['\u064D', '\u064B', '~'],
        ['\u06F1', '1', '!'],
        ['\u06F2', '2', '@'],
        ['\u06F3', '3', '#'],
        ['\u06F4', '4', '$'],
        ['\u06F5', '5', '\u066A'],
        ['\u06F6', '6', '^'],
        ['\u06F7', '7', '&'],
        ['\u06F8', '8', '*'],
        ['\u06F9', '9', '('],
        ['\u06F0', '0', ')'],
        ['-', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0642', '\u0652'],
        ['\u0648', '\u0651', '\u0602'],
        ['\u0639', '\u0670', '\u0656'],
        ['\u0631', '\u0691', '\u0613'],
        ['\u062A', '\u0679', '\u0614'],
        ['\u06D2', '\u064E', '\u0601'],
        ['\u0621', '\u0626', '\u0654'],
        ['\u06CC', '\u0650', '\u0611'],
        ['\u06C1', '\u06C3'],
        ['\u067E', '\u064F', '\u0657'],
        ['[', '{'],
        [']', '}'],
        ['\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0627', '\u0622', '\uFDF2'],
        ['\u0633', '\u0635', '\u0610'],
        ['\u062F', '\u0688', '\uFDFA'],
        ['\u0641'],
        ['\u06AF', '\u063A'],
        ['\u062D', '\u06BE', '\u0612'],
        ['\u062C', '\u0636', '\uFDFB'],
        ['\u06A9', '\u062E'],
        ['\u0644'],
        ['\u061B', ':'],
        ['\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u0632', '\u0630', '\u060F'],
        ['\u0634', '\u0698', '\u060E'],
        ['\u0686', '\u062B', '\u0603'],
        ['\u0637', '\u0638'],
        ['\u0628', '', '\uFDFD'],
        ['\u0646', '\u06BA', '\u0600'],
        ['\u0645', '\u0658'],
        ['\u060C', '', '<'],
        ['\u06D4', '\u066B', '>'],
        ['/', '\u061F'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt]
      ]
    ]
  },
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
  },
  '\u040e\u0437\u0431\u0435\u043a\u0447\u0430': {
    'name': 'Uzbek Cyrillic',
    'keys': [
      [
        ['\u0451', '\u0401'],
        ['1', '!'],
        ['2', '"'],
        ['3', '\u2116'],
        ['4', ';'],
        ['5', '%'],
        ['6', ':'],
        ['7', '?'],
        ['8', '*'],
        ['9', '('],
        ['0', ')'],
        ['\u0493', '\u0492'],
        ['\u04B3', '\u04B2'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u0439', '\u0419'],
        ['\u0446', '\u0426'],
        ['\u0443', '\u0423'],
        ['\u043A', '\u041A'],
        ['\u0435', '\u0415'],
        ['\u043D', '\u041D'],
        ['\u0433', '\u0413'],
        ['\u0448', '\u0428'],
        ['\u045E', '\u040E'],
        ['\u0437', '\u0417'],
        ['\u0445', '\u0425'],
        ['\u044A', '\u042A'],
        ['\\', '/']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u0444', '\u0424'],
        ['\u049B', '\u049A'],
        ['\u0432', '\u0412'],
        ['\u0430', '\u0410'],
        ['\u043F', '\u041F'],
        ['\u0440', '\u0420'],
        ['\u043E', '\u041E'],
        ['\u043B', '\u041B'],
        ['\u0434', '\u0414'],
        ['\u0436', '\u0416'],
        ['\u044D', '\u042D'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u044F', '\u042F'],
        ['\u0447', '\u0427'],
        ['\u0441', '\u0421'],
        ['\u043C', '\u041C'],
        ['\u0438', '\u0418'],
        ['\u0442', '\u0422'],
        ['\u044C', '\u042C'],
        ['\u0431', '\u0411'],
        ['\u044E', '\u042E'],
        ['.', ','],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['uz']
  },
  '\u05d9\u05d9\u05b4\u05d3\u05d9\u05e9': { // from http://www.yv.org/uyip/hebyidkbd.txt http://uyip.org/keyboards.html
    'name': 'Yiddish',
    'keys': [
      [
        [';', '~', '\u05B0'],
        ['1', '!', '\u05B1'],
        ['2', '@', '\u05B2'],
        ['3', '#', '\u05B3'],
        ['4', '$', '\u05B4'],
        ['5', '%', '\u05B5'],
        ['6', '^', '\u05B6'],
        ['7', '*', '\u05B7'],
        ['8', '&', '\u05B8'],
        ['9', '(', '\u05C2'],
        ['0', ')', '\u05C1'],
        ['-', '_', '\u05B9'],
        ['=', '+', '\u05BC'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['/', '\u201F', '\u201F'],
        ['\'', '\u201E', '\u201E'],
        ['\u05E7', '`', '`'],
        ['\u05E8', '\uFB2F', '\uFB2F'],
        ['\u05D0', '\uFB2E', '\uFB2E'],
        ['\u05D8', '\u05F0', '\u05F0'],
        ['\u05D5', '\uFB35', '\uFB35'],
        ['\u05DF', '\uFB4B', '\uFB4B'],
        ['\u05DD', '\uFB4E', '\uFB4E'],
        ['\u05E4', '\uFB44', '\uFB44'],
        ['[', '{', '\u05BD'],
        [']', '}', '\u05BF'],
        ['\\', '|', '\u05BB']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u05E9', '\uFB2A', '\uFB2A'],
        ['\u05D3', '\uFB2B', '\uFB2B'],
        ['\u05D2'],
        ['\u05DB', '\uFB3B', '\uFB3B'],
        ['\u05E2', '\u05F1', '\u05F1'],
        ['\u05D9', '\uFB1D', '\uFB1D'],
        ['\u05D7', '\uFF1F', '\uFF1F'],
        ['\u05DC', '\u05F2', '\u05F2'],
        ['\u05DA'],
        ['\u05E3', ':', '\u05C3'],
        [',', '"', '\u05C0'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u05D6', '\u2260', '\u2260'],
        ['\u05E1', '\uFB4C', '\uFB4C'],
        ['\u05D1', '\uFB31', '\uFB31'],
        ['\u05D4', '\u05BE', '\u05BE'],
        ['\u05E0', '\u2013', '\u2013'],
        ['\u05DE', '\u2014', '\u2014'],
        ['\u05E6', '\uFB4A', '\uFB4A'],
        ['\u05EA', '<', '\u05F3'],
        ['\u05E5', '>', '\u05F4'],
        ['.', '?', '\u20AA'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt]
      ]
    ],
    'lang': ['yi']
  },
  '\u05d9\u05d9\u05b4\u05d3\u05d9\u05e9 \u05dc\u05e2\u05d1\u05d8': { // from http://jidysz.net/
    'name': 'Yiddish (Yidish Lebt)',
    'keys': [
      [
        [';', '~'],
        ['1', '!', '\u05B2', '\u05B2'],
        ['2', '@', '\u05B3', '\u05B3'],
        ['3', '#', '\u05B1', '\u05B1'],
        ['4', '$', '\u05B4', '\u05B4'],
        ['5', '%', '\u05B5', '\u05B5'],
        ['6', '^', '\u05B7', '\u05B7'],
        ['7', '&', '\u05B8', '\u05B8'],
        ['8', '*', '\u05BB', '\u05BB'],
        ['9', ')', '\u05B6', '\u05B6'],
        ['0', '(', '\u05B0', '\u05B0'],
        ['-', '_', '\u05BF', '\u05BF'],
        ['=', '+', '\u05B9', '\u05B9'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['/', '', '\u05F4', '\u05F4'],
        ['\'', '', '\u05F3', '\u05F3'],
        ['\u05E7', '', '\u20AC'],
        ['\u05E8'],
        ['\u05D0', '', '\u05D0\u05B7', '\uFB2E'],
        ['\u05D8', '', '\u05D0\u05B8', '\uFB2F'],
        ['\u05D5', '\u05D5\u05B9', '\u05D5\u05BC', '\uFB35'],
        ['\u05DF', '', '\u05D5\u05D5', '\u05F0'],
        ['\u05DD', '', '\u05BC'],
        ['\u05E4', '', '\u05E4\u05BC', '\uFB44'],
        [']', '}', '\u201E', '\u201D'],
        ['[', '{', '\u201A', '\u2019'],
        ['\\', '|', '\u05BE', '\u05BE']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u05E9', '\u05E9\u05C1', '\u05E9\u05C2', '\uFB2B'],
        ['\u05D3', '', '\u20AA'],
        ['\u05D2', '\u201E'],
        ['\u05DB', '', '\u05DB\u05BC', '\uFB3B'],
        ['\u05E2', '', '', '\uFB20'],
        ['\u05D9', '', '\u05D9\u05B4', '\uFB1D'],
        ['\u05D7', '', '\u05F2\u05B7', '\uFB1F'],
        ['\u05DC', '\u05DC\u05B9', '\u05D5\u05D9', '\u05F1'],
        ['\u05DA', '', '', '\u05F2'],
        ['\u05E3', ':', '\u05E4\u05BF', '\uFB4E'],
        [',', '"', ';', '\u05B2'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u05D6', '', '\u2013', '\u2013'],
        ['\u05E1', '', '\u2014', '\u2014'],
        ['\u05D1', '\u05DC\u05B9', '\u05D1\u05BF', '\uFB4C'],
        ['\u05D4', '', '\u201D', '\u201C'],
        ['\u05E0', '', '\u059C', '\u059E'],
        ['\u05DE', '', '\u2019', '\u2018'],
        ['\u05E6', '', '\u05E9\u05C1', '\uFB2A'],
        ['\u05EA', '>', '\u05EA\u05BC', '\uFB4A'],
        ['\u05E5', '<'],
        ['.', '?', '\u2026'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space],
        [KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt, KeyboardClassKey.Alt]
      ]
    ],
    'lang': ['yi']
  },
  '\u4e2d\u6587\u6ce8\u97f3\u7b26\u53f7': {
    'name': 'Chinese Bopomofo IME',
    'keys': [
      [
        ['\u20AC', '~'],
        ['\u3105', '!'],
        ['\u3109', '@'],
        ['\u02C7', '#'],
        ['\u02CB', '$'],
        ['\u3113', '%'],
        ['\u02CA', '^'],
        ['\u02D9', '&'],
        ['\u311A', '*'],
        ['\u311E', ')'],
        ['\u3122', '('],
        ['\u3126', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u3106', 'q'],
        ['\u310A', 'w'],
        ['\u310D', 'e'],
        ['\u3110', 'r'],
        ['\u3114', 't'],
        ['\u3117', 'y'],
        ['\u3127', 'u'],
        ['\u311B', 'i'],
        ['\u311F', 'o'],
        ['\u3123', 'p'],
        ['[', '{'],
        [']', '}'],
        ['\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u3107', 'a'],
        ['\u310B', 's'],
        ['\u310E', 'd'],
        ['\u3111', 'f'],
        ['\u3115', 'g'],
        ['\u3118', 'h'],
        ['\u3128', 'j'],
        ['\u311C', 'k'],
        ['\u3120', 'l'],
        ['\u3124', ':'],
        ['\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\u3108', 'z'],
        ['\u310C', 'x'],
        ['\u310F', 'c'],
        ['\u3112', 'v'],
        ['\u3116', 'b'],
        ['\u3119', 'n'],
        ['\u3129', 'm'],
        ['\u311D', '<'],
        ['\u3121', '>'],
        ['\u3125', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['zh-BOPO']
  },
  '\u4e2d\u6587\u4ed3\u9889\u8f93\u5165\u6cd5': {
    'name': 'Chinese Cangjie IME',
    'keys': [
      [
        ['\u20AC', '~'],
        ['1', '!'],
        ['2', '@'],
        ['3', '#'],
        ['4', '$'],
        ['5', '%'],
        ['6', '^'],
        ['7', '&'],
        ['8', '*'],
        ['9', ')'],
        ['0', '('],
        ['-', '_'],
        ['=', '+'],
        [KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp, KeyboardClassKey.Bksp]
      ],
      [
        [KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab, KeyboardClassKey.Tab],
        ['\u624B', 'q'],
        ['\u7530', 'w'],
        ['\u6C34', 'e'],
        ['\u53E3', 'r'],
        ['\u5EFF', 't'],
        ['\u535C', 'y'],
        ['\u5C71', 'u'],
        ['\u6208', 'i'],
        ['\u4EBA', 'o'],
        ['\u5FC3', 'p'],
        ['[', '{'],
        [']', '}'],
        ['\\', '|']
      ],
      [
        [KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps, KeyboardClassKey.Caps],
        ['\u65E5', 'a'],
        ['\u5C38', 's'],
        ['\u6728', 'd'],
        ['\u706B', 'f'],
        ['\u571F', 'g'],
        ['\u7AF9', 'h'],
        ['\u5341', 'j'],
        ['\u5927', 'k'],
        ['\u4E2D', 'l'],
        [';', ':'],
        ['\'', '"'],
        [KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter, KeyboardClassKey.Enter]
      ],
      [
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift],
        ['\uFF3A', 'z'],
        ['\u96E3', 'x'],
        ['\u91D1', 'c'],
        ['\u5973', 'v'],
        ['\u6708', 'b'],
        ['\u5F13', 'n'],
        ['\u4E00', 'm'],
        [',', '<'],
        ['.', '>'],
        ['/', '?'],
        [KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift, KeyboardClassKey.Shift]
      ],
      [
        [KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space, KeyboardClassKey.Space]
      ]
    ],
    'lang': ['zh']
  }
};

// aliases
keyboardLayouts['Hrvatski'] = {
  'name': 'Croatian',
  'keys': keyboardLayouts['Bosanski'].keys.slice(0),
  'lang': ['hr']
};

keyboardLayouts['Sloven\u0161\u010dina'] = {
  'name': 'Slovenian',
  'keys': keyboardLayouts['Bosanski'].keys.slice(0),
  'lang': ['sl']
};

keyboardLayouts['Srpski'] = {
  'name': 'Serbian Latin',
  'keys': keyboardLayouts['Bosanski'].keys.slice(0),
  'lang': ['sr']
};

export { keyboardLayouts, MAT_KEYBOARD_LAYOUTS };
