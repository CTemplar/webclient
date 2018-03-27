import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { PagesLoginComponent } from './pages-login/pages-login.component';
import { PagesCreateAccountComponent } from './pages-create-account/pages-create-account.component';
import { PagesBillingInformationComponent } from './pages-billing-information/pages-billing-information.component';
import { PagesAccountTypeComponent } from './pages-account-type/pages-account-type.component';
import { PagesAboutComponent } from './pages-about/pages-about.component';
import { PagesDonateComponent } from './pages-donate/pages-donate.component';
import { PagesMediaKitComponent } from './pages-media-kit/pages-media-kit.component';
import { PagesOnionComponent } from './pages-onion/pages-onion.component';
import { PagesPricingComponent } from './pages-pricing/pages-pricing.component';
import { PagesPrivacyComponent } from './pages-privacy/pages-privacy.component';
import { PagesSecurityComponent } from './pages-security/pages-security.component';
import { PagesTermsComponent } from './pages-terms/pages-terms.component';

const routes: Routes = [
  { path: "text-page", component: PagesComponent },
  { path: "login", component: PagesLoginComponent },
  { path: "create-account", component: PagesCreateAccountComponent },
  { path: "billing-information", component: PagesBillingInformationComponent },
  { path: "account-type", component: PagesAccountTypeComponent },
  { path: "about", component: PagesAboutComponent },
  { path: "donate", component: PagesDonateComponent },
  { path: "media-kit", component: PagesMediaKitComponent },
  { path: "onion", component: PagesOnionComponent },
  { path: "pricing", component: PagesPricingComponent },
  { path: "privacy", component: PagesPrivacyComponent },
  { path: "security", component: PagesSecurityComponent },
  { path: "terms", component: PagesTermsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
