import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { QuillModule } from 'ngx-quill';

import { SharedModule } from '../shared/shared.module';
import { ComposeMailService } from '../store/services/compose-mail.service';
import { MailSettingsService } from '../store/services/mail-settings.service';
import { PushNotificationService } from '../shared/services/push-notification.service';
import { WebsocketService } from '../shared/services/websocket.service';

import { AddressesSignatureComponent } from './mail-settings/addresses-signature/addresses-signature.component';
import { ComposeMailComponent } from './mail-sidebar/compose-mail/compose-mail.component';
import { ComposeMailDialogComponent } from './mail-sidebar/compose-mail-dialog/compose-mail-dialog.component';
import { CustomDomainsComponent } from './mail-settings/custom-domains/custom-domains.component';
import { FoldersComponent } from './mail-settings/folders/folders.component';
import { GenericFolderComponent } from './mail-list/mail-folder/generic-folder/generic-folder.component';
import { InviteCodesComponent } from './mail-settings/invite-codes/invite-codes.component';
import { MailAutoresponderComponent } from './mail-settings/mail-autoresponder/mail-autoresponder.component';
import { MailComponent } from './mail.component';
import { MailContactComponent } from './mail-contact/mail-contact.component';
import { MailDetailComponent } from './mail-detail/mail-detail.component';
import { MailFiltersComponent } from './mail-settings/mail-filters/mail-filters.component';
import { MailFooterComponent } from './mail-footer/mail-footer.component';
import { MailForwardingComponent } from './mail-settings/mail-forwarding/mail-forwarding.component';
import { MailHeaderComponent } from './mail-header/mail-header.component';
import { MailListComponent } from './mail-list/mail-list.component';
import { MailSettingsComponent } from './mail-settings/mail-settings.component';
import { MailSidebarComponent } from './mail-sidebar/mail-sidebar.component';
import { OrganizationUsersComponent } from './mail-settings/organization/organization-users/organization-users.component';
import { SaveContactComponent } from './mail-contact/save-contact/save-contact.component';
import { SaveListContactComponent } from './mail-settings/save-list-contact/save-list-contact.component';
import { SecurityComponent } from './mail-settings/security/security.component';
import { MailRoutingModule } from './mail-routing.module';
import { MailDetailDecryptionErrorComponent } from './mail-detail/mail-detail-decryption-error/mail-detail-decryption-error.component';
import { MailDetailEncryptionTypeIconComponent } from './mail-detail/mail-detail-encryption-type-icon/mail-detail-encryption-type-icon.component';
import { ComposerReceiverIconComponent } from './mail-sidebar/compose-mail/composer-receiver-icon/composer-receiver-icon.component';

@NgModule({
  entryComponents: [ComposeMailDialogComponent],
  declarations: [
    AddressesSignatureComponent,
    ComposeMailComponent,
    ComposeMailDialogComponent,
    CustomDomainsComponent,
    FoldersComponent,
    GenericFolderComponent,
    InviteCodesComponent,
    MailAutoresponderComponent,
    MailComponent,
    MailContactComponent,
    MailDetailComponent,
    MailFiltersComponent,
    MailFooterComponent,
    MailForwardingComponent,
    MailHeaderComponent,
    MailListComponent,
    MailSettingsComponent,
    MailSidebarComponent,
    OrganizationUsersComponent,
    SaveContactComponent,
    SaveListContactComponent,
    SecurityComponent,
    MailDetailDecryptionErrorComponent,
    MailDetailEncryptionTypeIconComponent,
    ComposerReceiverIconComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MailRoutingModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    NgbModalModule,
    NgbModule,
    DragDropModule,
    QuillModule.forRoot(),
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [MailFooterComponent],
  providers: [MailSettingsService, ComposeMailService, WebsocketService, PushNotificationService],
})
export class MailModule {}
