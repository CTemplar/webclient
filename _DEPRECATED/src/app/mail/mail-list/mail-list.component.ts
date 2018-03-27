// Angular
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

// Models
import { Message } from '../shared/mail';

// Services
import { MailService } from '../shared/mail.service';

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit {
  folder: string;
  limit = 50;
  messages: Message[];
  page: number;
  page_max: number;
  selected: Message[] = [];

  constructor(
    public mailService: MailService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  button(folder: string) {
    if (folder !== this.folder && this.folder !== 'sent' && this.folder !== 'draft') {
      return true;
    }
    return false;
  }

  checkbox(messages: Message[] = []) {
    if (messages.length === 1) {
      const message = messages[0];
      if (this.selected.includes(message)) {
        this.selected.splice(this.selected.indexOf(message), 1);
      } else {
        this.selected.push(message);
      }
    } else {
      this.selected = messages;
    }
  }

  load(status: boolean = true) {
    if (status) {
      this.selected = [];
      this.messages = this.mailService.list(this.folder, this.page, this.limit);
      this.page_max = Math.ceil(this.mailService.folder(this.folder).length / this.limit);
      this.mailService.reload.emit(false);
    }
  }
  onMailClick(message: Message) {
    if (message.folder === 'draft') {
      this.mailService.composing.emit(message);
    } else {
      this.router.navigate(['/mail', 'message', message.id]);
    }
  }
  ngOnInit() {
    this.route.params
      .subscribe(params => {
        this.folder = params['folder'];
        this.page = +params['page'];
        this.load();
      });

    this.mailService.reload
      .subscribe(status => this.load(status));
  }
}
