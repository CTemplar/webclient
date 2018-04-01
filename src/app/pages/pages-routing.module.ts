// == Angular modules

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesAboutComponent } from './pages-about/pages-about.component';
import { PagesSecurityComponent } from './pages-security/pages-security.component';
import { PagesDonateComponent } from './pages-donate/pages-donate.component';
import { PagesPricingComponent } from './pages-pricing/pages-pricing.component';

const routes: Routes = [
  { path: 'about', component: PagesAboutComponent },
  { path: 'security', component: PagesSecurityComponent },
  { path: 'donate', component: PagesDonateComponent },
  { path: 'pricing', component: PagesPricingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
