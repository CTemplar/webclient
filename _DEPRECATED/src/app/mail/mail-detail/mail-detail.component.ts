// Angular
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

// Models
import { Message } from '../shared/mail';

// Services
import { MailService } from '../shared/mail.service';

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////



@Component({
  selector: 'app-mail-detail',
  templateUrl: './mail-detail.component.html',
  styleUrls: ['./mail-detail.component.scss']
})
export class MailDetailComponent implements OnInit {
  message: Message;
  message_index: number;
  message_current: number;
  message_end: number;
  message_prev: number;
  message_next: number;

  constructor(
    public mailService: MailService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.message = this.mailService.detail(+params['id']);
        let messages = this.mailService.folder(this.message.folder);
        this.message_index = messages.indexOf(this.message);
        this.message_current = this.message_index + 1;
        this.message_end = messages.length;
        this.message_prev = (this.message_current > 1) ? messages[this.message_index - 1].id : undefined;
        this.message_next = (this.message_current < this.message_end) ? messages[this.message_index + 1].id : undefined;
      });
  }
}
