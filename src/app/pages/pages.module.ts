import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { BlogModule } from '../blog/blog.module';

import { PagesComponent } from './pages.component';
import { PagesLoginComponent } from './pages-login/pages-login.component';
import { PagesCreateAccountComponent } from './pages-create-account/pages-create-account.component';
import { PagesBillingInformationComponent } from './pages-billing-information/pages-billing-information.component';
import { PagesAboutComponent } from './pages-about/pages-about.component';
import { PagesSecurityComponent } from './pages-security/pages-security.component';
import { PagesPricingComponent } from './pages-pricing/pages-pricing.component';
import { PagesOnionComponent } from './pages-onion/pages-onion.component';
import { PagesDonateComponent } from './pages-donate/pages-donate.component';
import { PagesPrivacyComponent } from './pages-privacy/pages-privacy.component';
import { PagesMediaKitComponent } from './pages-media-kit/pages-media-kit.component';
import { PagesTermsComponent } from './pages-terms/pages-terms.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule,
    BlogModule
  ],
  declarations: [
    PagesComponent,
    PagesLoginComponent,
    PagesCreateAccountComponent,
    PagesBillingInformationComponent,
    PagesAboutComponent,
    PagesSecurityComponent,
    PagesPricingComponent,
    PagesOnionComponent,
    PagesDonateComponent,
    PagesPrivacyComponent,
    PagesMediaKitComponent,
    PagesTermsComponent]
})
export class PagesModule { }
