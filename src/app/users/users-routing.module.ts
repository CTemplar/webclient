// Angular

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { UsersSignInComponent } from './users-sign-in/users-sign-in.component';
import { UsersSignUpComponent } from './users-sign-up/users-sign-up.component';
import { UsersCreateAccountComponent } from './users-create-account/users-create-account.component';
import { UsersBillingInfoComponent } from '../shared/components/users-billing-info/users-billing-info.component';
import { DecryptMessageComponent } from './decrypt/decrypt-message.component';
import { AuthGuard } from '../store/services';

const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'signin', component: UsersSignInComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: UsersSignUpComponent },
  { path: 'create-account', component: UsersCreateAccountComponent },
  { path: 'billing-info', component: UsersBillingInfoComponent },
  { path: 'message/:hash/:secret/:senderId', component: DecryptMessageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
