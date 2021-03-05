import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as bcrypt from 'bcryptjs';
import * as Sentry from '@sentry/browser';

import { LogInSuccess } from '../actions';
import {
  apiUrl,
  PRIMARY_DOMAIN,
  PROMO_CODE_KEY,
  REFFERAL_CODE_KEY,
  REFFERAL_ID_KEY,
  JWT_AUTH_COOKIE,
  REMEMBER_ME,
} from '../../shared/config';
import { AppState, AutoResponder, Contact, Settings, AuthState } from '../datatypes';
import { Filter } from '../models/filter.model';

@Injectable()
export class UsersService {
  private userKey: string;

  constructor(private http: HttpClient, private router: Router, private store: Store<AppState>) {
    this.store
      .select(state => state.auth)
      .pipe(distinctUntilChanged((previous, current) => previous.isAuthenticated === current.isAuthenticated))
      .subscribe((authState: AuthState) => {
        if (authState.isAuthenticated && this.getUserKey()) {
          this.store.dispatch(new LogInSuccess({}));
        }
      });
  }

  setTokenExpiration() {
    const expiration = new Date().getTime() + 1000 * 60 * 60 * 3; // set 3 hours expiration token time.
    localStorage.setItem('token_expiration', expiration.toString());
  }

  refreshToken(): Observable<any> {
    if (this.doesHttpOnlyCookieExist(JWT_AUTH_COOKIE)) {
      const body = {};
      const url = `${apiUrl}auth/refresh/`;
      return this.http.post<any>(url, body).pipe(
        tap(data => {
          this.setTokenExpiration();
        }),
      );
    }
    return of({});
  }

  isTokenExpired() {
    return +localStorage.getItem('token_expiration') < new Date().getTime();
  }

