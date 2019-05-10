// == Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Bootstrap
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Angular Material
import { MatButtonModule, MatCheckboxModule, MatStepperModule } from '@angular/material';

import { MailRoutingModule } from './mail-routing.module';
// component
import { MailComponent } from './mail.component';
import { MailFooterComponent } from './mail-footer/mail-footer.component';
import { MailHeaderComponent } from './mail-header/mail-header.component';
import { MailSettingsComponent } from './mail-settings/mail-settings.component';
import { MailSidebarComponent } from './mail-sidebar/mail-sidebar.component';
import { MailDetailComponent } from './mail-detail/mail-detail.component';
import { MailListComponent } from './mail-list/mail-list.component';
import { MailContactComponent } from './mail-contact/mail-contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Custom Pipe
import { SaveContactComponent } from './mail-contact/save-contact/save-contact.component';
import { SharedModule } from '../shared/shared.module';
import { SaveListContactComponent } from './mail-settings/save-list-contact/save-list-contact.component';
import { ComposeMailComponent } from './mail-sidebar/compose-mail/compose-mail.component';
import { ComposeMailDialogComponent } from './mail-sidebar/compose-mail-dialog/compose-mail-dialog.component';
import { GenericFolderComponent } from './mail-list/mail-folder/generic-folder/generic-folder.component';
import { MailFiltersComponent } from './mail-settings/mail-filters/mail-filters.component';
import { CustomDomainsComponent } from './mail-settings/custom-domains/custom-domains.component';
import { PaymentFailureNoticeComponent } from './dialogs/payment-failure-notice/payment-failure-notice.component';
import { AddressesSignatureComponent } from './mail-settings/addresses-signature/addresses-signature.component';
import { MailForwardingComponent } from './mail-settings/mail-forwarding/mail-forwarding.component';
import { FoldersComponent } from './mail-settings/folders/folders.component';
import { MailAutoresponderComponent } from './mail-settings/mail-autoresponder/mail-autoresponder.component';
import { SecurityComponent } from './mail-settings/security/security.component';
import { MailSettingsService } from '../store/services/mail-settings.service';
import { ComposeMailService } from '../store/services/compose-mail.service';
import { WebsocketService } from '../shared/services/websocket.service';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    NgbModalModule,
    MailRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatStepperModule,
  ],
  declarations: [
    MailComponent,
    MailFooterComponent,
    MailHeaderComponent,
    MailSettingsComponent,
    MailSidebarComponent,
    MailDetailComponent,
    MailListComponent,
    MailContactComponent,
    SaveContactComponent,
    ComposeMailDialogComponent,
    SaveListContactComponent,
    ComposeMailComponent,
    GenericFolderComponent,
    MailFiltersComponent,
    CustomDomainsComponent,
    PaymentFailureNoticeComponent,
    AddressesSignatureComponent,
    MailForwardingComponent,
    FoldersComponent,
    MailAutoresponderComponent,
    SecurityComponent,
  ],
  exports: [
    MailFooterComponent
  ],
  providers: [
    MailSettingsService,
    ComposeMailService,
    WebsocketService,
  ],
  entryComponents: [
    ComposeMailDialogComponent,
    PaymentFailureNoticeComponent
  ]
})
export class MailModule {
}
