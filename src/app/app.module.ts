import { MatButtonModule } from '@angular/material';

// Angular
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatKeyboardModule } from '@ngx-material-keyboard/core';

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
import { DateTimeUtilService } from './store/services/datetime-util.service';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { AppStoreModule } from './store/store.module';
import {
  ngxZendeskWebwidgetModule,
  ngxZendeskWebwidgetConfig
} from 'ngx-zendesk-webwidget';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

export class ZendeskConfig extends ngxZendeskWebwidgetConfig {
  accountUrl = 'ctemplar.zendesk.com';

  beforePageLoad(zE) {
    zE.setLocale('en');
    zE.hide();
  }
}

// Services
import {AuthGuard, BitcoinService, BlogService} from './store/services';
import { MailService } from './store/services';
import { SharedService } from './store/services';
import { OpenPgpService } from './store/services';

import { TokenInterceptor } from './store/services';
import { NotificationService } from './store/services/notification.service';
import { BreakpointsService } from './store/services/breakpoint.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TimezoneService } from './store/services/timezone.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    // Material modules
    MatButtonModule,
    MatKeyboardModule,
    MatSnackBarModule,
    MatIconModule
  ],
  providers: [
    AuthGuard,
    BlogService,
    SharedService,
    OpenPgpService,
    BitcoinService,
    NotificationService,
    BreakpointsService,
    TimezoneService,
    MailService,
    DateTimeUtilService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
