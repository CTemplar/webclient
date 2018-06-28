// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Custom Module
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../shared/shared.module';

// Component
import { UsersSignInComponent } from './users-sign-in/users-sign-in.component';
import { UsersSignUpComponent } from './users-sign-up/users-sign-up.component';
import { UsersCreateAccountComponent } from './users-create-account/users-create-account.component';
import { UsersBillingInfoComponent } from './users-billing-info/users-billing-info.component';
import { SecureMessageComponent } from './secure-message/secure-message.component';
import { DecryptComponent } from './decrypt/decrypt.component';

// Module
import { PagesModule } from '../pages/pages.module';

// Service
import { UsersService } from '../store/services';
import {
  RecaptchaModule,
  RECAPTCHA_SETTINGS,
  RecaptchaSettings
} from 'ng-recaptcha';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UsersRoutingModule,
    PagesModule,
    SharedModule,
    // Material modules
    MatButtonModule,
    RecaptchaModule.forRoot()
  ],
  declarations: [
    UsersSignInComponent,
    UsersSignUpComponent,
    UsersCreateAccountComponent,
    UsersBillingInfoComponent,
    SecureMessageComponent,
    DecryptComponent
  ],
  providers: [UsersService,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LdGCFoUAAAAAFz-kzOkmvdBKtC6lyoanpnCTpzp'
      } as RecaptchaSettings,

    }]
})
export class UsersModule {
}
