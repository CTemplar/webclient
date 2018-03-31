// == Angular modules

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesAboutComponent } from './pages-about/pages-about.component';
import { PagesSecurityComponent } from './pages-security/pages-security.component';

const routes: Routes = [
  { path: 'about', component: PagesAboutComponent },
  { path: 'security', component: PagesSecurityComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
