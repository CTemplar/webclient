import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Mail } from '../../../store/models';

@Component({
  selector: 'app-mail-detail-password-decryption-panel',
  templateUrl: './mail-detail-password-decryption-panel.component.html',
  styleUrls: ['./mail-detail-password-decryption-panel.component.scss'],
})
export class MailDetailPasswordDecryptionPanelComponent implements OnInit {
  @Input() mail: Mail;

  @Input() isPasswordEncrypted: boolean;

  @Input() decryptedContents: string;

  @Input() errorMessageForDecryptingWithPassword: string;

  /**
   * Represents if mail is expanded or not
   * If mail's folder is Draft, then would represent Composer is opened or not
   */
  @Input() mailExpandedStatus: boolean;

  @Output() decryptWithPassword = new EventEmitter<string>();

  ngOnInit(): void {}

  togglePassword(inputID: string) {
    const input = <HTMLInputElement>document.querySelector(`#${inputID}`);
    if (!input.value) {
      return;
    }
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  onDecrypt(inputID: string) {
    const input = <HTMLInputElement>document.querySelector(`#${inputID}`);
    if (!this.mail) return;
    if (!input.value) {
      return;
    }
    this.decryptWithPassword.emit(input.value);
  }
}
