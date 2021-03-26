import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() showSpinner: boolean;

  @Input() optionalClasses = '';

  // Width and Height in Pixel unit
  @Input() width: number = 40;
  @Input() height: number = 40;
  @Input() color: string = '#3a4e63';

  constructor() {}

  ngOnInit() {}
}
