// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Components
import { DecryptMessageComponent } from './decrypt/decrypt-message.component';
import { DisplaySecureMessageComponent } from './display-secure-message/display-secure-message.component';
import { UsersCreateAccountComponent } from './users-create-account/users-create-account.component';
import { UsersSignInComponent } from './users-sign-in/users-sign-in.component';
import { UsersSignUpComponent } from './users-sign-up/users-sign-up.component';

// Modules
import { SharedModule } from '../shared/shared.module';
import { UsersRoutingModule } from './users-routing.module';

// Services
import { DisplayNameDialogComponent } from './dialogs/display-name-dialog/display-name-dialog.component';
import { ReplySecureMessageComponent } from './reply-secure-message/reply-secure-message.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserAccountInitDialogComponent } from './dialogs/user-account-init-dialog/user-account-init-dialog.component';
import { UsersService } from '../store/services';

// Third-party
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  entryComponents: [DisplayNameDialogComponent, UserAccountInitDialogComponent],
  declarations: [
    DecryptMessageComponent,
    DisplayNameDialogComponent,
    DisplaySecureMessageComponent,
    ReplySecureMessageComponent,
    UserAccountInitDialogComponent,
    UsersCreateAccountComponent,
    UsersSignInComponent,
    UsersSignUpComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    UsersRoutingModule
  ],
  exports: [UsersRoutingModule],
  providers: [UsersService]
})
export class UsersModule {}
