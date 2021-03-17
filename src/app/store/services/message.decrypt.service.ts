// @ts-ignore
import * as postal_mime from 'postal-mime';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { take } from 'rxjs/operators';

import { Attachment, Mail } from '../models';
import { AppState, PGP_MIME_DEFAULT_CONTENT, PGPEncryptionType, SecureContent } from '../datatypes';
import { SetAttachmentsForPGPMime, SnackErrorPush, UpdatePGPDecryptedContent } from '../actions';
import { FilenamePipe } from '../../shared/pipes/filename.pipe';

import { OpenPgpService } from './openpgp.service';
import { MailService } from './mail.service';

@Injectable()
export class MessageDecryptService {
  private currentDecryptingMail: Mail;

  constructor(
    private openpgpService: OpenPgpService,
    private store: Store<AppState>,
    private mailService: MailService,
  ) {}

  /**
   * TODO - This should be updated for support all of decryption, currently this supports only PGP/MIME message decryption
   * This is external interface function,
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
      if (mail.content === '' || mail.content === PGP_MIME_DEFAULT_CONTENT) {
        if (mail.attachments.length > 0) {
          // The first attachment would be encrypted.asc
          const encryptedDotAsc = mail.attachments[0];
          this.mailService.getAttachment(encryptedDotAsc).subscribe(
            response => {
              this.decryptPGPMessageProcess(
                subject,
                { ...mail, content: atob(response.data), content_plain: '' },
                isDecryptingAllSubjects,
              );
            },
            errorResponse => {
              this.store.dispatch(
                new UpdatePGPDecryptedContent({
                  id: mail.id,
                  isPGPInProgress: false,
                  decryptedContent: {},
                  isDecryptingAllSubjects: false,
                  decryptError: true,
                }),
              );
              subject.error(1);
            },
          );
        } else {
          // If there is no encrypted.asc, raise failure to decrypt
          this.store.dispatch(
            new UpdatePGPDecryptedContent({
              id: mail.id,
              isPGPInProgress: false,
              decryptedContent: '',
              isDecryptingAllSubjects: false,
              decryptError: true,
            }),
          );
          subject.error(1);
        }
      } else {
        this.decryptPGPMessageProcess(subject, mail, isDecryptingAllSubjects);
      }
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

  decryptPGPMessageProcess(subject: Subject<any>, mail: Mail, isDecryptingAllSubjects: boolean) {
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
              if (messageObject.attachments?.length > 0) {
                let attachments: Attachment[] = [];
                messageObject.attachments.forEach((parsedAttachment: any) => {
                  const attachment: Attachment = {
                    size: '',
                    draftId: 0,
                    document: URL.createObjectURL(
                      new Blob([parsedAttachment.content], { type: parsedAttachment.mimeType }),
                    ),
                    content_id: parsedAttachment.contentId,
                    is_encrypted: false,
                    name: parsedAttachment.filename || 'attachment',
                    is_inline: false,
                    inProgress: false,
                    message: decryptedData.callerId,
                  };
                  attachments = [...attachments, attachment];
                });
                this.store.dispatch(new SetAttachmentsForPGPMime({ attachments, messageID: decryptedData.callerId }));
              } else {
                this.store.dispatch(
                  new SetAttachmentsForPGPMime({ attachments: [], messageID: decryptedData.callerId }),
                );
              }
              subject.next();
              subject.complete();
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
              subject.error(error);
            });
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
}
