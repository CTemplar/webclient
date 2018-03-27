// Angular
import { Component } from '@angular/core';

// Semantic UI
import { SuiModal, ComponentModalConfig } from 'ng2-semantic-ui';

@Component({
  selector: 'app-mail-settings-make-a-donation',
  templateUrl: './make-a-donation.component.html',
  styleUrls: ['./make-a-donation.component.scss']
})
export class MakeADonationComponent {
  constructor(
    public modal: SuiModal<void>,
  ) {}

  // Selects
  amount = '10$';
  month = '01';
  day = '2018';
}

export class MakeADonationModal extends ComponentModalConfig<void> {
  constructor() {
    super(MakeADonationComponent);
    this.isClosable = true;
    this.size = 'mini';
  }
}
