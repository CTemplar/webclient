import { Observable, throwError as observableThrowError } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, tap } from 'rxjs/operators';

import {
  Logout,
  PaymentFailure,
  StopGettingUnreadMailsCount,
  SetAuthenticatedState,
  ClearMailsOnLogout,
  RefreshToken,
} from '../actions';
import { AppState, AuthState } from '../datatypes';
import { apiUrl } from '../../shared/config';
import { WebsocketService } from '../../shared/services/websocket.service';

import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  private authService: UsersService;

  private isAuthenticated = false;

  constructor(
    private injector: Injector,
    private store: Store<AppState>,
    private websocketService: WebsocketService,
    private usersService: UsersService,
  ) {
    this.store
      .select(state => state.auth)
      .pipe()
      .subscribe((authState: AuthState) => {
        this.isAuthenticated = authState.isAuthenticated;
      });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService = this.injector.get(UsersService);
    if (!request.url.includes('emails/secure-message')) {
      request = request.clone({
        withCredentials: true,
      });
    }

    return next.handle(request).pipe(
      tap(event => {
        if (
          event instanceof HttpResponse &&
          event.ok &&
          event.url.includes(apiUrl) &&
          !event.url.includes('auth/sign-out') &&
          !event.url.includes('auth/sign-in') &&
          !event.url.includes('auth/check-username') &&
          !event.url.includes('emails/secure-message') &&
          !this.isAuthenticated
        ) {
          this.store.dispatch(new SetAuthenticatedState({ isAuthenticated: true }));
        }
      }),
      catchError((error: any) => {
        const { status, url } = error;
        if (error instanceof HttpErrorResponse) {
          if (status === 401 && this.usersService.shouldRemember() && !url.includes('auth/refresh')) {
            this.store.dispatch(new RefreshToken());
          } else if (status === 401 && !url.includes('auth/sign-out')) {
            this.websocketService.disconnect();
            this.store.dispatch(new ClearMailsOnLogout());
            this.store.dispatch(new Logout({ session_expired: true }));
          } else if (status === 423) {
            this.store.dispatch(new StopGettingUnreadMailsCount());
            this.store.dispatch(new PaymentFailure());
          }
        }
        if (error.error.error) {
          error.error = error.error.error.error;
        } else if (error.error.detail) {
          error.error = error.error.detail;
        }
        return observableThrowError(error);
      }),
    );
  }
}
