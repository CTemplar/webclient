// Angular
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
// Helpers
import { apiUrl } from '../../shared/config';
// Models
import { Attachment, Mail, Mailbox } from '../models';
// Rxjs
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MailFolderType } from '../models/mail.model';

@Injectable()
export class MailService {

  constructor(private http: HttpClient) {}

  getMessages(payload: { limit: number, offset: number, folder: MailFolderType, read: null }): Observable<Mail[]> {
    let url = `${apiUrl}emails/messages/?limit=${payload.limit}&offset=${payload.offset}`;
    if (!payload.folder) {
      payload.folder = MailFolderType.INBOX;
    }
    if (payload.folder === MailFolderType.STARRED) {
      url = `${url}&starred=true`;
    } else {
      url = `${url}&folder=${payload.folder}`;
    }
    if (payload.read === false || payload.read === true) {
      url = `${url}&read=${payload.read}`;
    }
    return this.http.get<Mail[]>(url).map(data => data['results']);
  }

  getMessage(messageId: number): Observable<Mail> {
    const url = `${apiUrl}emails/messages/?id__in=${messageId}`;
    return this.http.get<Mail>(url).map(data => {
      return data['results'] ? data['results'][0] : null;
    });
  }

  getMailboxes(limit: number = 1000, offset: number = 0): Observable<any> {
    const url = `${apiUrl}emails/mailboxes/?limit=${limit}&offset=${offset}`;
    return this.http.get<any>(url).map(data => data['results']);
  }

  getUsersPublicKeys(emails: string): Observable<any> {
    return this.http.get<any>(`${apiUrl}emails/keys/?email__in=${emails}`).map(data => data['results']);
  }

  getSecureMessage(hash: string, secret: string): Observable<any> {
    const url = `${apiUrl}emails/secure-message/${hash}/${secret}/`;
    return this.http.get<any>(url);
  }

  updateFolder(data: Mailbox): Observable<any> {
    return this.http.patch<any>(`${apiUrl}emails/mailboxes/${data.id}/`, data);
  }

  createMail(data: any): Observable<any[]> {
    let url = `${apiUrl}/emails/messages/`;
    if (data.id) {
      url = url + data.id + '/';
      return this.http.patch<any>(url, data);
    }
    return this.http.post<any>(url, data);
  }

  markAsRead(ids: string, isMailRead: boolean): Observable<any[]> {
    return this.http.patch<any>(`${apiUrl}/emails/messages/?id__in=${ids}`, { read: isMailRead });
  }

  markAsStarred(ids: string, isMailStarred: boolean): Observable<any[]> {
    return this.http.patch<any>(`${apiUrl}/emails/messages/?id__in=${ids}`, { starred: isMailStarred });
  }

  moveMail(ids: string, folder: string): Observable<any[]> {
    return this.http.patch<any>(`${apiUrl}/emails/messages/?id__in=${ids}`, { folder: folder });
  }

  deleteMails(ids: string): Observable<any[]> {
    return this.http.delete<any>(`${apiUrl}/emails/messages/?id__in=${ids}`);
  }

  uploadFile(data: Attachment): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('document', data.document);
    formData.append('message', data.message.toString());
    formData.append('is_inline', data.is_inline.toString());

    const request = new HttpRequest('POST', `${apiUrl}/emails/attachments/create/`, formData, {
      reportProgress: true
    });

    return this.http.request(request);
  }

  deleteAttachment(attachment: Attachment): Observable<any> {
    return this.http.delete<any>(`${apiUrl}emails/attachments/${attachment.id}/`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
