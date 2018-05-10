// Angular
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

// Services
import { UsersService } from './users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usersService: UsersService,
  ) {}

  canActivate() {
    // return this.usersService.signedIn();
    return true;
  }
}
