import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Optional, Output, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

import { MatKeyboardRef } from '../classes/keyboard-ref.class';
import { MatKeyboardComponent } from '../components/keyboard/keyboard.component';
import { MatKeyboardService } from '../services/keyboard.service';

@Directive({
  selector: 'input[matKeyboard], textarea[matKeyboard]'
})
export class MatKeyboardDirective implements OnDestroy {

  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;
  keyboardVisible: boolean =  false;
  @Input() matKeyboard: string;

  @Input() darkTheme: boolean;

  @Input() duration: number;

  @Input() isDebug: boolean;

  @Output() enterClick: EventEmitter<void> = new EventEmitter<void>();

  @Output() capsClick: EventEmitter<void> = new EventEmitter<void>();

  @Output() altClick: EventEmitter<void> = new EventEmitter<void>();

  @Output() shiftClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(private _elementRef: ElementRef,
              private _keyboardService: MatKeyboardService,
              @Optional() @Self() private _control?: NgControl) {}

  ngOnDestroy() {
    this._hideKeyboard();
  }

  @HostListener('focus', ['$event'])
  private _showKeyboard() {
    if (this.matKeyboard && !this.keyboardVisible) {
        this.keyboardVisible = true;
        const _this = this;
        this._keyboardRef = this._keyboardService.open(this.matKeyboard, {
            darkTheme: this.darkTheme,
            duration: this.duration,
            isDebug: this.isDebug
        });
        this._keyboardRef.instance.setInputInstance(this._elementRef);
        if (this._control) {
            this._keyboardRef.instance.attachControl(this._control.control);
        }
        this._keyboardRef.instance.enterClick.subscribe(function () { return _this.enterClick.next(); });
        this._keyboardRef.instance.capsClick.subscribe(function () { return _this.capsClick.next(); });
        this._keyboardRef.instance.altClick.subscribe(function () { return _this.altClick.next(); });
        this._keyboardRef.instance.shiftClick.subscribe(function () { return _this.shiftClick.next(); });
    } else if (!this.matKeyboard) {
        this.keyboardVisible = false;
        if (this._keyboardRef) {
            this._keyboardRef.dismiss();
        }
    }
  }

  private _hideKeyboard() {
    if (this._keyboardRef) {
      this._keyboardRef.dismiss();
    }
  }

}
