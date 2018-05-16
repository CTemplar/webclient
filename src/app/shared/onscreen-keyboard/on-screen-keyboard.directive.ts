import {
  Directive,
  ElementRef,
  Renderer,
  HostListener,
  OnInit
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
export class OnScreenKeyboardDirective implements OnInit {
  private el: HTMLInputElement;
  private keyPressedID: string;
  getState$: Observable<any>;
  private lastFocusedInput: HTMLInputElement;

  constructor(private store: Store<any>, private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
    this.getState$ = this.store.select(selectKeyboardState);

    this.getState$.subscribe((state: KeyboardState) => {
      if (state.focusedInput === this.el.id) {
        this.el.value += state.keyPressed.key;
      }
    });
  }
  ngOnInit() {}
  @HostListener('click', ['$event'])
  clickEvent(event) {
    this.store.dispatch(new KeyPressed({key: ''}));

    event.preventDefault();
    event.stopPropagation();
    if (this.el.tagName === 'SPAN') {
      this.store.dispatch(new KeyboardFocus({}));
    }
  }

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
    }
  }
}
