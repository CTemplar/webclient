import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';
import { UsersService } from '../store/services';

import { DecryptMessageComponent } from './decrypt/decrypt-message.component';
import { DisplaySecureMessageComponent } from './display-secure-message/display-secure-message.component';
import { UsersCreateAccountComponent } from './users-create-account/users-create-account.component';
import { UsersSignInComponent } from './users-sign-in/users-sign-in.component';
import { UsersSignUpComponent } from './users-sign-up/users-sign-up.component';
import { UsersRoutingModule } from './users-routing.module';
import { DisplayNameDialogComponent } from './dialogs/display-name-dialog/display-name-dialog.component';
import { ReplySecureMessageComponent } from './reply-secure-message/reply-secure-message.component';
import { UserAccountInitDialogComponent } from './dialogs/user-account-init-dialog/user-account-init-dialog.component';
import { UseCacheDialogComponent } from './dialogs/use-cache-dialog/use-cache-dialog.component';

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
    UsersSignUpComponent,
    UseCacheDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    UsersRoutingModule,
  ],
  exports: [UsersRoutingModule],
  providers: [UsersService],
})
export class UsersModule {}
