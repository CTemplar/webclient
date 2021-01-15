import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Store } from '@ngrx/store';

import { AppState, AuthState } from '../datatypes';
import { apiUrl } from '../../shared/config';
import { WebsocketService } from '../../shared/services/websocket.service';

import { UsersService } from './users.service';

@Injectable()
export class HttpCancelService {
  private cancelPendingRequests$ = new Subject<void>()

  constructor() { }

  /** Cancels all pending Http requests. */
  public cancelPendingRequests() {
    console.log('cancel pending request')
    this.cancelPendingRequests$.next()
  }

  public onCancelPendingRequests() {
    console.log('on cancel pending request')
    return this.cancelPendingRequests$.asObservable()
  }
}

@Injectable()
export class CancelPendingRequestInterceptor implements HttpInterceptor {
  constructor(private httpCancelService: HttpCancelService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      takeUntil(this.httpCancelService.onCancelPendingRequests()),
    );
  }
}
