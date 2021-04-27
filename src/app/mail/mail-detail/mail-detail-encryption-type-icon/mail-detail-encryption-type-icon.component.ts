import { Component, Input, OnInit } from '@angular/core';

import { Mail } from '../../../store/models';
import { EncryptionType } from '../../../store/datatypes';

@Component({
  selector: 'app-mail-detail-encryption-type-icon',
  templateUrl: './mail-detail-encryption-type-icon.component.html',
  styleUrls: ['./mail-detail-encryption-type-icon.component.scss'],
})
export class MailDetailEncryptionTypeIconComponent implements OnInit {
  @Input() mail: Mail;

  encryptionType?: EncryptionType;

  lastAction?: string;

  // eslint-disable-next-line class-methods-use-this
  ngOnInit(): void {
    if (this.mail) {
      this.lastAction = this.mail.last_action;
      if (this.mail.encryption && this.mail.encryption.password_hint) {
        this.encryptionType = EncryptionType.PGP_PASSWORD;
      } else if (this.mail.encryption_type) {
        this.encryptionType = EncryptionType.PGP_MIME_INLINE;
      } else {
        this.encryptionType = EncryptionType.PGP_END_TO_END;
      }
    }
  }
}
