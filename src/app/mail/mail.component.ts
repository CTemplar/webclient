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
    if (!this.message.id) {
      this.mailService.postMessage(this.message)
        .subscribe(data => {
          this.mailService.composing.emit(false);
        }, error => {
          console.log('ERROR SAVING');
        });
    } else {
      delete this.message.processed;
      this.mailService.patchMessage(this.message.id, this.message)
        .subscribe(data => {
          this.mailService.composing.emit(false);
        }, error => {
          console.log('ERROR UPDATING');
        });
    }
  }

  send() {
    this.message.outgoing = true;
    if (this.message.id) {
      delete this.message.processed;
    }

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
      .subscribe(data => {
        if (data) {
          if (typeof data === 'object') {
            this.message = data;
          } else {
            this.message = new Message;
          }
          this.composing = true;
        } else {
          this.composing = false;
        }
      });
  }
}
