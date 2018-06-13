// Angular
import { NgModule } from "@angular/core";

// Modules
import { PagesRoutingModule } from "./pages-routing.module";
import { SharedModule } from "../shared/shared.module";

// Components
import { PagesComponent } from "./pages.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { DecryptComponent } from "./decrypt/decrypt.component";
import { DonateComponent } from "./donate/donate.component";
import { HomeComponent } from "./home/home.component";
import { MediaKitComponent } from "./media-kit/media-kit.component";
import { PagesFooterComponent } from "./footer/footer.component";
import { PagesHeaderComponent } from "./header/header.component";
import { PostComponent } from "./post/post.component";
import { PostsComponent } from "./posts/posts.component";
import { PostsGridComponent } from "./posts-grid/posts-grid.component";
import { PricingComponent } from "./pricing/pricing.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { SecureMessageComponent } from "./secure-message/secure-message.component";
import { SecurityComponent } from "./security/security.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignOutComponent } from "./sign-out/sign-out.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SignUpLastComponent } from "./sign-up/sign-up-last.component";
import { SignUpNextComponent } from "./sign-up/sign-up-next.component";
import { TermsComponent } from "./terms/terms.component";
import { TorOnionComponent } from "./tor-onion/tor-onion.component";

// Modals
import {
  CaptchaModal,
  DialogModal,
  ProgressModal,
  RecoverModal,
  ResetModal
} from "../shared/modals";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@NgModule({
  imports: [PagesRoutingModule, SharedModule],
  declarations: [
    PagesComponent,
    AboutUsComponent,
    DecryptComponent,
    DonateComponent,
    HomeComponent,
    MediaKitComponent,
    PagesFooterComponent,
    PagesHeaderComponent,
    PostComponent,
    PostsComponent,
    PostsGridComponent,
    PricingComponent,
    PrivacyComponent,
    SecureMessageComponent,
    SecurityComponent,
    SignInComponent,
    SignOutComponent,
    SignUpComponent,
    SignUpLastComponent,
    SignUpNextComponent,
    TermsComponent,
    TorOnionComponent
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
