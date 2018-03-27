// Angular
import { Component } from '@angular/core';

// Semantic UI
import { SuiModal, ComponentModalConfig } from 'ng2-semantic-ui';

@Component({
  selector: 'app-mail-settings-blacklist',
  templateUrl: './blacklist.component.html',
  styleUrls: ['./blacklist.component.scss']
})
export class BlacklistComponent {
  constructor(
    public modal: SuiModal<void>,
  ) {}
}

export class BlacklistModal extends ComponentModalConfig<void> {
  constructor() {
    super(BlacklistComponent);
    this.isClosable = true;
    this.size = 'mini';
  }
}
