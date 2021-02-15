import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { FilenamePipe } from '../../shared/pipes/filename.pipe';
import { SnackErrorPush } from '../../store/actions';
import { AppState } from '../../store/datatypes';
import { Attachment, Mail } from '../../store/models';
import { MailService, OpenPgpService, SharedService } from '../../store/services';
import { DateTimeUtilService } from '../../store/services/datetime-util.service';

@Component({
  selector: 'app-display-secure-message',
  templateUrl: './display-secure-message.component.html',
  styleUrls: ['./display-secure-message.component.scss'],
})
export class DisplaySecureMessageComponent implements OnInit, OnDestroy {
  @Input() message: Mail;

  @Input() decryptedContent: string;

  @Input() decryptedSubject: string;

  @Input() decryptedKey: any;

  @Input() hash: any;

  @Input() secret: any;

  @Input() password: string;

  @Output() reply: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() expired: EventEmitter<boolean> = new EventEmitter<boolean>();

  expiryDurationInSeconds: number;

  decryptedAttachments: any = {};

  constructor(
    private dateTimeUtilService: DateTimeUtilService,
    private store: Store<AppState>,
    private mailService: MailService,
    private shareService: SharedService,
    private pgpService: OpenPgpService,
  ) {}

  ngOnInit() {
    this.expiryDurationInSeconds = this.dateTimeUtilService.getDiffFromCurrentDateTime(
      this.message.encryption.expires,
      'seconds',
    );
  }

  ngOnDestroy() {}

  onExpired() {
    this.expired.emit(true);
  }

  onReply() {
    this.reply.emit(true);
  }

  // TODO: Merge with mail-detail and compose-mail components
  decryptAttachment(attachment: Attachment) {
    if (this.decryptedAttachments[attachment.id]) {
      if (!this.decryptedAttachments[attachment.id].inProgress) {
        this.downloadAttachment(this.decryptedAttachments[attachment.id]);
      }
    } else {
      this.decryptedAttachments[attachment.id] = { ...attachment, inProgress: true };
      this.mailService.getSecureMessageAttachment(attachment, this.hash, this.secret).subscribe(
        response => {
          if (!attachment.name) {
            attachment.name = FilenamePipe.tranformToFilename(attachment.document);
          }
          const fileInfo = { attachment, type: response.file_type };
          this.pgpService
            .decryptAttachmentWithOnlyPassword(response.data, fileInfo, this.password)
            .pipe(take(1))
            .subscribe(
              (decryptedAttachment: Attachment) => {
                this.decryptedAttachments[attachment.id] = { ...decryptedAttachment, inProgress: false };
                this.downloadAttachment(decryptedAttachment);
              },
              error => console.log(error),
            );
        },
        errorResponse =>
          this.store.dispatch(
            new SnackErrorPush({
              message: errorResponse.error || 'Failed to download attachment.',
            }),
          ),
      );
    }
  }

  downloadAttachment(attachment: Attachment) {
    this.shareService.downloadFile(attachment.decryptedDocument);
  }
}
