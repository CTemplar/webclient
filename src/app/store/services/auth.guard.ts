// Angular
import {CanActivate, Router} from '@angular/router';
import { Injectable } from '@angular/core';

// Services
import { UsersService } from './users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  token: any;
  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  canActivate() {
    this.token = this.usersService.getToken();
    if (this.token) {
      return true;
    } else {
      this.router.navigateByUrl('/signin');
    return false;
    }
  }
}
