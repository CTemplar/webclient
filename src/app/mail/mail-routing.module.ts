import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { MailComponent } from './mail.component';
import { MailSettingsComponent } from './mail-settings/mail-settings.component';
import { MailDetailComponent } from './mail-detail/mail-detail.component';
import { MailListComponent } from './mail-list/mail-list.component';

const routes: Routes = [
	{ path: 'mail', component: MailComponent, children: [
    { path: '', redirectTo: 'inbox/page/1', pathMatch: 'full' },
    { path: 'settings', component: MailSettingsComponent },
    { path: ':folder', redirectTo: ':folder/page/1', pathMatch: 'full' },
    { path: ':folder/page/:page', component: MailListComponent },
    { path: 'message/:id', component: MailDetailComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailRoutingModule { }
