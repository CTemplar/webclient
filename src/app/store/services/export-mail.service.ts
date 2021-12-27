import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import emlformat from 'eml-format';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppState, DecryptedContentState, EmailContentType, MailState } from '../datatypes';
import { Attachment, Mail } from '../models';
import { MailService, MessageBuilderService, OpenPgpService, SharedService } from '.';
import { FilenamePipe } from '../../shared/pipes/filename.pipe';
import { take } from 'rxjs/operators';
import { SnackErrorPush } from '..';
import { threadId } from 'worker_threads';

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class ExportMailService {
  private decryptedAttachments: any = {};

  private decryptedContent: DecryptedContentState;

  private decryptedSubject: any;

  constructor(
    private store: Store<AppState>,
    private messageBuilderService: MessageBuilderService,
    private mailService: MailService,
    private pgpService: OpenPgpService,
    private shareService: SharedService,
  ) {
    /**
     * Check mail store
     */
    this.store
      .select(state => state.mail)
      .pipe(untilDestroyed(this))
      .subscribe((mailState: MailState) => {
        this.decryptedContent = mailState.decryptedContents;
        this.decryptedSubject = mailState.decryptedSubjects;
      });
  }

  exportMail(mail: Mail) {
    if (mail && this.decryptedContent[mail.id]) {
      if (mail.attachments?.length > 0) {
        this.decryptAttachments(mail);
      } else {
        this.downloadEMLFile(mail);
      }
    }
  }

  private decryptAttachments(mail: Mail) {
    const attachments = mail.attachments;
    if (attachments?.length > 0) {
      attachments.forEach(attachment => {
        if (this.decryptedAttachments[attachment.id]) {
          if (!this.decryptedAttachments[attachment.id].inProgress) {
            this.downloadEMLFile(mail);
          }
        } else {
          this.decryptedAttachments[attachment.id] = { ...attachment, inProgress: true };
          this.mailService.getAttachment(attachment).subscribe(
            response => {
              if (!attachment.name) {
                attachment.name = FilenamePipe.tranformToFilename(attachment.document);
              }
              const fileInfo = { attachment, type: response.file_type };
              this.pgpService
                .decryptAttachment(mail.mailbox, response.data, fileInfo)
                .pipe(take(1))
                .subscribe(
                  (decryptedAttachment: Attachment) => {
                    this.decryptedAttachments[attachment.id] = { ...decryptedAttachment, inProgress: false };
                    if (this.checkIfAttachmentsIsDecrypted(mail)) {
                      this.downloadEMLFile(mail);
                    }
                  },
                  () => this.store.dispatch(new SnackErrorPush({ message: 'Failed to decrypt attachment.' })),
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
      });
    }
  }

  private downloadEMLFile(mail: Mail) {
    // this.buildEMLData(mail).then(emlData => {
    //   emlformat.build(emlData, (error: any, eml: any) => {
    //     if (error) {
    //       return console.log(error);
    //     }
    //     const newDocument = new File([eml], `${this.decryptedSubject[mail.id]}.eml`, {
    //       type: 'eml',
    //     });
    //     this.shareService.downloadFile(newDocument);
    //   });
    // });
    this.messageBuilderService
      .buildEmlData(this.decryptedContent[mail.id], this.decryptedAttachments, mail.is_html)
      .then(eml => {
        const emlHeader = this.buildEMLData(mail);
        eml = `${emlHeader}${eml}`;
        const newDocument = new File([eml], `${this.decryptedSubject[mail.id]}.eml`, {
          type: 'eml',
        });
        this.shareService.downloadFile(newDocument);
      });
  }

  private buildEMLData(mail: Mail) {
    if (!this.decryptedContent[mail.id]) return;
    let to = mail.receiver.map(receiver => {
      const name = mail.email_display_name_map[receiver] ? mail.email_display_name_map[receiver] : '';
      if (name) {
        return `${name}<${receiver}>`;
      }
      return receiver;
    });
    let cc = mail.cc.map(c => {
      const name = mail.email_display_name_map[c] ? mail.email_display_name_map[c] : '';
      if (name) {
        return `${name}<${c}>`;
      }
      return c;
    });
    const bcc = mail.bcc.map(bc => {
      const name = mail.email_display_name_map[bc] ? mail.email_display_name_map[bc] : '';
      if (name) {
        return `${name}<${bc}>`;
      }
      return bc;
    });
    return (
      `${this.decryptedSubject[mail.id] ? 'Subject: ' + this.decryptedSubject[mail.id] : ''}\n${
        mail.sender ? 'From: ' + mail.sender : ''
      }\n${to?.length > 0 ? 'To: ' + to.join(',') : ''}\n${cc?.length > 0 ? 'CC' + cc?.join(',') : ''}\n${
        bcc?.length > 0 ? '\nBCC' + bcc?.join(',') : ''
      }\n`.trim() + '\n'
    );
  }

  public async processAttachments(): Promise<any> {
    const attachments: Attachment[] = [];
    Object.keys(this.decryptedAttachments).forEach(key => {
      attachments.push(this.decryptedAttachments[key]);
    });
    const attachmentBuffer: any[] = [];

    for (const attachment of attachments) {
      const contentBuffer = await this.readFileAsync(attachment.decryptedDocument);
      attachmentBuffer.push({
        name: attachment.name,
        contentType: 'image/png',
        data: contentBuffer,
      });
    }
    return attachmentBuffer;
  }

  private readFileAsync(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        resolve(event.target.result);
      });
      reader.addEventListener('error', reject);
      reader.readAsText(file);
    });
  }

  private checkIfAttachmentsIsDecrypted(mail: Mail): boolean {
    if (mail.attachments?.length > 0) {
      return mail.attachments.every(a => this.decryptedAttachments[a.id]);
    }
    return true;
  }
}
