import {
  Directive,
  ElementRef,
  Renderer,
  HostListener,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  KeyboardFocus,
  KeyboardFocusOut,
  FocusedInputID,
  KeyPressed
} from '../../store/actions';
// Store
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { selectKeyboardState } from '../../store/selectors';
import { KeyboardState } from '../../store/datatypes';


@Directive({
  selector: '[appOnScreenKeyboard]'
})
export class OnScreenKeyboardDirective implements OnInit, OnDestroy {
  private el: HTMLInputElement;
  private keyPressedID: string;
  getState$: Observable<any>;
  private lastFocusedInput: HTMLInputElement;
  private selectionStart: number ;
  constructor(private store: Store<any>, private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
    this.getState$ = this.store.select(selectKeyboardState);

    this.getState$.subscribe((state: KeyboardState) => {
      if (state.focusedInput === this.el.id) {
        this.el.focus();
        setTimeout(() => {
          this.el.selectionStart = this.selectionStart;
          this.el.selectionEnd = this.selectionStart;
        });
        if (state.keyPressed.key) {
          switch (state.keyPressed.key) {
            case '⌫':
              this.el.value = this.el.value.slice(0, -1);
              this.selectionStart = this.el.selectionStart ;
              break;
            default:
              this.selectionStart = this.el.selectionStart + 1;
              // tslint:disable-next-line:max-line-length
              this.el.value = this.el.value.slice(0, this.el.selectionStart) + state.keyPressed.key + this.el.value.slice(this.el.selectionEnd);
          }
        }
      }
    });
  }
  ngOnInit() {}

  @HostListener('focus', ['$event'])
  focusEvent(event) {
    this.store.dispatch(new KeyPressed({key: ''}));

    event.preventDefault();
    event.stopPropagation();
    // this.store.dispatch(new KeyboardFocus({}));
    if (this.el.tagName === 'INPUT') {
      this.lastFocusedInput = this.el;
      this.keyPressedID = this.elementRef.nativeElement.id;
      this.store.dispatch(new FocusedInputID(this.keyPressedID));
      this.selectionStart = this.el.selectionStart ;
      console.log(this.el.selectionStart);
    }
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    this.store.dispatch(new KeyPressed({ key: '' }));

    event.preventDefault();
    event.stopPropagation();
    if (this.el.tagName === 'SPAN') {
      this.store.dispatch(new KeyboardFocus({}));
    } else {
      console.log(this.el.selectionStart);

      this.selectionStart = this.el.selectionStart;
    }
  }

  ngOnDestroy() {
    this.store.dispatch(new KeyboardFocus({keyboard: false}));
  }
}
