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

import { SuiDropdownModule, SuiRatingModule, SuiSelectModule } from 'ng2-semantic-ui';

// Modals
import { AddFolderComponent } from './mail-sidebar/modals/add-folder/add-folder.component';
import { AddLabelComponent } from './mail-sidebar/modals/add-label/add-label.component';
import { BlacklistComponent } from './mail-settings/modals/blacklist/blacklist.component';
import { CustomFilterComponent } from './mail-settings/modals/custom-filter/custom-filter.component';
import { MakeADonationComponent } from './mail-settings/modals/make-a-donation/make-a-donation.component';
import { PaymentMethodComponent } from './mail-settings/modals/payment-method/payment-method.component';
import { WhitelistComponent } from './mail-settings/modals/whitelist/whitelist.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    MailRoutingModule,
    SuiDropdownModule,
    SuiRatingModule,
    SuiSelectModule,
  ],
  declarations: [
    MailComponent,
    MailSidebarComponent,
    MailHeaderComponent,
    MailFooterComponent,
    MailListComponent,
    MailDetailComponent,
    MailSettingsComponent,
    AddFolderComponent,
    AddLabelComponent,
    BlacklistComponent,
    CustomFilterComponent,
    MakeADonationComponent,
    PaymentMethodComponent,
    WhitelistComponent,
  ],
  entryComponents: [
    AddFolderComponent,
    AddLabelComponent,
    BlacklistComponent,
    CustomFilterComponent,
    MakeADonationComponent,
    PaymentMethodComponent,
    WhitelistComponent,
  ]
})
export class MailModule {}
