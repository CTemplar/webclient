// Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Components
import { PagesComponent } from "./pages.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { PagesDonateComponent } from "./donate/donate.component";
import { HomeComponent } from "./home/home.component";
import { PagesMediaKitComponent } from "./media-kit/media-kit.component";
import { PagesPostComponent } from "./post/post.component";
import { PagesPostsComponent } from "./posts/posts.component";
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
      { path: "blog", component: PagesPostsComponent },
      { path: "blog/:slug", component: PagesPostComponent },
      { path: "donate", component: PagesDonateComponent },
      { path: "media-kit", component: PagesMediaKitComponent },
      { path: "pricing", component: PagesPricingComponent },
      { path: "privacy", component: PagesPrivacyComponent },
      { path: "security", component: PagesSecurityComponent },
      {
        path: "sign-in",
        canActivate: [NotAuthGuard],
        component: PagesSignInComponent
      },
      {
        path: "sign-out",
        canActivate: [AuthGuard],
        component: PagesSignOutComponent
      },
      {
        path: "sign-up/last",
        canActivate: [NotAuthGuard],
        component: PagesSignUpLastComponent
      },
      {
        path: "sign-up",
        canActivate: [NotAuthGuard],
        component: PagesSignUpComponent
      },
      {
        path: "sign-up/next",
        canActivate: [NotAuthGuard],
        component: PagesSignUpNextComponent
      },
      { path: "terms", component: PagesTermsComponent },
      { path: "tor-onion", component: PagesTorOnionComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
