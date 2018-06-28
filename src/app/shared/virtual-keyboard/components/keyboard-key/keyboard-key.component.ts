import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MAT_KEYBOARD_DEADKEYS } from '../../configs/keyboard-deadkey.config';
import { MAT_KEYBOARD_ICONS } from '../../configs/keyboard-icons.config';
import { KeyboardClassKey } from '../../enums/keyboard-class-key.enum';
import { IKeyboardDeadkeys } from '../../interfaces/keyboard-deadkeys.interface';
import { IKeyboardIcons } from '../../interfaces/keyboard-icons.interface';

export const VALUE_NEWLINE = '\n\r';
export const VALUE_SPACE = ' ';
export const VALUE_TAB = '\t';

@Component({
  selector: 'mat-keyboard-key',
  templateUrl: './keyboard-key.component.html',
  styleUrls: ['./keyboard-key.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false
})
export class MatKeyboardKeyComponent implements OnInit {

  private _deadkeyKeys: string[] = [];

  private _iconKeys: string[] = [];

  active$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  pressed$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @Input()
  key: string | KeyboardClassKey;

  @Input()
  set active(active: boolean) {
    this.active$.next(active);
  }

  get active(): boolean {
    return this.active$.getValue();
  }

  @Input()
  set pressed(pressed: boolean) {
    this.pressed$.next(pressed);
  }

  get pressed(): boolean {
    return this.pressed$.getValue();
  }

  @Input()
  input?: ElementRef;

  @Input()
  control?: FormControl;

  @Output()
  genericClick = new EventEmitter<MouseEvent>();

  @Output()
  enterClick = new EventEmitter<MouseEvent>();

  @Output()
  bkspClick = new EventEmitter<MouseEvent>();

  @Output()
  capsClick = new EventEmitter<MouseEvent>();

  @Output()
  altClick = new EventEmitter<MouseEvent>();

  @Output()
  shiftClick = new EventEmitter<MouseEvent>();

  @Output()
  spaceClick = new EventEmitter<MouseEvent>();

  @Output()
  tabClick = new EventEmitter<MouseEvent>();

  @Output()
  keyClick = new EventEmitter<MouseEvent>();

  get lowerKey(): string {
    return `${this.key}`.toLowerCase();
  }

  get charCode(): number {
    return `${this.key}`.charCodeAt(0);
  }

  get isClassKey(): boolean {
    return this.key in KeyboardClassKey;
  }

  get isDeadKey(): boolean {
    return this._deadkeyKeys.some((deadKey: string) => deadKey === `${this.key}`);
  }

  get hasIcon(): boolean {
    return this._iconKeys.some((iconKey: string) => iconKey === `${this.key}`);
  }

  get icon(): string {
    return this._icons[this.key];
  }

  get cssClass(): string {
    const classes = [];

    if (this.hasIcon) {
      classes.push('mat-keyboard-key-modifier');
      classes.push(`mat-keyboard-key-${this.lowerKey}`);
    }

    if (this.isDeadKey) {
      classes.push('mat-keyboard-key-deadkey');
    }

    return classes.join(' ');
  }

  get inputValue(): string {
    if (this.control) {
      return this.control.value;
    } else if (this.input && this.input.nativeElement && this.input.nativeElement.value) {
      return this.input.nativeElement.value;
    } else {
      return '';
    }
  }

  set inputValue(inputValue: string) {
    if (this.control) {
      this.control.setValue(inputValue);
    } else if (this.input && this.input.nativeElement) {
      this.input.nativeElement.value = inputValue;
    }
  }

  // Inject dependencies
  constructor(@Inject(MAT_KEYBOARD_DEADKEYS) private _deadkeys: IKeyboardDeadkeys,
              @Inject(MAT_KEYBOARD_ICONS) private _icons: IKeyboardIcons) {}

  ngOnInit() {
    // read the deadkeys
    this._deadkeyKeys = Object.keys(this._deadkeys);

    // read the icons
    this._iconKeys = Object.keys(this._icons);
  }

  onClick(event: MouseEvent) {
    // Trigger a global key event
    // TODO: investigate
    this._triggerKeyEvent();

    // Trigger generic click event
    this.genericClick.emit(event);

    // Manipulate the focused input / textarea value
    const value = this.inputValue;
    const caret = this.input ? this._getCursorPosition() : 0;

    let char: string;
    switch (this.key) {
      // this keys have no actions yet
      // TODO: add deadkeys and modifiers
      case KeyboardClassKey.Alt:
      case KeyboardClassKey.AltGr:
      case KeyboardClassKey.AltLk:
        this.altClick.emit(event);
        break;

      case KeyboardClassKey.Bksp:
        this.inputValue = [value.slice(0, caret - 1), value.slice(caret)].join('');
        this._setCursorPosition(caret - 1);
        this.bkspClick.emit(event);
        break;

      case KeyboardClassKey.Caps:
        this.capsClick.emit(event);
        break;

      case KeyboardClassKey.Enter:
        if (this._isTextarea()) {
          char = VALUE_NEWLINE;
        } else {
          this.enterClick.emit(event);
          // TODO: trigger submit / onSubmit / ngSubmit properly (for the time being this has to be handled by the user himself)
          // console.log(this.control.ngControl.control.root)
          // this.input.nativeElement.form.submit();
        }
        break;

      case KeyboardClassKey.Shift:
        this.shiftClick.emit(event);
        break;

      case KeyboardClassKey.Space:
        char = VALUE_SPACE;
        this.spaceClick.emit(event);
        break;

      case KeyboardClassKey.Tab:
        char = VALUE_TAB;
        this.tabClick.emit(event);
        break;

      default:
        // the key is not mapped or a string
        char = `${this.key}`;
        this.keyClick.emit(event);
        break;
    }

    if (char && this.input) {
      this.inputValue = [value.slice(0, caret), char, value.slice(caret)].join('');
      this._setCursorPosition(caret + 1);
    }
  }

  private _triggerKeyEvent(): Event {
    const keyboardEvent = new KeyboardEvent('keydown');
    //
    // keyboardEvent[initMethod](
    //   true, // bubbles
    //   true, // cancelable
    //   window, // viewArg: should be window
    //   false, // ctrlKeyArg
    //   false, // altKeyArg
    //   false, // shiftKeyArg
    //   false, // metaKeyArg
    //   this.charCode, // keyCodeArg : unsigned long - the virtual key code, else 0
    //   0 // charCodeArgs : unsigned long - the Unicode character associated with the depressed key, else 0
    // );
    //
    // window.document.dispatchEvent(keyboardEvent);

    return keyboardEvent;
  }

  // inspired by:
  // ref https://stackoverflow.com/a/2897510/1146207
  private _getCursorPosition(): number {
    if (!this.input) {
      return;
    }

    if ('selectionStart' in this.input.nativeElement) {
      // Standard-compliant browsers
      return this.input.nativeElement.selectionStart;
    } else if ('selection' in window.document) {
      // IE
      this.input.nativeElement.focus();
      const sel = window.document['selection'].createRange();
      const selLen = window.document['selection'].createRange().text.length;
      sel.moveStart('character', -this.control.value.length);

      return sel.text.length - selLen;
    }
  }

  // inspired by:
  // ref https://stackoverflow.com/a/12518737/1146207
  // tslint:disable one-line
  private _setCursorPosition(position: number): boolean {
    if (!this.input) {
      return;
    }

    this.inputValue = this.control.value;
    // ^ this is used to not only get "focus", but
    // to make sure we don't have it everything -selected-
    // (it causes an issue in chrome, and having it doesn't hurt any other browser)

    if ('createTextRange' in this.input.nativeElement) {
      const range = this.input.nativeElement.createTextRange();
      range.move('character', position);
      range.select();
      return true;
    } else {
      // (el.selectionStart === 0 added for Firefox bug)
      if (this.input.nativeElement.selectionStart || this.input.nativeElement.selectionStart === 0) {
        this.input.nativeElement.focus();
        this.input.nativeElement.setSelectionRange(position, position);
        return true;
      }
      // fail city, fortunately this never happens (as far as I've tested) :)
      else {
        this.input.nativeElement.focus();
        return false;
      }
    }
  }

  private _isTextarea(): boolean {
    return this.input && this.input.nativeElement && this.input.nativeElement.tagName === 'TEXTAREA';
  }

}
