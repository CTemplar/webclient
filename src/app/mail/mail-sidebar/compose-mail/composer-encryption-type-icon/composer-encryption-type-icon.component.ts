import { Component, Input, OnInit } from '@angular/core';
import {
  AutocryptPreferEncryptType,
  ComposerEncryptionType,
  GlobalPublicKey,
  PGPEncryptionType,
} from '../../../../store/datatypes';
import { Mailbox } from '../../../../store/models';

@Component({
  selector: 'app-composer-encryption-type-icon',
  templateUrl: './composer-encryption-type-icon.component.html',
  styleUrls: ['./composer-encryption-type-icon.component.scss'],
})
export class ComposerEncryptionTypeIconComponent implements OnInit {
  @Input() usersKeys: Map<string, GlobalPublicKey>;

  @Input() addedItem: any;

  /**
   * Decide whether icon should be based on usersKeys parameter from parent,
   * If true, will parsing usersKeys parameter for getting which icon should be showed
   * If false, just would take passedEncryptionType parameter
   */
  @Input() basedOnUsersKeys = true;

  @Input() passedEncryptionType: ComposerEncryptionType;

  @Input() selectedMailbox: Mailbox;

  encryptionType: ComposerEncryptionType;

  constructor() {}

  ngOnInit(): void {
    if (!this.basedOnUsersKeys) {
      this.encryptionType = this.passedEncryptionType;
    }
  }

  ngDoCheck(): void {
    if (this.basedOnUsersKeys) {
      const keys = this.usersKeys.get(this.addedItem.email);
      if (!keys.isFetching) {
        if (this.selectedMailbox.is_autocrypt_enabled && keys.autocryptPreferEncrypt) {
          // Autocrypt
          this.encryptionType =
            keys.autocryptPreferEncrypt === AutocryptPreferEncryptType.MUTUAL
              ? ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT_AND_MUTUAL
              : ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT;
        } else if (
          keys.pgpEncryptionType === PGPEncryptionType.PGP_INLINE ||
          keys.pgpEncryptionType === PGPEncryptionType.PGP_MIME
        ) {
          // PGPEncryption
          this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_PGP_MIME_INLINE;
        } else if (keys.key.length > 0) {
          if (keys.key[0].exists === false) {
            // Non Encrypted - External
            this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_NONE;
          } else {
            // CTemplar - Internal
            this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_END_TO_END;
          }
        }
      }
    }
  }
}