  signIn(body: any): Observable<any> {
    const requestData: any = { ...body };
    requestData.username = this.trimUsername(requestData.username);
    requestData.password = this.hashData(requestData);
    const url = `${apiUrl}auth/sign-in/`;
    return this.http.post<any>(url, requestData).pipe(
      tap(data => {
        if (data.token) {
          this.setLoginData(body);
        }
      }),
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

  private createSalt(salt: string, username: string): any {
    username = username.replace(/[^ A-Za-z]/g, '');
    username = username || 'test';
    if (salt.length < 29) {
      return this.createSalt(salt + username, username);
    }
    return salt.slice(0, 29);
  }

  private setLoginData(requestData: any) {
    this.userKey = btoa(requestData.password);
    this.setTokenExpiration();
    localStorage.setItem('user_key', this.userKey);
    localStorage.removeItem(PROMO_CODE_KEY);
    localStorage.removeItem(REFFERAL_CODE_KEY);
  }

  signOut() {
    this.router.navigateByUrl('/signin');
    localStorage.removeItem('token_expiration');
    localStorage.removeItem('user_key');
    localStorage.removeItem('ctemplar_mail');
    sessionStorage.removeItem('ctemplar_mail');
    localStorage.removeItem(PROMO_CODE_KEY);
    localStorage.removeItem(REMEMBER_ME);
  }

  expireSession() {
    this.userKey = null;
    localStorage.removeItem('user_key');
    localStorage.removeItem('ctemplar_mail');
    sessionStorage.removeItem('ctemplar_mail');
    localStorage.removeItem(REMEMBER_ME);
    this.router.navigateByUrl('/signin');
    return this.http.get(`${apiUrl}auth/sign-out/`);
  }

  onBeforeLoader(e: any) {
    const confirmationMessage =
      "If you close the window now all the progress will be lost and your account won't be created.";
    (e || window.event).returnValue = confirmationMessage; // Gecko + IE
    return confirmationMessage; // Gecko + Webkit, Safari, Chrome etc.
  }

  signUp(user: any): Observable<any> {
    const requestData = { ...user, timezone_offset: new Date().getTimezoneOffset() };
    const referralCode = localStorage.getItem(REFFERAL_CODE_KEY);
    if (referralCode) {
      requestData[REFFERAL_CODE_KEY] = referralCode;
    }
    requestData.password = this.hashData(requestData);
    return this.http.post<any>(`${apiUrl}auth/sign-up/`, this.updateSignupDataWithPromo(requestData)).pipe(
      tap(data => {
        this.setLoginData(user);
      }),
    );
  }

  recoverPassword(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}auth/recover/`, data);
  }

  resetPassword(data: any): Observable<any> {
    const requestData = { ...data };
    requestData.password = this.hashData(requestData);
    return this.http.post<any>(`${apiUrl}auth/reset/`, requestData).pipe(
      tap(res => {
        this.setLoginData(data);
      }),
    );
  }

  changePassword(data: any): Observable<any> {
    const requestData = { ...data };
    requestData.old_password = this.hashData(requestData, 'old_password');
    requestData.password = this.hashData(requestData, 'password');
    requestData.confirm_password = this.hashData(requestData, 'confirm_password');
    delete requestData.username;
    return this.http.post<any>(`${apiUrl}auth/change-password/`, requestData).pipe(
      tap(response => {
        this.setLoginData(data);
      }),
    );
  }

  verifyToken(): Observable<any> {
    const body = { token: localStorage.getItem('token') };
    const url = `${apiUrl}auth/verify/`;
    return this.http.post<any>(url, body);
  }

  getUserKey(): string {
    return this.userKey || localStorage.getItem('user_key');
  }

  getNecessaryTokenUrl(url: string) {
    url = url.replace(apiUrl, '');
    const authenticatedUrls: string[] = [
      'users/myself/',
      'users/users/',
      'users/payment-method/',
      'users/payment-method/add/',
      'users/payment-method/delete/',
      'users/whitelist/',
      'users/blacklist/',
      'users/contact',
      'users/bulk-contact/create/',
      'users/filters/',
      'emails/messages/',
      'emails/mailboxes',
      'emails/custom-folder',
      'emails/unread/',
      'emails/customfolder-message-count/',
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
      'promo-code/validate',
      'users/invites/',
      'notifications',
    ];
    if (authenticatedUrls.includes(url)) {
      return true;
    }
    let authenticated = false;
    authenticatedUrls.forEach(item => {
      if (url.includes(item)) {
        authenticated = true;
      }
    });
    return authenticated;
  }

  getAccounts(id: string) {
    return this.http.get<any>(`${apiUrl}users/users/${id}/`);
  }

  getAccountDetails() {
    return this.http.get<any>(`${apiUrl}users/myself/`).pipe(map(data => data.results));
  }

  getWhiteList(limit = 0, offset = 0) {
    const url = `${apiUrl}users/whitelist/?limit=${limit}&offset=${offset}`;
    const body = {};
    return this.http.get<any>(url, body);
  }

  addWhiteList(email: string, name: string) {
    const url = `${apiUrl}users/whitelist/`;
    const body = { email, name };
    return this.http.post<any>(url, body);
  }

  updateSettings(data: Settings) {
    return this.http.patch<any>(`${apiUrl}users/settings/${data.id}/`, data);
  }

  deleteWhiteList(id: number) {
    const url = `${apiUrl}users/whitelist/${id}/`;
    const body = {};
    return this.http.delete<any>(url, body);
  }

  getBlackList(limit = 0, offset = 0) {
    const url = `${apiUrl}users/blacklist/?limit=${limit}&offset=${offset}`;
    const body = {};
    return this.http.get<any>(url, body);
  }

  addBlackList(email: string, name: string) {
    const url = `${apiUrl}users/blacklist/`;
    const body = { email, name };
    return this.http.post<any>(url, body);
  }

  deleteBlackList(id: number) {
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

  getInviteCodes() {
    return this.http.get<any>(`${apiUrl}users/invites/`).pipe(map(response => response.results));
  }

  generateInviteCodes() {
    return this.http.post<any>(`${apiUrl}users/invites/`, {});
  }

  addContact(payload: Contact) {
    const url = `${apiUrl}users/contacts/`;
    if (payload.id) {
      return this.http.patch<any>(`${url}${payload.id}/`, payload);
    }
    return this.http.post<any>(url, payload);
  }

  deleteContact(ids: any) {
    if (ids === 'all') {
      return this.http.delete<any>(`${apiUrl}users/contacts/?selectAll=true`);
    }
    return this.http.delete<any>(`${apiUrl}users/contacts/?id__in=${ids}`);
  }

  notifyContact(payload: any) {
    return this.http.post<any>(`${apiUrl}notify-contacts/`, payload);
  }

  importContacts(data: any) {
    const formData = new FormData();
    formData.append('csv_file', data.file);
    formData.append('provider', data.provider);

    const request = new HttpRequest('POST', `${apiUrl}users/bulk-contact/create/`, formData);

    return this.http.request(request);
  }

  checkUsernameAvailability(username: string): Observable<any> {
    return this.http.post<any>(`${apiUrl}auth/check-username/`, { username });
  }

  addOrganizationUser(data: any): Observable<any> {
    data.password = this.hashData(data, 'password');
    return this.http.post<any>(`${apiUrl}auth/add-user/`, data);
  }

  updateOrganizationUser(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}auth/update-user/`, {
      user_id: data.user_id,
      recovery_email: data.recovery_email,
    });
  }

