import { Component, OnInit, Output, EventEmitter } from '@angular/core';

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

  @Output() keyPressed = new EventEmitter();
  keyPressEvent(key: string) { // You can give any function name
    this.inputString = key;
    this.keyPressed.emit(this.inputString);
  }

  constructor() {}
  ngOnInit() {

  }
}
