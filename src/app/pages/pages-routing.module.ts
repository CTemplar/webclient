// Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Components
import { PagesComponent } from "./pages.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { BillingComponent } from "./billing/billing.component";
import { DonateComponent } from "./donate/donate.component";
import { HomeComponent } from "./home/home.component";
import { MediaKitComponent } from "./media-kit/media-kit.component";
import { PostComponent } from "./post/post.component";
import { PostsComponent } from "./posts/posts.component";
import { PricingComponent } from "./pricing/pricing.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { SecurityComponent } from "./security/security.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { SignOutComponent } from "./sign-out/sign-out.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SignUpNextComponent } from "./sign-up/sign-up-next.component";
import { TermsComponent } from "./terms/terms.component";
import { TorOnionComponent } from "./tor-onion/tor-onion.component";

// Guards
import { AuthGuard, NotAuthGuard } from "../app-store/guards";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      { path: "", component: HomeComponent },
      { path: "about-us", component: AboutUsComponent },
      { path: "blog", component: PostsComponent },
      { path: "blog/:slug", component: PostComponent },
      { path: "donate", component: DonateComponent },
      { path: "media-kit", component: MediaKitComponent },
      { path: "pricing", component: PricingComponent },
      { path: "privacy", component: PrivacyComponent },
      { path: "security", component: SecurityComponent },
      {
        path: "sign-in",
        canActivate: [NotAuthGuard],
        component: SignInComponent
      },
      {
        path: "sign-out",
        canActivate: [AuthGuard],
        component: SignOutComponent
      },
      {
        path: "sign-up",
        canActivate: [NotAuthGuard],
        component: SignUpComponent
      },
      {
        path: "sign-up/billing",
        canActivate: [NotAuthGuard],
        component: BillingComponent
      },
      {
        path: "sign-up/next",
        canActivate: [NotAuthGuard],
        component: SignUpNextComponent
      },
      { path: "terms", component: TermsComponent },
      { path: "tor-onion", component: TorOnionComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
