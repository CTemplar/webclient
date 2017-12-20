// Agular
import { Component, OnDestroy, OnInit } from '@angular/core';

// Models
import { Message } from './shared/mail';

// Services
import { MailService } from './shared/mail.service';
import { SharedService } from '../shared/shared.service';
import { UsersService } from '../users/shared/users.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnDestroy, OnInit {
  message = new Message;
  composing = true;
  minimize = false;

  constructor(
    private mailService: MailService,
    private sharedService: SharedService,
    private usersService: UsersService,
  ) {
  }

  save() {
    this.message.outgoing = false;
    this.mailService.postMessage(this.message)
      .subscribe(data => {
      }, error => {
        console.log('ERROR SAVING');
      });
  }

  send() {
    this.message.outgoing = true;
    this.mailService.postMessage(this.message)
      .subscribe(data => {
        this.mailService.composing.emit(false);
      }, error => {
        console.log('ERROR SENDING');
      });

  }

  ngOnDestroy() {
    this.sharedService.isMail.emit(false);
  }

  ngOnInit() {
    this.sharedService.isMail.emit(true);

    this.mailService.composing
      .subscribe(data => this.composing = data);
  }
}
