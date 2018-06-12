// Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// Components
import { PagesComponent } from "./pages.component";
import { PagesAboutComponent } from "./pages-about/pages-about.component";
import { PagesDonateComponent } from "./pages-donate/pages-donate.component";
import { PagesHomeComponent } from "./pages-home/pages-home.component";
import { PagesMediaKitComponent } from "./pages-media-kit/pages-media-kit.component";
import { PagesPostComponent } from "./pages-post/pages-post.component";
import { PagesPostsComponent } from "./pages-posts/pages-posts.component";
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

// Guards
import { AuthGuard, NotAuthGuard } from "../app-store/guards";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      { path: "", component: PagesHomeComponent },
      { path: "about", component: PagesAboutComponent },
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
