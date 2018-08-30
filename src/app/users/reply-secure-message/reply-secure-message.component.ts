import { Component, Input, OnInit } from '@angular/core';
import { Mail } from '../../store/models';

@Component({
  selector: 'app-reply-secure-message',
  templateUrl: './reply-secure-message.component.html',
  styleUrls: ['./reply-secure-message.component.scss']
})
export class ReplySecureMessageComponent implements OnInit {
  @Input() sourceMessage: Mail;

  constructor() {
  }

  ngOnInit() {
  }

}
