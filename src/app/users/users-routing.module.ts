// Angular

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { UsersSignInComponent } from './users-sign-in/users-sign-in.component';
import { UsersSignUpComponent } from './users-sign-up/users-sign-up.component';
import { UsersCreateAccountComponent } from './users-create-account/users-create-account.component';
import { UsersBillingInfoComponent } from '../shared/components/users-billing-info/users-billing-info.component';
import { SecureMessageComponent } from './secure-message/secure-message.component';
import { DecryptComponent } from './decrypt/decrypt.component';
import { AuthGuard } from '../store/services';

const routes: Routes = [
  { path: 'signin', component: UsersSignInComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: UsersSignUpComponent },
  { path: 'create-account', component: UsersCreateAccountComponent },
  { path: 'billing-info', component: UsersBillingInfoComponent },
  { path: 'secure-message', component: SecureMessageComponent },
  { path: 'decrypt', component: DecryptComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
