// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { MailComponent } from './mail.component'
import { MailDetailComponent } from './mail-detail/mail-detail.component'
import { MailListComponent } from './mail-list/mail-list.component'
import { MailSettingsComponent } from './mail-settings/mail-settings.component'

// Guards
import { AuthGuard } from '../users/shared/auth.guard';

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


const routes: Routes = [{
  path: 'mail', canActivate: [AuthGuard], component: MailComponent, children: [
    { path: '', redirectTo: 'inbox/page/1', pathMatch: 'full' },
    { path: ':folder', redirectTo: ':folder/page/1', pathMatch: 'full' },
    { path: ':folder/page/:page', component: MailListComponent },
    { path: 'message/:id', component: MailDetailComponent },
    { path: 'settings', component: MailSettingsComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailRoutingModule {}
