// Angular
import { Component } from '@angular/core';

// Semantic UI
import { SuiModal, ComponentModalConfig } from 'ng2-semantic-ui';

@Component({
  selector: 'app-mail-settings-whitelist',
  templateUrl: './whitelist.component.html',
  styleUrls: ['./whitelist.component.scss']
})
export class WhitelistComponent {
  constructor(
    public modal: SuiModal<void>,
  ) {}
}

export class WhitelistModal extends ComponentModalConfig<void> {
  constructor() {
    super(WhitelistComponent);
    this.isClosable = true;
    this.size = 'mini';
  }
}
