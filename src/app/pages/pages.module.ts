// Angular
import { NgModule } from "@angular/core";

// Modules
import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from "../shared/shared.module";

// Components
import { CaptchaModal, DialogModal, ProgressModal, RecoverModal, ResetModal } from "../shared/modals";
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
import { PagesSignOutComponent } from "./pages-sign-out/pages-sign-out.component";
import { PagesSignUpLastComponent } from "./pages-sign-up/pages-sign-up-last.component";
import { PagesSignUpComponent } from "./pages-sign-up/pages-sign-up.component";
import { PagesSignUpNextComponent } from "./pages-sign-up/pages-sign-up-next.component";
import { PagesTermsComponent } from "./pages-terms/pages-terms.component";
import { PagesTorOnionComponent } from "./pages-tor-onion/pages-tor-onion.component";
import { DecryptComponent } from "./decrypt/decrypt.component";
import { SecureMessageComponent } from "./secure-message/secure-message.component";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@NgModule({
  imports: [PagesRoutingModule, SharedModule],
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
    PagesSignOutComponent,
    PagesSignUpLastComponent,
    PagesSignUpComponent,
    PagesSignUpNextComponent,
    PagesTermsComponent,
    PagesTorOnionComponent,
    DecryptComponent,
    SecureMessageComponent
  ],
  entryComponents: [
    CaptchaModal,
    DialogModal,
    ProgressModal,
    RecoverModal,
    ResetModal
  ]
})
export class PagesModule {}
