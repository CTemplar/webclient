// Angular
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Mode } from '../store/models';
// Store
// Rxjs
import { Observable } from 'rxjs';
// Actions
// Services
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';

interface ModeInterface {
  Recent: number;
  Related: number;
}

@TakeUntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewChecked {
  readonly destroyed$: Observable<boolean>;

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
