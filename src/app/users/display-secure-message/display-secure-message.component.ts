import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { Mail } from '../../store/models';

@TakeUntilDestroy()
@Component({
  selector: 'app-display-secure-message',
  templateUrl: './display-secure-message.component.html',
  styleUrls: ['./display-secure-message.component.scss']
})
export class DisplaySecureMessageComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  @Input() message: Mail;
  @Input() decryptedContent: string;

  @Output() reply: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  onReply() {
    this.reply.emit(true);
  }
}
