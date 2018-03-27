// Angular
import { Component } from '@angular/core';

// Semantic UI
import { SuiModal, ComponentModalConfig } from 'ng2-semantic-ui';

@Component({
  selector: 'app-mail-settings-custom-filter',
  templateUrl: './custom-filter.component.html',
  styleUrls: ['./custom-filter.component.scss']
})
export class CustomFilterComponent {
  constructor(
    public modal: SuiModal<void>,
  ) {}

  // Selects
  condition1 = 'If the subject';
  condition2 = 'Contains';
  moveTo = 'Inbox';
}

export class CustomFilterModal extends ComponentModalConfig<void> {
  constructor() {
    super(CustomFilterComponent);
    this.isClosable = true;
    this.size = 'mini';
  }
}
