// Angular
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { AppComponent } from './app.component';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { BlogModule } from './blog/blog.module';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { MailModule } from './mail/mail.module';
import { PagesModule } from './pages/pages.module';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { AppStoreModule } from './store/store.module';
import {
  ngxZendeskWebwidgetModule,
  ngxZendeskWebwidgetConfig
} from 'ngx-zendesk-webwidget';


export class ZendeskConfig extends ngxZendeskWebwidgetConfig {
  accountUrl = 'ctemplar.zendesk.com';
  beforePageLoad(zE) {
    zE.setLocale('en');
    zE.hide();
  }
}
// Services
import { BlogService } from './store/services';
import { MailService } from './store/services';
import { SharedService } from './store/services';
import { OpenPgpService } from './store/services';

import { TokenInterceptor } from './store/services';
import { ToastrModule } from 'ngx-toastr';
import { NotificationService } from './store/services/notification.service';


@NgModule({
  declarations: [AppComponent],
  imports: [
    SharedModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    AppStoreModule,
    AppRoutingModule,
    BlogModule,
    FooterModule,
    HeaderModule,
    HomeModule,
    MailModule,
    PagesModule,
    UsersModule,
    ngxZendeskWebwidgetModule.forRoot(ZendeskConfig),
    ToastrModule.forRoot(),
  ],
  providers: [
    BlogService,
    SharedService,
    OpenPgpService,
    NotificationService,
    MailService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
