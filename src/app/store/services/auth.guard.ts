// Angular
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

// Services
import { UsersService } from './users.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.usersService.getUserKey()) {
      if (state.url === '/signin') {
        this.router.navigateByUrl('/mail');
      }
      return true;
    } else if (state.url === '/signin') {
      return true;
    } else {
      this.router.navigateByUrl('/signin');
      return false;
    }
  }
}
