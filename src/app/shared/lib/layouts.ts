export type KeyboardLayout = Array<Array<string>>;

export const alphanumericKeyboard: KeyboardLayout = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'CapsLock'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '-', '.', 'Shift'],
];

export const azertyKeyboard: KeyboardLayout = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'],
  ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'CapsLock'],
  ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'Enter'],
  ['Shift', 'w', 'x', 'c', 'v', 'b', 'n', '-', '.', 'Shift']
];

export const extendedKeyboard: KeyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'Backspace'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'Enter'],
  ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '-', '_', 'Shift'],
  ['Special', '@', 'SpaceBar:7', 'Left', 'Right']
];

export const numericKeyboard: KeyboardLayout = [
  ['1', '2', '3', 'Backspace'],
  ['4', '5', '6', 'Enter'],
  ['7', '8', '9', 'Spacer'],
  ['.', '0', 'Left', 'Right']
];

export const phoneKeyboard: KeyboardLayout = [
  ['1', '2', '3', 'Backspace'],
  ['4', '5', '6', '-'],
  ['7', '8', '9', '+'],
  ['0', 'Left', 'Right', 'Enter']
];

export const specialKeyboard: KeyboardLayout = [
  ['!', '@', '#', '%', '&', 'Spacer', '1', '2', '3', 'Backspace'],
  ['(', ')', '-', '_', '\\', 'Spacer', '4', '5', '6', 'Enter'],
  ['$', '/', '<', '>', '?', 'Spacer', '7', '8', '9', 'Spacer'],
  ['SpecialBack', '*', ':', ';', '~', 'Spacer', '0', '.', 'Left', 'Right']
];

export const specialKeys: Array<string> = [
  'Enter',
  'Backspace',
  'Escape',
  'CapsLock',
  'SpaceBar',
  'Spacer',
  'Shift',
  'Left',
  'Right',
  'Special',
  'SpecialBack'
];

export const specialKeyIcons = {
  Enter: '&#9166;',
  Backspace: '&#9003;',
  Escape: '&#9243;',
  SpaceBar: '&#8239;',
  Shift: '&#8593;',
  Left: '&#10094;',
  Right: '&#10095;',
  Special: '&123',
  SpecialBack: 'ABC'
};

export const specialKeyTexts = {
  CapsLock: 'Caps'
};

export const notDisabledSpecialKeys = [
  'Enter',
  'Backspace',
  'Escape'
];

export function isSpacer(key: string): boolean {
  if (key.length > 1) {
    return /^Spacer(:(\d+(\.\d+)?))?$/g.test(key);
  }

  return false;
}

export function isGrey(key: string): boolean {
  if (key.length > 1) {
    return /^Shift|Left|Right|Special|SpecialBack(:(\d+(\.\d+)?))?$/g.test(key);
  }

  return false;
}

export function isSpaceBar(key: string): boolean {
  if (key.length > 1) {
    return /^SpaceBar(:(\d+(\.\d+)?))?$/g.test(key);
  }

  return false;
}

export function isShift(key: string): boolean {
  if (key.length > 1) {
    return /^Shift(:(\d+(\.\d+)?))?$/g.test(key);
  }

  return false;
}

export function isSpecial(key: string): boolean {
  if (key.length > 1) {
    return !!specialKeys.filter(specialKey => {
      const pattern = new RegExp(`^(${specialKey})(:(\\d+(\\.\\d+)?))?$`, 'g');

      return pattern.test(key);
    }).length;
  }

  return false;
}

export function keyboardCapsLockLayout(layout: KeyboardLayout, caps: boolean): KeyboardLayout {
  return layout.map((row: Array<string>): Array<string> => {
    return row.map((key: string): string => {
      return isSpecial(key) ? key : (caps ? key.toUpperCase() : key.toLowerCase());
    });
  });
}
