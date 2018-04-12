// Angular
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Helpers
import { apiUrl } from '../../shared/config';

// Models
import { User } from './users';

// Rxjs
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

// Services
// import { MailService } from '../../mail/shared/mail.service';
// import { SharedService } from '../../shared/shared.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Injectable()
export class UsersService {
  constructor(
    private http: HttpClient,
    // private mailService: MailService,
    // private sharedService: SharedService,
    private router: Router,
  ) {}

  setTokenExpiration() {
    const expiration = (new Date()).getTime() + 7 * (1000 * 60 * 60 * 24);
    sessionStorage.setItem('token_expiration', expiration.toString());
  }

  refreshToken(): Observable<any> {
    const body = {'token': sessionStorage.getItem('token')};
    const url = `${apiUrl}auth/refresh/`;
    return this.http.post<any>(url, body)
      .pipe(tap(data => {
        sessionStorage.setItem('token', data.token);
        this.setTokenExpiration();
      }));
  }

  signedIn() {
    const token_active = +sessionStorage.getItem('token_expiration') > (new Date()).getTime();
    if (!!sessionStorage.getItem('token') && token_active) {
      return true;
    } else {
      return false;
    }
  }

  signIn(body): Observable<any> {
    const url = `${apiUrl}auth/get/`;
    return this.http.post<any>(url, body)
      .pipe(tap(data => {
          // this.sharedService.isMailReady.emit(false);
          sessionStorage.setItem('token', data.token);
          this.setTokenExpiration();
          // this.mailService.cache();
          this.router.navigate(['/mail']);
        }),
        catchError(this.handleError('signIn', 'failed'))
      );
  }

  signOut() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('token_expiration');
    this.router.navigate(['/']);
    // this.mailService.clear();
  }

  signUp(body): Observable<any> {
    const url = `${apiUrl}users/`;
    return this.http.post<any>(url, body)
      .pipe(tap(_ => this.signIn(body).subscribe()),
        catchError(this.handleError('signUp', 'failed'))
      );
  }

  verifyToken(): Observable<any> {
    const body = {'token': sessionStorage.getItem('token')};
    const url = `${apiUrl}auth/verify/`;
    return this.http.post<any>(url, body);
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
