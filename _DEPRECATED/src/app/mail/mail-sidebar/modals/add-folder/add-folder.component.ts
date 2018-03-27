// Angular
import { Component } from '@angular/core';

// Semantic UI
import { SuiModal, ComponentModalConfig } from 'ng2-semantic-ui';

@Component({
  selector: 'app-mail-sidebar-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.scss']
})
export class AddFolderComponent {
  constructor(
    public modal: SuiModal<void>,
  ) {}
}

export class AddFolderModal extends ComponentModalConfig<void> {
  constructor() {
    super(AddFolderComponent);
    this.isClosable = true;
    this.size = 'mini';
  }
}
