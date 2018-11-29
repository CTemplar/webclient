import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { Logout, PaymentFailure } from '../actions';
import { AppState } from '../datatypes';

import { UsersService } from './users.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authService: UsersService;

  constructor(private injector: Injector,
              private store: Store<AppState>) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.authService = this.injector.get(UsersService);
    const token: string = this.authService.getToken();
    const is_necessary_token = this.authService.getNecessaryTokenUrl(request.url);
    if (is_necessary_token) {
      request = request.clone({
        setHeaders: {
          'Authorization': `JWT ${token}`
        }
      });
    }
    return next.handle(request)
      .do((event: HttpEvent<any>) => {},
        (error: any) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              this.store.dispatch(new Logout());
            } else if (error.status === 423) {
              this.store.dispatch(new PaymentFailure());
            }
          }
        });
  }
}
