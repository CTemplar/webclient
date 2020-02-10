// Angular
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// Helpers
import { apiUrl, PRIMARY_DOMAIN, PROMO_CODE_KEY, REFFERAL_CODE_KEY, REFFERAL_ID_KEY } from '../../shared/config';
// Models
// Rxjs
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState, AutoResponder, Contact, Settings } from '../datatypes';
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
    localStorage.setItem('token_expiration', expiration.toString());
  }

  refreshToken(): Observable<any> {
    const body = { token: localStorage.getItem('token') };
    const url = `${apiUrl}auth/refresh/`;
    return this.http.post<any>(url, body).pipe(
      tap(data => {
        localStorage.setItem('token', data.token);
        this.setTokenExpiration();
      })
    );
  }

  isTokenExpired() {
    return +localStorage.getItem('token_expiration') < new Date().getTime();
  }

  signIn(body): Observable<any> {
    const requestData: any = { ...body };
    requestData.username = this.trimUsername(requestData.username);
    requestData.password = this.hashData(requestData);
    const url = `${apiUrl}auth/sign-in/`;
    return this.http.post<any>(url, requestData).pipe(
      tap(data => {
        if (data.token) {
          this.setLoginData(data, body);
        }
      })
    );
  }

  trimUsername(username: string) {
    username = username.toLowerCase();
    if (username.split('@')[1] === PRIMARY_DOMAIN) {
      username = username.split('@')[0];
    }
    return username;
  }

  private hashData(requestData: any, field = 'password'): string {
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
    localStorage.setItem('token', tokenResponse.token);
    this.setTokenExpiration();
    if (requestData.rememberMe) {
      localStorage.setItem('user_key', this.userKey);
    }
  }

  signOut() {
    this.router.navigateByUrl('/signin');
    this.userKey = this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiration');
    localStorage.removeItem('user_key');
    localStorage.removeItem(PROMO_CODE_KEY);
  }

  expireSession() {
    this.userKey = null;
    localStorage.removeItem('user_key');
    this.router.navigateByUrl('/signin');
    return this.http.get(`${apiUrl}auth/sign-out/`);
  }

  signUp(user): Observable<any> {
    const requestData = { ...user, timezone_offset: new Date().getTimezoneOffset() };
    const referralCode = localStorage.getItem(REFFERAL_CODE_KEY);
    if (referralCode) {
      requestData[REFFERAL_CODE_KEY] = referralCode;
    }
    const referralId = localStorage.getItem(REFFERAL_ID_KEY);
    if (referralId) {
      requestData[REFFERAL_ID_KEY] = referralId;
    }
    requestData.password = this.hashData(requestData);
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
    requestData.password = this.hashData(requestData);
    return this.http.post<any>(`${apiUrl}auth/reset/`, requestData).pipe(
      tap(res => {
        this.setLoginData(res, data);
      })
    );
  }

  changePassword(data): Observable<any> {
    const requestData = { ...data };
    requestData.old_password = this.hashData(requestData, 'old_password');
    requestData.password = this.hashData(requestData, 'password');
    requestData.confirm_password = this.hashData(requestData, 'confirm_password');
    delete requestData['username'];
    return this.http.post<any>(`${apiUrl}auth/change-password/`, requestData).pipe(
      tap(response => {
        this.setLoginData(response, data);
      })
    );
  }

  verifyToken(): Observable<any> {
    const body = { token: localStorage.getItem('token') };
    const url = `${apiUrl}auth/verify/`;
    return this.http.post<any>(url, body);
  }

  getToken(): string {
    return this.token || localStorage.getItem('token');
  }

  getUserKey(): string {
    return this.userKey || localStorage.getItem('user_key');
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
      'emails/domains',
      'search/messages',
      'domains/verify',
      'emails/mailbox-order',
      'emails-forward/send-verification-code',
      'emails-forward/verify-verification-code',
      'emails/folder-order',
      'emails/empty-folder',
      'users/autoresponder',
      'users/invoices',
      'auth/sign-out/',
      'auth/add-user/',
      'auth/update-user/',
      'emails/domain-users/',
      'auth/otp-secret/',
      'auth/enable-2fa/',
      'users/contact-bulk-update/',
      'emails/delete-message/',
      'users/prorated',
      'btc-wallet/create/',
      'promo-code/validate'
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
    return this.http.get<any>(`${apiUrl}users/myself/`).pipe(map(data => data['results']));
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

  getContact(limit = 0, offset = 0, query = '') {
    return this.http.get<any>(`${apiUrl}users/contacts/?limit=${limit}&offset=${offset}&q=${query}`);
  }

  getEmailContacts() {
    return this.http.get<any>(`${apiUrl}users/contacts-v1/`);
  }

  updateBatchContacts(data: any) {
    return this.http.post<any>(`${apiUrl}users/contact-bulk-update/`, data);
  }

  getInvoices() {
    return this.http.get<any>(`${apiUrl}users/invoices/`);
  }

  getUpgradeAmount(data: any) {
    return this.http.post<any>(`${apiUrl}users/prorated/`, data);
  }

  validatePromoCode(data: any) {
    return this.http.post<any>(`${apiUrl}promo-code/validate/`, data);
  }

  addContact(payload: Contact) {
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

  addOrganizationUser(data: any): Observable<any> {
    data.password = this.hashData(data, 'password');
    return this.http.post<any>(`${apiUrl}auth/add-user/`, data);
  }

  updateOrganizationUser(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}auth/update-user/`, { user_id: data.user_id, recovery_email: data.recovery_email });
  }

  deleteOrganizationUser(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}auth/delete-user/`, { username: data.username });
  }

  getOrganizationUsers(limit = 0, offset = 0) {
    const url = `${apiUrl}emails/domain-users/?limit=${limit}&offset=${offset}`;
    return this.http.get<any>(url);
  }

  upgradeAccount(data) {
    const referralId = localStorage.getItem(REFFERAL_ID_KEY);
    if (referralId) {
      data[REFFERAL_ID_KEY] = referralId;
    }
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
    return this.http.delete<any>(`${apiUrl}users/filters/${filterId}/`);
  }

  deleteAccount(data: any) {
    const requestData = { ...data };
    requestData.password = this.hashData(requestData);
    delete requestData['username'];
    return this.http.post<any>(`${apiUrl}auth/delete/`, requestData);
  }

  getDomains(limit = 0, offset = 0) {
    const url = `${apiUrl}emails/domains/?limit=${limit}&offset=${offset}`;
    const body = {};
    return this.http.get<any>(url, body);
  }

  createDomain(domain) {
    const body = { domain };
    return this.http.post<any>(`${apiUrl}emails/domains/`, body);
  }

  updateDomain(domain: any) {
    return this.http.patch<any>(`${apiUrl}emails/domains/${domain.id}/`, domain);
  }

  readDomain(id: number) {
    const url = `${apiUrl}emails/domains/${id}/`;
    const body = {};
    return this.http.get<any>(url, body);
  }

  deleteDomain(id: number) {
    return this.http.delete<any>(`${apiUrl}emails/domains/${id}/`);
  }

  verifyDomain(id: number) {
    const url = `${apiUrl}domains/verify/${id}/`;
    const body = {};
    return this.http.get<any>(url, body);
  }

  sendEmailForwardingCode(email: string): Observable<any> {
    const body = { email };
    return this.http.post(`${apiUrl}emails-forward/send-verification-code/`, body);
  }

  verifyEmailForwardingCode(email: string, code: number): Observable<any> {
    const body = { email, code };
    return this.http.post(`${apiUrl}emails-forward/verify-verification-code/`, body);
  }

  saveAutoResponder(autoResponder: AutoResponder): Observable<any> {
    if (autoResponder.id) {
      return this.http.patch<any>(`${apiUrl}users/autoresponder/${autoResponder.id}/`, autoResponder);
    }
    return this.http.post<any>(`${apiUrl}users/autoresponder/`, autoResponder);
  }

  getCaptcha(): Observable<any> {
    return this.http.get<any>(`${apiUrl}auth/captcha/`);
  }


  get2FASecret(): Observable<any> {
    return this.http.get<any>(`${apiUrl}auth/otp-secret/`);
  }


  update2FA(data: any): Observable<any> {
    data.password = this.hashData(data);
    return this.http.post<any>(`${apiUrl}auth/enable-2fa/`, data);
  }

  verifyCaptcha(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}auth/captcha-verify/`, data);
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
