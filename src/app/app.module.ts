import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CookieLawModule } from 'angular2-cookie-law';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { NgxMatomoRouterModule } from '@ngx-matomo/router';

import { AppComponent } from './app.component';
import { AppStoreModule } from './store/store.module';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { MailModule } from './mail/mail.module';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import {
  AuthGuard,
  BitcoinService,
  MailService,
  OpenPgpService,
  SharedService,
  TokenInterceptor,
  CancelPendingRequestInterceptor,
  MessageBuilderService,
  MessageDecryptService,
  AutocryptProcessService,
  ElectronService,
  DonationService,
} from './store/services';
import { BreakpointsService } from './store/services/breakpoint.service';
import { DateTimeUtilService } from './store/services/datetime-util.service';
import { NotificationService } from './store/services/notification.service';
import { TimezoneService } from './store/services/timezone.service';
import { errorHandlerFactory } from './app.error-handler';
import { getMatomoSiteID, getMatomoUrl, isMatomoEnabled } from './shared/config';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppStoreModule,
    BrowserAnimationsModule,
    BrowserModule,
    FooterModule,
    HeaderModule,
    HttpClientModule,
    MailModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    NgbModule,
    PagesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharedModule,
    UsersModule,
    CookieLawModule,
    CKEditorModule,
    NgxMatomoTrackerModule.forRoot({
      siteId: getMatomoSiteID(),
      trackerUrl: getMatomoUrl(),
      trackAppInitialLoad: true,
      disabled: !isMatomoEnabled(),
    }),
    NgxMatomoRouterModule,
  ],
  providers: [
    AuthGuard,
    BitcoinService,
    BreakpointsService,
    DateTimeUtilService,
    DonationService,
    MailService,
    NotificationService,
    OpenPgpService,
    SharedService,
    TimezoneService,
    MessageBuilderService,
    MessageDecryptService,
    AutocryptProcessService,
    ElectronService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CancelPendingRequestInterceptor, multi: true },
    { provide: ErrorHandler, useFactory: errorHandlerFactory, deps: [] },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
