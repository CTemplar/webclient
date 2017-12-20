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
    public mailService: MailService,
  ) { }

  ngOnInit() {
  }

}
