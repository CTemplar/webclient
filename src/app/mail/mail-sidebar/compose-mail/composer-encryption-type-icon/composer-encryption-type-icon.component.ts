import { Component, Input, SimpleChanges } from '@angular/core';
import {
  AutocryptEncryptDetermine,
  AutocryptPreferEncryptType,
  ComposerEncryptionType,
  UIRecommendationValue,
} from '../../../../store/datatypes';
import { SharedService } from '../../../../store/services';

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

  constructor(private sharedService: SharedService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isAutocrypt) {
      /**
       * Sender Icon
       */
      if (this.autocryptInfo && this.autocryptInfo.senderAutocryptEnabled) {
        if (this.isAutocryptEncrypt) {
          /**
           * Autocrypt *** Encrypt *** is possible
           */
          if (!this.autocryptInfo.encryptTotally) {
            /**
             * NO Encrypt
             */
            this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT_NON_ENCRYPT;
          } else if (this.autocryptInfo.recommendationValue === UIRecommendationValue.DISCOURAGE) {
            /**
             * Encrypt, but Discourage
             */
            this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT_ENCRYPT_DISCOURAGE;
          } else if (
            this.autocryptInfo.recommendationValue === UIRecommendationValue.ENCRYPT ||
            this.autocryptInfo.recommendationValue === UIRecommendationValue.AVAILABLE
          ) {
            /**
             * Encrypt!!!
             */
            this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT_ENCRYPT;
          }
        } else if (this.autocryptInfo.senderPreferEncrypt === AutocryptPreferEncryptType.MUTUAL) {
          /**
           * Autocrypt Enabled and *** Mutual ***
           */
          this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT_MUTUAL;
        } else if (
          !this.autocryptInfo.senderPreferEncrypt ||
          this.autocryptInfo.senderPreferEncrypt === AutocryptPreferEncryptType.NOPREFERENCE
        ) {
          /**
           * Autocrypt Enabled and *** Preference ***
           */
          this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT_NOPREERENCE;
        } else {
          this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_NONE;
        }
      } else {
        this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_NONE;
      }
    } else if (this.selectedEmail && this.encryptionTypeMap && this.encryptionTypeMap[this.selectedEmail]) {
      if (!this.sharedService.isRFCStandardValidEmail(this.selectedEmail)) {
        this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_NONE;
      } else {
        /**
         * Recipient Icon
         */
        if (this.encryptionTypeMap[this.selectedEmail] === ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_END_TO_END) {
          /**
           * If it is CTemplar user, don't check below and set as End to End
           */
          this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_END_TO_END;
        } else if (this.autocryptInfo && this.autocryptInfo.senderAutocryptEnabled) {
          /**
           * Autocryp Enabled
           * At this case, Autocrypt icon would be showed
           */
          if (
            this.autocryptInfo.senderPreferEncrypt === AutocryptPreferEncryptType.MUTUAL &&
            this.autocryptInfo.encryptTotally &&
            (this.autocryptInfo.recommendationValue === UIRecommendationValue.AVAILABLE ||
              this.autocryptInfo.recommendationValue === UIRecommendationValue.ENCRYPT)
          ) {
            /**
             * Fully Autocrypt Enabled and Encrypted
             */
            this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT_ENCRYPT;
          } else {
            /**
             * Autocrypt Enabled, but would be attached JUST Autocrypt Header
             */
            this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_AUTOCRYPT_NON_ENCRYPT;
          }
        } else {
          this.encryptionType = this.encryptionTypeMap[this.selectedEmail];
        }
      }
    } else {
      this.encryptionType = ComposerEncryptionType.COMPOSER_ENCRYPTION_TYPE_NONE;
    }
  }
}
