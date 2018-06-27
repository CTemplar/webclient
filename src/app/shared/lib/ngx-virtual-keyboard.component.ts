import { Input, ViewEncapsulation, ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { specialKeyboard, keyboardCapsLockLayout, KeyboardLayout, isSpecial } from './layouts';
import { NgxVirtualKeyboardService } from './ngx-virtual-keyboard.service';
import { KeyPressInterface } from './key-press.interface';

@Component({
  selector: 'virtual-keyboard',
  template: `
      <div class="ngx-virtual-keyboard" [ngClass]="{'ngx-virtual-keyboard-special': special}">
          <div class="ngx-virtual-keyboard-container">
              <div class="container">
                  <div class="row">
                      <div class="col d-flex justify-content-end" [ngClass]="getColSize()">
                          <button class="btn btn-primary btn-link ml-auto" (click)="close();">&#9587;</button>
                      </div>
                  </div>

                  <div class="row text-center" *ngFor="let row of layout; let i = index" [attr.data-index]="i" [ngClass]="getColSize()">
                      <virtual-keyboard-key class="ngx-virtual-keyboard-key col" *ngFor="let key of row; let j = index" [key]="key"
                                            [disabled]="disabled" [attr.data-index]="j" (keyPress)="keyPress($event)">
                      </virtual-keyboard-key>
                  </div>
              </div>
          </div>
      </div>
  `,
  styles: [`
      .ngx-virtual-keyboard {
          position: fixed;
          bottom: 0;
          width: 100%;
          min-height: 30vh;
          padding: 1rem;
          background: #1A1A1A;
          z-index: 3;
      }

      .ngx-virtual-keyboard .ngx-virtual-keyboard-key {
          padding: .45rem;
      }

      .ngx-virtual-keyboard .btn-link {
          cursor: pointer;
          color: white;
          text-decoration: none;
          box-shadow: none;
          border: none;
      }

      .ngx-virtual-keyboard .ngx-virtual-keyboard-button {
          cursor: pointer;
          min-width: 25%;
          min-height: 25%;
          padding: 0;
          margin: 0;
          font-size: 1.4rem;
          line-height: 3rem;
          background: #5f5f5f;
          border: 0;
          border-radius: 0.3rem;
          box-shadow: none;
          font-transform: initial;
      }

      .ngx-virtual-keyboard .ngx-virtual-keyboard-button:focus,
      .ngx-virtual-keyboard .ngx-virtual-keyboard-button.isGrey:focus {
          background: #0082c4;
      }

      .ngx-virtual-keyboard .ngx-virtual-keyboard-button.isSpacer {
          background: transparent;
      }

      .ngx-virtual-keyboard .ngx-virtual-keyboard-button.isGrey {
          background: #3A3A3A;
      }

      .ngx-virtual-keyboard .ngx-virtual-keyboard-button.isSpaceBar {
          min-width: 600px;
      }

      .ngx-virtual-keyboard.ngx-virtual-keyboard-special .ngx-virtual-keyboard-button.isSpaceBar {
          min-width: 450px;
      }

      .ngx-virtual-keyboard .ngx-virtual-keyboard-button.isShift {
          background: #0082c4;
      }
  `],
  host: {
    '(document:click)': 'onClick($event)',
  },
  encapsulation: ViewEncapsulation.None
})

export class NgxVirtualKeyboardComponent {
  public disabled: boolean;
  public type: string;
  public location: Element;
  public inputElement: ElementRef;
  public layout: KeyboardLayout;
  public temp: KeyboardLayout;
  public maxLength: number | string;
  private capsLock: boolean = false;
  private scrollPosition: number = 0;
  private caretPosition: number;
  private shift: boolean = true;
  public special: boolean;

  public layoutSubscription: any;
  public shiftSubscription: any;
  public capsLockSubscription: any;
  public caretPositionSubscription: any;
  public disabledSubscription: any;
  public specialSubscription: any;

  constructor(
    private _vk: NgxVirtualKeyboardService,
    private _ref: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.scrollPosition = window.pageYOffset;

    this.layoutSubscription = this._vk.layout$.subscribe((layout: any) => {
      this.layout = layout;
    });

    this.shiftSubscription = this._vk.shift$.subscribe((isShift: boolean) => {
      this.shift = isShift;
    });

    this.capsLockSubscription = this._vk.capsLock$.subscribe((isCapsLock: boolean) => {
      this.layout = keyboardCapsLockLayout(this.layout, isCapsLock);
      this._ref.detectChanges();
    });

    this.caretPositionSubscription = this._vk.caretPosition$.subscribe((caretPosition: number) => {
      this.caretPosition = caretPosition;
    });

    this.disabledSubscription = this._vk.disabled$.subscribe((isDisabled: boolean) => {
      this.disabled = isDisabled;
      this._ref.detectChanges();
    });

    this.specialSubscription = this._vk.special$.subscribe((isSpecial: boolean) => {
      this.special = isSpecial;
      this.updateLayout();
    });

    this.checkDisabled();
  }

  ngAfterContentInit() {
    this._vk.setShift(this.shift);
  }

  ngOnDestroy(): void {
    this._vk.reset();
  }

  public close(): void {
    if (!this.inputElement.nativeElement.id.includes('noSpan')) {
      console.log(this.inputElement.nativeElement);
      this.inputElement.nativeElement.id += 'noSpan';
    }
    if (this.location.querySelector('virtual-keyboard')) {
      this.location.querySelector('virtual-keyboard').remove();
    }
    const body = document.getElementsByTagName('body')[0];
    body.style.paddingBottom = '0px';
    this._vk.reset();
    this.layoutSubscription.unsubscribe();
    this.shiftSubscription.unsubscribe();
    this.capsLockSubscription.unsubscribe();
    this.caretPositionSubscription.unsubscribe();
    this.disabledSubscription.unsubscribe();
    this.specialSubscription.unsubscribe();

    setTimeout(() => {
      window.scrollTo(0, this.scrollPosition);
    });
  }

  public getColSize() {

    if (this.type === 'numeric' || this.type === 'phone') {
      return 'col-6 m-auto';
    }

    return;
  }

  public keyPress(event: KeyPressInterface): void {
    this.caretPosition = this.inputElement.nativeElement.selectionStart;
    if (event.special) {
      this.handleSpecialKey(event);
    } else {
      this.handleNormalKey(event.keyValue);
      this.dispatchEvents(event);

      // Toggle shift if it's activated
      if (this.shift) {
        this._vk.toggleShift();
      }
    }

    this.inputElement.nativeElement.focus();
    this.checkDisabled();
  }

  private handleSpecialKey(event: KeyPressInterface): void {

    switch (event.keyValue) {
      case 'Enter':
        setTimeout(() => {
          this.close();
          this.inputElement.nativeElement.blur();
        });
        break;
      case 'Escape':
        setTimeout(() => {
          this.close();
        });
        break;
      case 'Left':
        this.cursorPosition(true);
        break;
      case 'Right':
        this.cursorPosition(false);
        break;
      case 'Backspace':
        const currentValue = this.inputElement.nativeElement.value;
        const size = currentValue.length;

        if (this.caretPosition > 0) {
          const start = currentValue.slice(0, this.caretPosition - 1);
          const end = currentValue.slice(this.caretPosition);
          this._vk.setCaretPosition(this.caretPosition - 1);
          this.inputElement.nativeElement.value = `${start}${end}`;
          this.inputElement.nativeElement.selectionStart = this.caretPosition;
          this.inputElement.nativeElement.selectionEnd = this.caretPosition;
        }

        break;
      case 'CapsLock':
        this._vk.toggleCapsLock();
        break;
      case 'Shift':
        this._vk.toggleShift();
        break;
      case 'Special':
      case 'SpecialBack':
        this._vk.toggleSpecial();
        break;
      case 'SpaceBar':
        this.handleNormalKey(' ');
        break;
    }

    const eventInput = new Event('input');
    this.inputElement.nativeElement.dispatchEvent(eventInput);
  }

  private dispatchEvents(event: KeyPressInterface) {
    const eventInit: KeyboardEventInit = {
      bubbles: true,
      cancelable: true,
      shiftKey: this.shift,
      key: event.keyValue,
      code: `Key${event.keyValue.toUpperCase()}}`,
      location: 0
    };

    this.inputElement.nativeElement.dispatchEvent(new KeyboardEvent('keydown', eventInit));
    this.inputElement.nativeElement.dispatchEvent(new KeyboardEvent('keypress', eventInit));
    this.inputElement.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
    this.inputElement.nativeElement.dispatchEvent(new KeyboardEvent('keyup', eventInit));
  }

  private checkDisabled(): void {
    const maxLength = this.inputElement.nativeElement.maxLength;
    const valueLength = this.inputElement.nativeElement.value.length;

    this.disabled = maxLength > 0 && valueLength >= maxLength;
  }

  private handleNormalKey(keyValue: string): void {
    let value = '';

    value = [
      this.inputElement.nativeElement.value.slice(0, this.caretPosition),
      keyValue,
      this.inputElement.nativeElement.value.slice(this.caretPosition)
    ].join('');

    this.caretPosition++;
    this.inputElement.nativeElement.value = value;
    this.inputElement.nativeElement.selectionStart = this.caretPosition;
    this.inputElement.nativeElement.selectionEnd = this.caretPosition;
  }

  private cursorPosition(isLeft: boolean) {
    this.caretPosition = this.inputElement.nativeElement.selectionStart;
    const size = this.inputElement.nativeElement.value.length;
    if (isLeft && this.caretPosition > 0) {
      this.caretPosition--;
    } else if (!isLeft && this.caretPosition !== size) {
      this.caretPosition++;
    }

    this._vk.setCaretPosition(this.caretPosition);
    this.inputElement.nativeElement.selectionStart = this.caretPosition;
    this.inputElement.nativeElement.selectionEnd = this.caretPosition;
  }

  private updateLayout() {
    if (this.special && (this.type === 'extended' || typeof this.type === 'object')) {
      this._vk.setLayout(specialKeyboard);
    } else {
      this._vk.setLayout(this.temp);
    }

    this._ref.detectChanges();
  }

  private onClick(e) {
    const vk: any = document.getElementsByClassName('ngx-virtual-keyboard')[0];
    const pos = e.pageY - window.pageYOffset;
    if (vk && pos < vk.offsetTop && e.target.tagName !== 'INPUT') {
      this.close();
    }
  }

}
