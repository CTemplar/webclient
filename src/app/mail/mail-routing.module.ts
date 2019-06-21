import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { MailComponent } from './mail.component';
import { MailSettingsComponent } from './mail-settings/mail-settings.component';
import { MailDetailComponent } from './mail-detail/mail-detail.component';
import { MailListComponent } from './mail-list/mail-list.component';
import { MailContactComponent } from './mail-contact/mail-contact.component';
import { AuthGuard } from '../store/services';
import { MailAutoresponderComponent } from './mail-settings/mail-autoresponder/mail-autoresponder.component';

const routes: Routes = [
  {
    path: '', component: MailComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'inbox/page/1', pathMatch: 'full' },
      { path: 'settings', component: MailSettingsComponent },
      { path: 'settings/autoresponder', component: MailAutoresponderComponent },
      { path: 'contacts', component: MailContactComponent },
      { path: ':folder/page/:page', component: MailListComponent },
      { path: ':folder/page/:page/message/:id', component: MailDetailComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailRoutingModule {
}
