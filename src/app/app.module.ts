// Angular
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";

// Bootstrap
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// Components
import { AppComponent } from "./app.component";

// Modules
import { AppRoutingModule } from "./app-routing.module";
import { MailboxModule } from "./mailbox/mailbox.module";
import { PagesModule } from "./pages/pages.module";
import { SharedModule } from "./shared/shared.module";

// Ngxs
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsModule } from "@ngxs/store";
import { NgxsStoragePluginModule } from "@ngxs/storage-plugin";

// reCAPTCHA
import { RecaptchaModule } from "ng-recaptcha";

// States
import {
  AuthState,
  EmailsState,
  BlogState,
  LayoutState,
  UsersState
} from "./app-store/states";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MailboxModule,
    NgbModule.forRoot(),
    NgxsModule.forRoot([
      AuthState,
      BlogState,
      EmailsState,
      LayoutState,
      UsersState
    ]),
    NgxsStoragePluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(), // always the last plugin!
    PagesModule,
    RecaptchaModule.forRoot(),
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
