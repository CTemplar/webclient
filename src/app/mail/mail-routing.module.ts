import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { MailComponent } from './mail.component';
import { MailSettingsComponent } from './mail-settings/mail-settings.component';
import { MailDetailComponent } from './mail-detail/mail-detail.component';
import { MailListComponent } from './mail-list/mail-list.component';
import { MailContactComponent } from './mail-contact/mail-contact.component';
import { AuthGuard } from '../store/services';

const routes: Routes = [
  {
    path: '', component: MailComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'inbox/page/1', pathMatch: 'full' },
      { path: 'settings', component: MailSettingsComponent },
      { path: 'contact', component: MailContactComponent },
      { path: ':folder/page/:page', component: MailListComponent },
      { path: ':folder/page/:page/message/:id', component: MailDetailComponent },
    ]
  },
  { path: '', redirectTo: 'inbox/page/1', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailRoutingModule {
}
