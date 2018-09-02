import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { Mail } from '../../store/models';
import { DateTimeUtilService } from '../../store/services/datetime-util.service';

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
  @Output() expired: EventEmitter<boolean> = new EventEmitter<boolean>();

  expiryDurationInSeconds: number;

  constructor(private dateTimeUtilService: DateTimeUtilService) {
  }

  ngOnInit() {
    this.expiryDurationInSeconds = this.dateTimeUtilService.getDiffFromCurrentDateTimeInSeconds(this.message.encryption.expires);
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
