// == Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MailRoutingModule } from './mail-routing.module';
import { MailComponent } from './mail.component';
import { MailFooterComponent } from './mail-footer/mail-footer.component';
import { MailHeaderComponent } from './mail-header/mail-header.component';
import { MailSettingsComponent } from './mail-settings/mail-settings.component';
import { MailSidebarComponent } from './mail-sidebar/mail-sidebar.component';
import { MailDetailComponent } from './mail-detail/mail-detail.component';
import { MailListComponent } from './mail-list/mail-list.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    MailRoutingModule
  ],
  declarations: [MailComponent, MailFooterComponent, MailHeaderComponent, MailSettingsComponent, MailSidebarComponent, MailDetailComponent, MailListComponent],
  exports: [MailFooterComponent]
})
export class MailModule { }
