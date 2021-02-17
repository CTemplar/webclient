import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import * as Sentry from '@sentry/browser';

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
} from './store/services';
import { BreakpointsService } from './store/services/breakpoint.service';
import { DateTimeUtilService } from './store/services/datetime-util.service';
import { DonationService } from './store/services/donation.service';
import { NotificationService } from './store/services/notification.service';
import { TimezoneService } from './store/services/timezone.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}

  handleError(error: any) {
    Sentry.captureException(error.originalError || error);
    // Sentry.showReportDialog({ eventId });
  }
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
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CancelPendingRequestInterceptor, multi: true },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
