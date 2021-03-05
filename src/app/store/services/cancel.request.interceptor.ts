import { Observable } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { HttpCancelService } from './cancel.request.service';

@Injectable({
  providedIn: 'root',
})
export class CancelPendingRequestInterceptor implements HttpInterceptor {
  constructor(private httpCancelService: HttpCancelService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()));
  }
}
