// == Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MailRoutingModule } from './mail-routing.module';

// component
import { MailComponent } from './mail.component';
import { MailFooterComponent } from './mail-footer/mail-footer.component';
import { MailHeaderComponent } from './mail-header/mail-header.component';
import { MailSettingsComponent } from './mail-settings/mail-settings.component';
import { MailSidebarComponent } from './mail-sidebar/mail-sidebar.component';
import { MailDetailComponent } from './mail-detail/mail-detail.component';
import { MailListComponent } from './mail-list/mail-list.component';

// Custom Pipe
import { DecryptPipe } from '../shared/pipes/decrypt.pipe';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    MailRoutingModule
  ],
  declarations: [
    MailComponent,
    MailFooterComponent,
    MailHeaderComponent,
    MailSettingsComponent,
    MailSidebarComponent,
    MailDetailComponent,
    MailListComponent,
    DecryptPipe
  ],
  exports: [MailFooterComponent]
})
export class MailModule { }
