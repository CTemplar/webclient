// Angular
import { Component, OnInit } from '@angular/core';

// Services
import { MailService } from '../shared/mail.service';

@Component({
  selector: 'app-mail-settings',
  templateUrl: './mail-settings.component.html',
  styleUrls: ['./mail-settings.component.scss']
})
export class MailSettingsComponent implements OnInit {

  constructor(
    private mailService: MailService,
  ) {}

  ngOnInit() {
  }

}
