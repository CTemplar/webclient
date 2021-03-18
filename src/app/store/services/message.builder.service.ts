import { Injectable } from '@angular/core';
// @ts-ignore
import * as mimemessage from 'mimemessage';

import { EmailContentType, PGPEncryptionType, SecureContent } from '../datatypes';
import { Attachment } from '../models';
import { SharedService } from './shared.service';

@Injectable()
export class MessageBuilderService {
  constructor(private sharedService: SharedService) {}
  /**
   * Build mime message raw data, will be used for only PGP/MIME now
   * @param mailData - SecureContent that contains message content and content_plain
   * @param attachments - Attachment list
   * @param isHtml
   * @param isBase64EncodeForBody - Decide to encode
   * @param isPGPMessage - Decide to build for PGP/Inline or PGP/Mime
   * @param pgpEncryptionType - PGP/Inline or PGP/Mime
   */
  async getMimeData(
    mailData: SecureContent,
    attachments: Attachment[] = [],
    isHtml: boolean,
    isBase64EncodeForBody = false,
    isPGPMessage = false,
    pgpEncryptionType: PGPEncryptionType,
  ): Promise<any> {
    if (isPGPMessage) {
      const message = mimemessage.factory({
        contentType: EmailContentType.MULTIPART_MIXED,
        body: [],
      });
      // Content Body
      const content = isHtml ? (isBase64EncodeForBody ? btoa(unescape(encodeURIComponent(mailData.content))) : mailData.content) : (isBase64EncodeForBody ? btoa(unescape(encodeURIComponent(mailData.content_plain))) : mailData.content_plain) || '';
      const contentEntity = mimemessage.factory({
        contentType: isHtml ? EmailContentType.TEXT_HTML_CHARSET_UTF8 : EmailContentType.PLAIN_TEXT_CHARSET_UTF8,
        body: content,
      });
      if (isBase64EncodeForBody) {
        contentEntity.header('Content-Transfer-Encoding', 'base64');
      }
      const attachmentsEntities = await this.processAttachments(attachments);
      message.body = [contentEntity, ...attachmentsEntities];
      return message.toString();
    }
  }

  private async processAttachments(attachments: Array<Attachment>): Promise<any> {
    const attachmentsEntities: any[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const attachment of attachments) {
      // eslint-disable-next-line no-await-in-loop
      const contentBuffer = await this.readFileAsync(attachment.decryptedDocument);
      const attachmentsEntity = mimemessage.factory({
        contentType: `${EmailContentType.APPLICATION_OCTET_STREAM}; name="${attachment.name}"`,
        contentTransferEncoding: 'base64',
        body: contentBuffer,
      });
      attachmentsEntity.header('Content-Disposition', `attachment; filename="${attachment.name}"`);
      attachmentsEntities.push(attachmentsEntity);
    }
    return attachmentsEntities;
  }

  private readFileAsync(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        resolve(this.sharedService.arrayBufferToBase64(event.target.result));
      });
      reader.addEventListener('error', reject);
      reader.readAsArrayBuffer(file);
    });
  }
}
