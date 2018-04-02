// Angular
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

// Services
// import { MailService } from '../mail/shared/mail.service'
// import { UsersService } from '../users/shared/users.service'

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Injectable()
export class LoadGuard implements CanActivate {
    constructor(
    // private mailService: MailService,
    // private usersService: UsersService,
  ) {}

  canActivate() {
    return true;
    // if(this.usersService.signedIn()) {
    //   this.usersService.verifyToken()
    //     .subscribe(
    //       _ => {
    //         // this.blogService.cache();
    //         this.mailService.cache();
    //         this.usersService.refreshToken().subscribe();
    //         return true;
    //       },
    //       error => this.usersService.signOut(),
    //     );
    // } else {
    //   return true
    // }
  }
}
