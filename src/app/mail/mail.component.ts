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

  save(isOutgoing) {
      this.message.outgoing = isOutgoing;
      const successHandler = data => {
        this.mailService.composing.emit(!isOutgoing);
        this.message.processed = 'just now';
      };
      const errorHandler = error => console.log(`ERROR ${isOutgoing ? 'SENDING' : 'SAVING'}`);
      if (isOutgoing && this.message.to_header || !isOutgoing) {
        if (!this.message.id) {
            this.mailService.postMessage(this.message).subscribe(successHandler, errorHandler);
        } else {
          delete this.message.processed;
          this.mailService.patchMessage(this.message.id, this.message).subscribe(successHandler, errorHandler);
        }
      } else {
        console.log('Please Input Email');
      }
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
  ngOnDestroy() {
    this.sharedService.isMail.emit(false);
  }
}
