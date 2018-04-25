import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,
  HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';

import { UsersService } from './users.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authService: UsersService;
  constructor(private injector: Injector) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService = this.injector.get(UsersService);
    const token: string = this.authService.getToken();
    request = request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return next.handle(request);
  }
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
      .catch((response: any) => {
        if (response instanceof HttpErrorResponse && response.status === 401) {
          localStorage.removeItem('token');
          this.router.navigateByUrl('/log-in');
        }
        return Observable.throw(response);
      });
  }
}
