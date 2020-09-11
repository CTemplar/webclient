import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../store/services';

import { MailComponent } from './mail.component';
import { MailSettingsComponent } from './mail-settings/mail-settings.component';
import { MailDetailComponent } from './mail-detail/mail-detail.component';
import { MailListComponent } from './mail-list/mail-list.component';
import { MailContactComponent } from './mail-contact/mail-contact.component';

const routes: Routes = [
  {
    path: 'mail',
    component: MailComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'inbox/page/1', pathMatch: 'full' },
      { path: 'settings', component: MailSettingsComponent },
      { path: 'settings/:id', component: MailSettingsComponent },
      { path: 'contacts', component: MailContactComponent },
      { path: ':folder/page/:page', component: MailListComponent },
      { path: ':folder/page/:page/message/:id', component: MailDetailComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MailRoutingModule {}
