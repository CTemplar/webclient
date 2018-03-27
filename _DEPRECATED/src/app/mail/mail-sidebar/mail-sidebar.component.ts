import { Component, OnInit } from '@angular/core';

// Modals
import { AddFolderModal } from './modals/add-folder/add-folder.component';
import { AddLabelModal } from './modals/add-label/add-label.component';

// Services
import { MailService } from '../shared/mail.service';
import { SuiModalService } from 'ng2-semantic-ui';

@Component({
  selector: 'app-mail-sidebar',
  templateUrl: './mail-sidebar.component.html',
  styleUrls: ['./mail-sidebar.component.scss']
})
export class MailSidebarComponent implements OnInit {

  constructor(
    public modalService: SuiModalService,
    public mailService: MailService,
  ) { }

  addFolder() {
    this.modalService.open(new AddFolderModal());
  }

  addLabel() {
    this.modalService.open(new AddLabelModal());
  }

  countUnread() {
    return this.mailService.inbox.filter((message) => !message.read).length;
  }

  ngOnInit() {
    this.mailService.refresh();
  }

}
