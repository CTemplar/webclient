// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Bootstrap
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
// Service
import { UsersService } from '../store/services';
import { TranslateModule } from '@ngx-translate/core';
import { ReplySecureMessageComponent } from './reply-secure-message/reply-secure-message.component';
import { UserAccountInitDialogComponent } from './dialogs/user-account-init-dialog/user-account-init-dialog.component';
import { DisplayNameDialogComponent } from './dialogs/display-name-dialog/display-name-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbModalModule,
    UsersRoutingModule,
    SharedModule,
    TranslateModule
  ],
  exports: [UsersRoutingModule],
  declarations: [
    UsersSignInComponent,
    UsersSignUpComponent,
    UsersCreateAccountComponent,
    DisplaySecureMessageComponent,
    DecryptMessageComponent,
    ReplySecureMessageComponent,
    UserAccountInitDialogComponent,
    DisplayNameDialogComponent
  ],
  entryComponents: [
    UserAccountInitDialogComponent,
    DisplayNameDialogComponent,
  ],
  providers: [UsersService]
})
export class UsersModule {
}