  deleteOrganizationUser(data: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}auth/delete-user/`, { username: data.username });
  }

  getOrganizationUsers(limit = 0, offset = 0) {
    const url = `${apiUrl}emails/domain-users/?limit=${limit}&offset=${offset}`;
    return this.http.get<any>(url);
  }

  upgradeAccount(data: any) {
    return this.http.post<any>(`${apiUrl}auth/upgrade/`, this.updateSignupDataWithPromo(data));
  }

  private updateSignupDataWithPromo(data: any = {}) {
    // Get cookie for cjevent
    const referralId = document.cookie.split('; ').find(row => row.startsWith(REFFERAL_ID_KEY));
    if (referralId) {
      data[REFFERAL_ID_KEY] = referralId.split('=')[1];
    }
    return data;
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
    delete requestData.username;
    return this.http.post<any>(`${apiUrl}auth/delete/`, requestData);
  }

  getDomains(limit = 0, offset = 0) {
    const url = `${apiUrl}emails/domains/?limit=${limit}&offset=${offset}`;
    const body = {};
    return this.http.get<any>(url, body);
  }

  createDomain(domain: string) {
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

  getUserNotifications() {
    return this.http.get<any>(`${apiUrl}notifications`);
  }

  getPaymentMethods() {
    return this.http.get<any>(`${apiUrl}users/payment-method/`);
  }

  addPaymentMethod(data: any) {
    return this.http.post<any>(`${apiUrl}users/payment-method/add/`, { stripe_token: data });
  }

  deletePaymentMethod(data: any) {
    return this.http.post<any>(`${apiUrl}users/payment-method/delete/`, { card_id: data });
  }

  makePaymentPrimary(data: any) {
    return this.http.post<any>(`${apiUrl}users/payment-method/make-primary/`, { card_id: data });
  }

  contactFetchKeys(data: any) {
    return this.http.get<any>(`${apiUrl}users/contact-keys/?contact_id=${data.id}`);
  }

  contactAddKeys(data: any) {
    if (data.id) {
      return this.http.patch<any>(`${apiUrl}users/contact-keys/${data.id}/`, data);
    }
    return this.http.post<any>(`${apiUrl}users/contact-keys/`, data);
  }

  contactRemoveKeys(data: any) {
    return this.http.delete<any>(`${apiUrl}users/contact-keys/${data.id}/`);
  }

  contactBulkUpdateKeys(data: any) {
    return this.http.post<any>(`${apiUrl}users/contact-key-bulk-update/`, { contact_key_list: data });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      Sentry.captureException(error.originalError || error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // TODO
  // This part is almost trick, but would work perfectly, needs to update later
  doesHttpOnlyCookieExist(cookiename: string) {
    const d = new Date();
    d.setTime(d.getTime() + 1000);
    const expires = `expires=${d.toUTCString()}`;

    document.cookie = `${cookiename}=new_value;path=/;${expires}`;
    if (!document.cookie.includes(`${cookiename}=`)) {
      return true;
    }
    return false;
  }
}
