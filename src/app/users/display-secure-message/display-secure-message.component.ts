import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Mail } from '../../store/models';
import { DateTimeUtilService } from '../../store/services/datetime-util.service';

@Component({
  selector: 'app-display-secure-message',
  templateUrl: './display-secure-message.component.html',
  styleUrls: ['./display-secure-message.component.scss']
})
export class DisplaySecureMessageComponent implements OnInit, OnDestroy {

  @Input() message: Mail;
  @Input() decryptedContent: string;
  @Input() decryptedSubject: string;

  @Output() reply: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() expired: EventEmitter<boolean> = new EventEmitter<boolean>();

  expiryDurationInSeconds: number;

  constructor(private dateTimeUtilService: DateTimeUtilService) {
  }

  ngOnInit() {
    this.expiryDurationInSeconds = this.dateTimeUtilService.getDiffFromCurrentDateTime(this.message.encryption.expires, 'seconds');
  }

  ngOnDestroy() {
  }

  onExpired() {
    this.expired.emit(true);
  }

  onReply() {
    this.reply.emit(true);
  }
}
