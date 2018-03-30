// == Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MailRoutingModule } from './mail-routing.module';
import { MailComponent } from './mail.component';
import { MailFooterComponent } from './mail-footer/mail-footer.component';

@NgModule({
  imports: [
    CommonModule,
    MailRoutingModule
  ],
  declarations: [MailComponent, MailFooterComponent],
  exports: [MailFooterComponent]
})
export class MailModule { }
