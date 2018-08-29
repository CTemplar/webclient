// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Custom Module
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../shared/shared.module';

// Component
import { UsersSignInComponent } from './users-sign-in/users-sign-in.component';
import { UsersSignUpComponent } from './users-sign-up/users-sign-up.component';
import { UsersCreateAccountComponent } from './users-create-account/users-create-account.component';
import { DisplaySecureMessageComponent } from './display-secure-message/display-secure-message.component';
import { DecryptMessageComponent } from './decrypt/decrypt-message.component';

// Module
import { PagesModule } from '../pages/pages.module';

// Service
import { UsersService } from '../store/services';
import {
  RecaptchaModule,
  RECAPTCHA_SETTINGS,
  RecaptchaSettings
} from 'ng-recaptcha';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UsersRoutingModule,
    PagesModule,
    SharedModule,
    RecaptchaModule.forRoot(),
    TranslateModule
  ],
  declarations: [
    UsersSignInComponent,
    UsersSignUpComponent,
    UsersCreateAccountComponent,
    DisplaySecureMessageComponent,
    DecryptMessageComponent
  ],
  providers: [UsersService,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: '6LdNHVoUAAAAAMUa9BYB-hqOkCH2n9aaT_iZL8Ma'
      } as RecaptchaSettings,

    }]
})
export class UsersModule {
}
