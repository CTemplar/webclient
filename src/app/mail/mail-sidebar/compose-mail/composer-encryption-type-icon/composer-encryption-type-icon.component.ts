import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { GlobalPublicKey, PGPEncryptionType } from '../../../../store/datatypes';

enum ComposerEncryptionType {
  RECEIVER_PGP_MIME_INLINE = 'RECEIVER_PGP_MIME_INLINE',
  RECEIVER_END_TO_END = 'RECEIVER_END_TO_END',
  RECEIVER_NONE = 'RECEIVER_NONE',
}

@Component({
  selector: 'app-composer-encryption-type-icon',
  templateUrl: './composer-encryption-type-icon.component.html',
  styleUrls: ['./composer-encryption-type-icon.component.scss'],
})
export class ComposerEncryptionTypeIconComponent implements OnInit {
  @Input() usersKeys: Map<string, GlobalPublicKey>;

  @Input() addedItem: any;

  encryptionType: ComposerEncryptionType;

  constructor() {}

  ngOnInit(): void {}

  ngDoCheck(): void {
    const keys = this.usersKeys.get(this.addedItem.email);
    if (!keys.isFetching) {
      if (keys.pgpEncryptionType === PGPEncryptionType.PGP_INLINE || keys.pgpEncryptionType === PGPEncryptionType.PGP_MIME) {
        this.encryptionType = ComposerEncryptionType.RECEIVER_PGP_MIME_INLINE;
      } else if (keys.key.length > 0) {
        if (keys.key[0].exists === false) {
          this.encryptionType = ComposerEncryptionType.RECEIVER_NONE;
        } else {
          this.encryptionType = ComposerEncryptionType.RECEIVER_END_TO_END;
        }
      }
    }
  }
}
