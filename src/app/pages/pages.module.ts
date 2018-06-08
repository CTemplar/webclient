// Angular
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

// Modules
import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from "../shared/shared.module";

// Components
import { PagesComponent } from "./pages.component";
import { PagesAboutComponent } from "./pages-about/pages-about.component";
import { PagesDonateComponent } from "./pages-donate/pages-donate.component";
import { PagesFooterComponent } from "./pages-footer/pages-footer.component";
import { PagesHeaderComponent } from "./pages-header/pages-header.component";
import { PagesHomeComponent } from "./pages-home/pages-home.component";
import { PagesMediaKitComponent } from "./pages-media-kit/pages-media-kit.component";
import { PagesPostComponent } from "./pages-post/pages-post.component";
import { PagesPostsComponent } from "./pages-posts/pages-posts.component";
import { PagesPostsGridComponent } from "./shared/pages-posts-grid/pages-posts-grid.component";
import { PagesPricingComponent } from "./pages-pricing/pages-pricing.component";
import { PagesPrivacyComponent } from "./pages-privacy/pages-privacy.component";
import { PagesSecurityComponent } from "./pages-security/pages-security.component";
import { PagesSignInComponent } from "./pages-sign-in/pages-sign-in.component";
import { PagesSignUpComponent } from "./pages-sign-up/pages-sign-up.component";
import { PagesTermsComponent } from "./pages-terms/pages-terms.component";
import { PagesTorOnionComponent } from "./pages-tor-onion/pages-tor-onion.component";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@NgModule({
  imports: [CommonModule, PagesRoutingModule, SharedModule],
  declarations: [
    PagesComponent,
    PagesAboutComponent,
    PagesDonateComponent,
    PagesFooterComponent,
    PagesHeaderComponent,
    PagesHomeComponent,
    PagesMediaKitComponent,
    PagesPostComponent,
    PagesPostsComponent,
    PagesPostsGridComponent,
    PagesPricingComponent,
    PagesPrivacyComponent,
    PagesSecurityComponent,
    PagesSignInComponent,
    PagesSignUpComponent,
    PagesTermsComponent,
    PagesTorOnionComponent
  ]
})
export class PagesModule {}
