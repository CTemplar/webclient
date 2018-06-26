import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KeyPressInterface } from './key-press.interface';
import {
  KeyboardLayout,
  isSpaceBar,
  isGrey,
  isSpacer,
  isSpecial,
  notDisabledSpecialKeys,
  specialKeyIcons,
  specialKeyTexts
} from './layouts';
import { NgxVirtualKeyboardService } from './ngx-virtual-keyboard.service';

@Component({
  selector: 'virtual-keyboard-key',
  template: `
      <button class="btn btn-primary btn-block ngx-virtual-keyboard-button"
              [ngClass]="{'isSpacer': isSpacer, 'isGrey': isGrey, 'isSpaceBar': isSpaceBar, 'isShift': shift && keyValue === 'Shift'}"
              [disabled]="checkDisabled()" (click)="onKeyPress()">
          <span *ngIf="!special">{{ keyValue }}</span>
          <span *ngIf="special"><span [innerHTML]="icon"></span>{{ text }}</span>
      </button>`
})

export class NgxVirtualKeyboardKeyComponent {
  @Input() disabled: boolean;
  @Input() key: string;
  @Output() keyPress = new EventEmitter<KeyPressInterface>();

  public special: boolean = false;
  public isSpacer: boolean = false;
  public isGrey: boolean = false;
  public isSpaceBar: boolean = false;
  public shift: boolean;
  public keyValue: string;
  public icon: string;
  public text: string;

  constructor(
    private _vk: NgxVirtualKeyboardService
  ) {
  }

  ngOnInit() {
    this._vk.shift$.subscribe((shift: boolean) => {
      this.shift = shift;
    });

    let multiplier = 1;
    let fix = 0;

    if (this.key.length > 1) {
      this.isSpacer = isSpacer(this.key);
      this.special = isSpecial(this.key);
      this.isGrey = isGrey(this.key);
      this.isSpaceBar = isSpaceBar(this.key);

      const matches = /^(\w+)(:(\d+(\.\d+)?))?$/g.exec(this.key);
      this.keyValue = matches[1];
    } else {
      this.keyValue = this.key;
    }

    if (this.special) {
      if (specialKeyIcons.hasOwnProperty(this.keyValue)) {
        this.icon = specialKeyIcons[this.keyValue];
      } else if (specialKeyTexts.hasOwnProperty(this.keyValue)) {
        this.text = specialKeyTexts[this.keyValue];
      }
    }

  }

  public checkDisabled(): boolean {
    if (this.isSpacer) {
      return true;
    } else if (this.disabled && notDisabledSpecialKeys.indexOf(this.keyValue) !== -1) {
      return false;
    } else {
      return this.disabled;
    }
  }

  public onKeyPress(): void {
    this.keyPress.emit({ special: this.special, keyValue: this.keyValue, key: this.key });
  }

}
