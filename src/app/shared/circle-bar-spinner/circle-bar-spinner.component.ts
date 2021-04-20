import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-circle-bar-spinner',
  templateUrl: './circle-bar-spinner.component.html',
  styleUrls: ['./circle-bar-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CircleBarSpinnerComponent {
  @Input() showSpinner: boolean;
  @Input() color = '#333333';
  constructor() {}
}
