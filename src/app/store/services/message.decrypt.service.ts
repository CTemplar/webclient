// @ts-ignore
import * as postal_mime from 'postal-mime';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import { Mail } from '../models';
import { AppState, PGPEncryptionType, SecureContent } from '../datatypes';
import { UpdatePGPDecryptedContent } from '../actions';

import { OpenPgpService } from './openpgp.service';

@Injectable()
export class MessageDecryptService {
  private currentDecryptingMail: Mail;

  constructor(private openpgpService: OpenPgpService, private store: Store<AppState>) {}

  /**
   * TODO - This should be updated for support all of decryption, currently this supports only PGP/MIME message decryption
   * Decrypt the message by the type
   * Message Type:
   * 1. General Message
   * 2. PGP/MIME Message
   * 3. Password Encrypted Message
   * @param mailData
   * @param isDecryptingAllSubjects
   * @param password
   */
  decryptMessage(mail: Mail, isDecryptingAllSubjects = false, password = ''): Observable<any> {
    this.currentDecryptingMail = mail;
    const subject = new Subject<any>();
    if (mail.encryption_type === PGPEncryptionType.PGP_MIME) {
      this.openpgpService
        .decrypt(mail.mailbox, mail.id, new SecureContent(mail), isDecryptingAllSubjects, true)
        .subscribe(
          (decryptedData: any) => {
            this.parseEmail(decryptedData.decryptedContent.content)
              .then(messageObject => {
                const decryptedContent: SecureContent = {
                  content: messageObject.html,
                  content_plain: messageObject.text,
                  incomingHeaders: '',
                  subject: decryptedData.decryptedContent.subject,
                };
                this.store.dispatch(
                  new UpdatePGPDecryptedContent({
                    id: decryptedData.callerId,
                    isPGPInProgress: false,
                    decryptedContent,
                    isDecryptingAllSubjects: decryptedData.isDecryptingAllSubjects,
                    decryptError: false,
                  }),
                );
              })
              .catch(error => {
                this.store.dispatch(
                  new UpdatePGPDecryptedContent({
                    id: error.callerId,
                    isPGPInProgress: false,
                    decryptedContent: error.decryptedContent,
                    isDecryptingAllSubjects: error.isDecryptingAllSubjects,
                    decryptError: true,
                  }),
                );
              });
            subject.next();
            subject.complete();
          },
          error => {
            this.store.dispatch(
              new UpdatePGPDecryptedContent({
                id: error.callerId,
                isPGPInProgress: false,
                decryptedContent: error.decryptedContent,
                isDecryptingAllSubjects: error.isDecryptingAllSubjects,
                decryptError: true,
              }),
            );
            subject.error(error);
          },
        );
    }
    return subject.asObservable();
  }

  /**
   * parse message
   * @param message
   * @return message object as Promise
   */
  async parseEmail(message: string): Promise<any> {
    const PostalMime = postal_mime.default;
    const parser = new PostalMime();
    const email = await parser.parse(message);
    return email;
  }
}
