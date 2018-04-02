// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Components
import { UsersSignInComponent } from './users-sign-in/users-sign-in.component';
import { UsersSignUpComponent } from './users-sign-up/users-sign-up.component';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    UsersSignInComponent,
    UsersSignUpComponent,
  ]
})
export class UsersModule { }
