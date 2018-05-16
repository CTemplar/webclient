import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { KeyboardState } from '../../store/datatypes';
import { selectKeyboardState } from '../../store/selectors';

// Action
import { KeyPressed } from '../../store/actions';
@Component({
  selector: 'app-onscreen-keyboard',
  templateUrl: './onscreen-keyboard.component.html',
  styleUrls: ['./onscreen-keyboard.component.scss']
})
export class OnscreenKeyboardComponent implements OnInit {
  inputString: string = '';
  keys1: any = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '⌫'];
  keys2: any = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  keys3: any = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  getState$: Observable<any>;
  showKeyboard: boolean;

  constructor(private store: Store<KeyboardState>) {
    this.getState$ = this.store.select(selectKeyboardState);
  }

  ngOnInit() {
    this.getState$.subscribe(state => {
      this.showKeyboard = state.keyboardFocused;
    });
  }

  keyPressEvent(key: string) {
    // You can give any function name
    this.inputString = key;
    this.store.dispatch(new KeyPressed({key}));
  }
}
