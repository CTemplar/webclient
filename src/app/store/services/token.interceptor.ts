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
} from '../actions';
import { AppState, AuthState } from '../datatypes';
import { apiUrl } from '../../shared/config';
import { WebsocketService } from '../../shared/services/websocket.service';

import { UsersService } from './users.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authService: UsersService;

  private isAuthenticated = false;

  constructor(private injector: Injector, private store: Store<AppState>, private websocketService: WebsocketService) {
    this.store
      .select(state => state.auth)
      .pipe()
      .subscribe((authState: AuthState) => {
        this.isAuthenticated = authState.isAuthenticated;
      });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService = this.injector.get(UsersService);
    request = request.clone({
      withCredentials: true,
    });

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          if (
            event.ok &&
            event.url.includes(apiUrl) &&
            !event.url.includes('auth/sign-out') &&
            !event.url.includes('auth/sign-in') &&
            !this.isAuthenticated
          ) {
            this.store.dispatch(new SetAuthenticatedState({ isAuthenticated: true }));
          }
        }
      }),
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401 && !error.url.includes('auth/sign-out')) {
            this.websocketService.disconnect();
            this.store.dispatch(new ClearMailsOnLogout());
            this.store.dispatch(new Logout({ session_expired: true }));
          } else if (error.status === 423) {
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
