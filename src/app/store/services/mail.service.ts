// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Helpers
import { apiUrl } from '../../shared/config';

// Models
import { Mail } from '../models';

// Rxjs
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

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
  ) {}

  getMessages(limit: number = 1000, offset: number = 0): Observable<Mail[]> {
    const url = `${apiUrl}users/messages/?limit=${limit}&offset=${offset}&folder=inbox`;
    return this.http.get<Mail[]>(url)
      .pipe(
        map(data => data['results'])
    );
  }


  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
