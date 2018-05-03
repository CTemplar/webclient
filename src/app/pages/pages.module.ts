// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Modules
import { PagesRoutingModule } from './pages-routing.module';
import { BlogModule } from '../blog/blog.module';
import { MailModule } from '../mail/mail.module';
import { SharedModule } from '../shared/shared.module';

// Components
import { PagesAboutComponent } from './pages-about/pages-about.component';
import { PagesDonateComponent } from './pages-donate/pages-donate.component';
import { PagesMediaKitComponent } from './pages-media-kit/pages-media-kit.component';
import { PagesPricingComponent } from './pages-pricing/pages-pricing.component';
import { PagesPrivacyComponent } from './pages-privacy/pages-privacy.component';
import { PagesSecurityComponent } from './pages-security/pages-security.component';
import { PagesTermsComponent } from './pages-terms/pages-terms.component';
import { PagesTorOnionComponent } from './pages-tor-onion/pages-tor-onion.component';


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    PagesRoutingModule,
    BlogModule,
    MailModule,
    SharedModule
  ],
  declarations: [
    PagesAboutComponent,
    PagesSecurityComponent,
    PagesDonateComponent,
    PagesPricingComponent,
    PagesMediaKitComponent,
    PagesTorOnionComponent,
    PagesPrivacyComponent,
    PagesTermsComponent
  ]
})
export class PagesModule { }
