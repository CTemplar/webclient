// Angular
import { Component } from '@angular/core';

// Semantic UI
import { SuiModal, ComponentModalConfig } from 'ng2-semantic-ui';

@Component({
  selector: 'app-mail-sidebar-add-label',
  templateUrl: './add-label.component.html',
  styleUrls: ['./add-label.component.scss']
})
export class AddLabelComponent {
  constructor(
    public modal: SuiModal<void>,
  ) {}
}

export class AddLabelModal extends ComponentModalConfig<void> {
  constructor() {
    super(AddLabelComponent);
    this.isClosable = true;
    this.size = 'mini';
  }
}
