import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { GlobalPublicKey, PGPEncryptionType } from '../../../../store/datatypes';

enum ReceiverEncryptionType {
  RECEIVER_PGP_MIME_INLINE = 'RECEIVER_PGP_MIME_INLINE',
  RECEIVER_END_TO_END = 'RECEIVER_END_TO_END',
  RECEIVER_NONE = 'RECEIVER_NONE',
}

@Component({
  selector: 'app-composer-receiver-icon',
  templateUrl: './composer-receiver-icon.component.html',
  styleUrls: ['./composer-receiver-icon.component.scss'],
})
export class ComposerReceiverIconComponent implements OnInit {
  @Input() usersKeys: Map<string, GlobalPublicKey>;

  @Input() addedItem: any;

  encryptionType: ReceiverEncryptionType;

  constructor() {}

  ngOnInit(): void {}

  ngDoCheck(): void {
    const keys = this.usersKeys.get(this.addedItem.email);
    if (!keys.isFetching) {
      if (keys.pgpEncryptionType === PGPEncryptionType.PGP_INLINE || keys.pgpEncryptionType === PGPEncryptionType.PGP_MIME) {
        this.encryptionType = ReceiverEncryptionType.RECEIVER_PGP_MIME_INLINE;
      } else if (keys.key.length > 0) {
        if (keys.key[0].exists === false) {
          this.encryptionType = ReceiverEncryptionType.RECEIVER_NONE;
        } else {
          this.encryptionType = ReceiverEncryptionType.RECEIVER_END_TO_END;
        }
      }
    }
  }
}
