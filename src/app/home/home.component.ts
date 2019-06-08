// Angular
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Mode } from '../store/models';
// Store
// Rxjs
// Actions
// Services

interface ModeInterface {
  Recent: number;
  Related: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewChecked {
  mode: Mode;
  viewChecked: boolean = false;
  modeObj: ModeInterface = {
    Recent: 0,
    Related: 1
  };

  constructor() {}

  ngOnInit() {
  }

  ngOnDestroy() {}

  ngAfterViewChecked() {
    this.viewChecked = true;
  }
}
