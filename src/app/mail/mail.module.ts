import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MailRoutingModule } from './mail-routing.module';
import { MailComponent } from './mail.component';
import { MailSidebarComponent } from './mail-sidebar/mail-sidebar.component';
import { MailHeaderComponent } from './mail-header/mail-header.component';
import { MailFooterComponent } from './mail-footer/mail-footer.component';
import { MailListComponent } from './mail-list/mail-list.component';
import { MailDetailComponent } from './mail-detail/mail-detail.component';
import { MailSettingsComponent } from './mail-settings/mail-settings.component';

import { SuiDropdownModule, SuiRatingModule } from 'ng2-semantic-ui';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MailRoutingModule,
    SuiDropdownModule,
    SuiRatingModule,
  ],
  declarations: [
    MailComponent,
    MailSidebarComponent,
    MailHeaderComponent,
    MailFooterComponent,
    MailListComponent,
    MailDetailComponent,
    MailSettingsComponent
  ]
})
export class MailModule {}
