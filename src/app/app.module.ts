// Angular
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

// States
import { AuthState, BlogState, LayoutState } from "./app-store/states";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    MailboxModule,
    NgbModule.forRoot(),
    NgxsModule.forRoot([AuthState, BlogState, LayoutState]),
    NgxsStoragePluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(), // always the last plugin!
    PagesModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
