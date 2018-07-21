// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricingPlansComponent } from 'app/shared/components/pricing-plans/pricing-plans.component';

// Components
import { PagesAboutComponent } from './pages-about/pages-about.component';
import { PagesDonateComponent } from './pages-donate/pages-donate.component';
import { PagesMediaKitComponent } from './pages-media-kit/pages-media-kit.component';
import { PagesPrivacyComponent } from './pages-privacy/pages-privacy.component';
import { PagesSecurityComponent } from './pages-security/pages-security.component';
import { PagesTermsComponent } from './pages-terms/pages-terms.component';
import { PagesTorOnionComponent } from './pages-tor-onion/pages-tor-onion.component';

const routes: Routes = [
  { path: 'about', component: PagesAboutComponent },
  { path: 'donate', component: PagesDonateComponent },
  { path: 'pricing', component: PricingPlansComponent },
  { path: 'security', component: PagesSecurityComponent },
  { path: 'media-kit', component: PagesMediaKitComponent },
  { path: 'tor-onion', component: PagesTorOnionComponent },
  { path: 'privacy', component: PagesPrivacyComponent },
  { path: 'terms', component: PagesTermsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
