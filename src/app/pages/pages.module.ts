// == Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// == Feature modules
import { PagesRoutingModule } from './pages-routing.module';
import { BlogModule } from '../blog/blog.module';
import { MailModule } from '../mail/mail.module';

// == Pages main component
import { PagesComponent } from './pages.component';
import { PagesAboutComponent } from './pages-about/pages-about.component';
import { PagesSecurityComponent } from './pages-security/pages-security.component';
import { PagesDonateComponent } from './pages-donate/pages-donate.component';
import { PagesPricingComponent } from './pages-pricing/pages-pricing.component';

@NgModule({
  imports: [
    CommonModule,
    PagesRoutingModule,
    BlogModule,
    MailModule
  ],
  declarations: [PagesComponent, PagesAboutComponent, PagesSecurityComponent, PagesDonateComponent, PagesPricingComponent]
})
export class PagesModule { }
