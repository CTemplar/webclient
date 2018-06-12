// Angular
import { NgModule } from "@angular/core";

// Modules
import { PagesRoutingModule } from "./routing.module";
import { SharedModule } from "../shared/shared.module";

// Components
import { CaptchaModal, DialogModal, ProgressModal, RecoverModal, ResetModal } from "../shared/modals";
import { PagesComponent } from "./pages.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { PagesDonateComponent } from "./donate/donate.component";
import { PagesFooterComponent } from "./footer/footer.component";
import { PagesHeaderComponent } from "./header/header.component";
import { HomeComponent } from "./home/home.component";
import { PagesMediaKitComponent } from "./media-kit/media-kit.component";
import { PagesPostComponent } from "./post/post.component";
import { PagesPostsComponent } from "./posts/posts.component";
import { PagesPostsGridComponent } from "./posts-grid/posts-grid.component";
import { PagesPricingComponent } from "./pricing/pricing.component";
import { PagesPrivacyComponent } from "./privacy/privacy.component";
import { PagesSecurityComponent } from "./security/security.component";
import { PagesSignInComponent } from "./sign-in/sign-in.component";
import { PagesSignOutComponent } from "./sign-out/sign-out.component";
import { PagesSignUpLastComponent } from "./sign-up/sign-up-last.component";
import { PagesSignUpComponent } from "./sign-up/sign-up.component";
import { PagesSignUpNextComponent } from "./sign-up/sign-up-next.component";
import { PagesTermsComponent } from "./terms/terms.component";
import { PagesTorOnionComponent } from "./tor-onion/tor-onion.component";
import { DecryptComponent } from "./decrypt/decrypt.component";
import { SecureMessageComponent } from "./secure-message/secure-message.component";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@NgModule({
  imports: [PagesRoutingModule, SharedModule],
  declarations: [
    PagesComponent,
    AboutUsComponent,
    PagesDonateComponent,
    PagesFooterComponent,
    PagesHeaderComponent,
    HomeComponent,
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
