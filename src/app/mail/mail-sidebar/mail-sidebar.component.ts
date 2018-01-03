import { Component, OnInit } from '@angular/core';

// Services
import { MailService } from '../shared/mail.service';

@Component({
  selector: 'app-mail-sidebar',
  templateUrl: './mail-sidebar.component.html',
  styleUrls: ['./mail-sidebar.component.scss']
})
export class MailSidebarComponent implements OnInit {

  constructor(
    private mailService: MailService,
  ) { }

  countUnread() {
    return this.mailService.inbox.filter((message) => !message.read).length;
  }

  ngOnInit() {
    this.mailService.refresh();
  }

}
