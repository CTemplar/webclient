import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-circle-bar-spinner',
  templateUrl: './circle-bar-spinner.component.html',
  styleUrls: ['./circle-bar-spinner.component.scss'],
})
export class CircleBarSpinnerComponent {
  @Input() showSpinner: boolean;
  @Input() color: string = '#333333';
  constructor() {}
}
