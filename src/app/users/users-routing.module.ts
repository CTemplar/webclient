// == Angular

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersSignInComponent } from './users-sign-in/users-sign-in.component';
import { UsersSignUpComponent } from './users-sign-up/users-sign-up.component';

const routes: Routes = [
  { path: 'signup', component: UsersSignUpComponent },
  { path: 'signin', component: UsersSignInComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
