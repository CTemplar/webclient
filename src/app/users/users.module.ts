import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UsersRoutingModule } from './users-routing.module';
import { UsersSignInComponent } from './users-sign-in/users-sign-in.component';
import { UsersSignUpComponent } from './users-sign-up/users-sign-up.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    UsersRoutingModule
  ],
  declarations: [UsersSignInComponent, UsersSignUpComponent]
})
export class UsersModule { }
