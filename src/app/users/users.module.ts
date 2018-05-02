// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// virtual keyboard module
import { MatKeyboardModule } from '@ngx-material-keyboard/core';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Custom Module
import { UsersRoutingModule } from './users-routing.module';

// Component
import { UsersSignInComponent } from './users-sign-in/users-sign-in.component';
import { UsersSignUpComponent } from './users-sign-up/users-sign-up.component';
import { UsersCreateAccountComponent } from './users-create-account/users-create-account.component';
import { UsersBillingInfoComponent } from './users-billing-info/users-billing-info.component';


// Service
import { UsersService } from '../providers/users.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    MatKeyboardModule,
    UsersRoutingModule
  ],
  declarations: [UsersSignInComponent, UsersSignUpComponent, UsersCreateAccountComponent, UsersBillingInfoComponent],
  providers: [ UsersService ]
})
export class UsersModule { }
