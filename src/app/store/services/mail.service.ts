// Angular
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Helpers
import { apiUrl } from '../../shared/config';

// Models
import { Attachment, Mail } from '../models';

// Rxjs
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { MailFolderType } from '../models/mail.model';

@Injectable()
export class MailService {
  options: any;
  encrypted: any;
  pubkey: any;
  privkey: any;
  passphrase: any;
  privKeyObj: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  getMessages(limit: number = 1000, offset: number = 0, mailFolderType: MailFolderType = MailFolderType.INBOX): Observable<Mail[]> {
    const url = `${apiUrl}emails/messages/?limit=${limit}&offset=${offset}&folder=${mailFolderType}`;
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

  uploadFile(data: Attachment): Observable<any[]> {
    const formData = new FormData();
    formData.append('document', data.document);
    formData.append('message', data.message.toString());
    formData.append('hash', data.hash);

    return this.http.post<any>(`${apiUrl}/emails/attachments/create/`, formData, {
      reportProgress: true,
      headers: new HttpHeaders().append('Content-Type', 'multipart/form-data')
    });
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
