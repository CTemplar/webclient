import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';

import { UsersService } from './users.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authService: UsersService;

  constructor(private injector: Injector,
              private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService = this.injector.get(UsersService);
    const token: string = this.authService.getToken();
    const is_necessary_token = this.authService.getNecessaryTokenUrl(request.url);
    if (is_necessary_token) {
      request = request.clone({
        setHeaders: {
          'Authorization': `JWT ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
    return next.handle(request)
      .catch((response: any) => {
        if (response instanceof HttpErrorResponse && response.status === 401) {
          sessionStorage.removeItem('token');
          this.router.navigateByUrl('/signin');
        }
        return Observable.of(response);
      });
  }
}
