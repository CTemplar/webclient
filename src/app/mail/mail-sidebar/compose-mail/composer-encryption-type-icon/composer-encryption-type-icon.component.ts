import { Component, Input, SimpleChanges } from '@angular/core';
import {
  AutocryptEncryptDetermine,
  AutocryptPreferEncryptType,
  ComposerEncryptionType,
  UIRecommendationValue,
} from '../../../../store/datatypes';

@Component({
  selector: 'app-composer-encryption-type-icon',
  templateUrl: './composer-encryption-type-icon.component.html',
  styleUrls: ['./composer-encryption-type-icon.component.scss'],
})
export class ComposerEncryptionTypeIconComponent {
  @Input() autocryptInfo: AutocryptEncryptDetermine;

  @Input() isAutocrypt: boolean;

  @Input() isAutocryptEncrypt: boolean;

  @Input() encryptionTypeMap: any;

  @Input() selectedEmail: string;

  encryptionType: ComposerEncryptionType;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isAutocrypt) {
      // Sender Icon
      if (this.autocryptInfo && this.autocryptInfo.senderAutocryptEnabled) {
        if (this.isAutocryptEncrypt) {
          // Autocrypt Encrypt possible
          if (!this.autocryptInfo.encryptTotally) {
            this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT_NON_ENCRYPT;
          } else if (this.autocryptInfo.recommendationValue === UIRecommendationValue.DISCOURAGE) {
            this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT_ENCRYPT_DISCOURAGE;
          } else if (
            this.autocryptInfo.recommendationValue === UIRecommendationValue.ENCRYPT ||
            this.autocryptInfo.recommendationValue === UIRecommendationValue.AVAILABLE
          ) {
            this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT_ENCRYPT;
          }
        } else if (this.autocryptInfo.senderPreferEncrypt === AutocryptPreferEncryptType.MUTUAL) {
          this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT_MUTUAL;
        } else if (
          !this.autocryptInfo.senderPreferEncrypt ||
          this.autocryptInfo.senderPreferEncrypt === AutocryptPreferEncryptType.NOPREFERENCE
        ) {
          this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT_NOPREERENCE;
        } else {
          this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_NONE;
        }
      } else {
        this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_NONE;
      }
    } else if (this.selectedEmail && this.encryptionTypeMap && this.encryptionTypeMap[this.selectedEmail]) {
      // Recipient Icon
      if (
        this.autocryptInfo &&
        this.autocryptInfo.senderAutocryptEnabled &&
        this.autocryptInfo.senderPreferEncrypt === AutocryptPreferEncryptType.MUTUAL &&
        this.autocryptInfo.encryptTotally &&
        (this.autocryptInfo.recommendationValue === UIRecommendationValue.AVAILABLE ||
          this.autocryptInfo.recommendationValue === UIRecommendationValue.ENCRYPT)
      ) {
        this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT_ENCRYPT;
      } else {
        this.encryptionType = this.encryptionTypeMap[this.selectedEmail];
      }
    } else {
      this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_NONE;
    }
  }
}
