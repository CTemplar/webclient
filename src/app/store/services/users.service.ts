// Angular
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// Helpers
import { apiUrl } from '../../shared/config';
// Models
// Rxjs
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState, Settings } from '../datatypes';
import { LogInSuccess } from '../actions';
import * as bcrypt from 'bcryptjs';
import { Filter } from '../models/filter.model';

@Injectable()
export class UsersService {
  private token: string | null;
  private userKey: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<AppState>,
  ) {
    if (this.getToken() && this.getUserKey() && !this.isTokenExpired()) {
      this.store.dispatch(new LogInSuccess({ token: this.getToken() }));
    }
  }

  setTokenExpiration() {
    const expiration = new Date().getTime() + (1000 * 60 * 60 * 3);  // set 3 hours expiration token time.
    sessionStorage.setItem('token_expiration', expiration.toString());
  }

  refreshToken(): Observable<any> {
    const body = { token: sessionStorage.getItem('token') };
    const url = `${apiUrl}auth/refresh/`;
    return this.http.post<any>(url, body).pipe(
      tap(data => {
        sessionStorage.setItem('token', data.token);
        this.setTokenExpiration();
      })
    );
  }

  isTokenExpired() {
    return +sessionStorage.getItem('token_expiration') < new Date().getTime();
  }

  signIn(body): Observable<any> {
    const requestData: any = { ...body };
    const index = requestData.username.indexOf('@');
    requestData.username = index > -1 ? requestData.username.toLowerCase().substring(0, index) : requestData.username.toLowerCase();
    requestData.password = this.hashPassword(requestData);
    const url = `${apiUrl}auth/sign-in/`;
    return this.http.post<any>(url, requestData).pipe(
      tap(data => {
        this.setLoginData(data, body);
      })
    );
  }

  private hashPassword(requestData: any, field = 'password'): string {
    const username = requestData.username.toLowerCase();
    const salt = this.createSalt('$2a$10$', username);
    return bcrypt.hashSync(requestData[field], salt);
  }

  private createSalt(salt, username) {
    username = username.replace(/[^a-zA-Z ]/g, '');
    username = username ? username : 'test';
    if (salt.length < 29) {
      return this.createSalt(salt + username, username);
    } else {
      return salt.substr(0, 29);
    }
  }

  private setLoginData(tokenResponse: any, requestData) {
    this.token = tokenResponse.token;
    this.userKey = btoa(requestData.password);
    sessionStorage.setItem('token', tokenResponse.token);
    this.setTokenExpiration();
    if (requestData.rememberMe) {
      sessionStorage.setItem('user_key', this.userKey);
    }
  }

  signOut() {
    this.userKey = this.token = null;
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('token_expiration');
    sessionStorage.removeItem('user_key');
    this.router.navigateByUrl('/signin');
  }

  signUp(user): Observable<any> {
    const requestData = { ...user };
    requestData.password = this.hashPassword(requestData);
    return this.http.post<any>(`${apiUrl}auth/sign-up/`, requestData).pipe(
      tap(data => {
        this.setLoginData(data, user);
      })
    );
  }

  recoverPassword(data): Observable<any> {
    return this.http.post<any>(`${apiUrl}auth/recover/`, data);
  }

  resetPassword(data): Observable<any> {
    const requestData = { ...data };
    requestData.password = this.hashPassword(requestData);
    return this.http.post<any>(`${apiUrl}auth/reset/`, requestData).pipe(
      tap(res => {
        this.setLoginData(res, data);
      })
    );
  }

  changePassword(data): Observable<any> {
    const requestData = { ...data };
    requestData.old_password = this.hashPassword(requestData, 'old_password');
    requestData.password = this.hashPassword(requestData, 'password');
    requestData.confirm_password = this.hashPassword(requestData, 'confirm_password');
    delete requestData['username'];
    return this.http.post<any>(`${apiUrl}auth/change-password/`, requestData);
  }

  verifyToken(): Observable<any> {
    const body = { token: sessionStorage.getItem('token') };
    const url = `${apiUrl}auth/verify/`;
    return this.http.post<any>(url, body);
  }

  getToken(): string {
    return this.token || sessionStorage.getItem('token');
  }

  getUserKey(): string {
    return this.userKey || sessionStorage.getItem('user_key');
  }

  getNecessaryTokenUrl(url) {
    url = url.replace(apiUrl, '');
    const authenticatedUrls: string[] = [
      'users/myself/',
      'users/users/',
      'users/whitelist/',
      'users/blacklist/',
      'users/contact',
      'users/bulk-contact/create/',
      'users/filters/',
      'emails/messages/',
      'emails/mailboxes',
      'emails/custom-folder',
      'emails/unread/',
      'users/settings',
      'emails/attachments',
      'emails/keys',
      'auth/upgrade',
      'auth/change-password',
      'auth/delete',
      'emails/domains'
    ];
    if (authenticatedUrls.indexOf(url) > -1) {
      return true;
    } else {
      let authenticated = false;
      authenticatedUrls.forEach(item => {
        if (url.indexOf(item) > -1) {
          authenticated = true;
        }
      });
      return authenticated;
    }
  }

  getAccounts(id) {
    return this.http.get<any>(`${apiUrl}users/users/${id}/`);
  }

  getAccountDetails() {
    return this.http.get<any>(`${apiUrl}users/myself/`).map(data => data['results']);
  }

  getWhiteList(limit = 0, offset = 0) {
    const url = `${apiUrl}users/whitelist/?limit=${limit}&offset=${offset}`;
    const body = {};
    return this.http.get<any>(url, body);
  }

  addWhiteList(email, name) {
    const url = `${apiUrl}users/whitelist/`;
    const body = { email: email, name: name };
    return this.http.post<any>(url, body);
  }

  updateSettings(data: Settings) {
    return this.http.patch<any>(`${apiUrl}users/settings/${data.id}/`, data);
  }

  deleteWhiteList(id) {
    const url = `${apiUrl}users/whitelist/${id}/`;
    const body = {};
    return this.http.delete<any>(url, body);
  }

  getBlackList(limit = 0, offset = 0) {
    const url = `${apiUrl}users/blacklist/?limit=${limit}&offset=${offset}`;
    const body = {};
    return this.http.get<any>(url, body);
  }

  addBlackList(email, name) {
    const url = `${apiUrl}users/blacklist/`;
    const body = { email: email, name: name };
    return this.http.post<any>(url, body);
  }

  deleteBlackList(id) {
    const url = `${apiUrl}users/blacklist/${id}/`;
    const body = {};
    return this.http.delete<any>(url, body);
  }

  getContact(limit = 0, offset = 0) {
    const url = `${apiUrl}users/contacts/?limit=${limit}&offset=${offset}`;
    const body = {};
    return this.http.get<any>(url, body);
  }

  addContact(payload) {
    const url = `${apiUrl}users/contacts/`;
    if (payload.id) {
      return this.http.patch<any>(`${url}${payload.id}/`, payload);
    }
    return this.http.post<any>(url, payload);
  }

  deleteContact(ids) {
    const url = `${apiUrl}users/contacts/?id__in=${ids}`;
    return this.http.delete<any>(url);
  }

  importContacts(data: any) {
    const formData = new FormData();
    formData.append('csv_file', data.file);
    formData.append('provider', data.provider);

    const request = new HttpRequest('POST', `${apiUrl}users/bulk-contact/create/`, formData);

    return this.http.request(request);
  }

  checkUsernameAvailability(username): Observable<any> {
    return this.http.post<any>(`${apiUrl}auth/check-username/`, { username });
  }

  upgradeAccount(data) {
    return this.http.post<any>(`${apiUrl}auth/upgrade/`, data);
  }

  getFilters(limit = 0, offset = 0) {
    const url = `${apiUrl}users/filters/?limit=${limit}&offset=${offset}`;
    return this.http.get<any>(url);
  }

  createFilter(data: Filter) {
    const url = `${apiUrl}users/filters/`;
    if (data.id) {
      return this.http.patch<any>(`${url}${data.id}/`, data);
    }
    return this.http.post<any>(url, data);
  }

  deleteFilter(filterId: number) {
    return this.http.delete<any>(`${apiUrl}users/filters/${filterId}`);
  }

  deleteAccount(data: any) {
    const requestData = { ...data };
    requestData.password = this.hashPassword(requestData);
    delete requestData['username'];
    return this.http.post<any>(`${apiUrl}auth/delete/`, requestData);
  }

  getEmailDomains(limit = 0, offset = 0) {
    const url = `${apiUrl}emails/domains/?limit=${limit}&offset=${offset}`;
    const body = {};
    return this.http.get<any>(url, body);
  }

  createEmailDomain(domain) {
    const body = { domain };
    return this.http.post<any>(`${apiUrl}emails/domains/`, body);
  }

  readEmailDomain(id: number) {
    const url = `${apiUrl}emails/domains/${id}/`;
    const body = {};
    return this.http.get<any>(url, body);
  }

  deleteEmailDomain(id: number) {
    return this.http.delete<any>(`${apiUrl}emails/domains/${id}`);
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
