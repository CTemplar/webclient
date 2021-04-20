import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentOptionsComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
