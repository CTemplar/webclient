// Angular
import { Component } from '@angular/core';

// Semantic UI
import { SuiModal, ComponentModalConfig } from 'ng2-semantic-ui';

@Component({
  selector: 'app-mail-settings-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent {
  constructor(
    public modal: SuiModal<void>,
  ) {}

  // Selects
  paymentType = 'credit card';
  month = '01';
  day = '2018';
}

export class PaymentMethodModal extends ComponentModalConfig<void> {
  constructor() {
    super(PaymentMethodComponent);
    this.isClosable = true;
    this.size = 'mini';
  }
}
