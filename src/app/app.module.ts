// Angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule, ErrorHandler, Injectable } from '@angular/core';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { AppComponent } from './app.component';

// Modules
import { AppStoreModule } from './store/store.module';
import { DateTimeUtilService } from './store/services/datetime-util.service';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import * as Sentry from '@sentry/browser';

// Services
import { AuthGuard, BitcoinService, MailService, OpenPgpService, SharedService, TokenInterceptor } from './store/services';
import { BreakpointsService } from './store/services/breakpoint.service';
import { DonationService } from './store/services/donation.service';
import { MailModule } from './mail/mail.module';
import { NotificationService } from './store/services/notification.service';
import { PagesModule } from './pages/pages.module';
import { TimezoneService } from './store/services/timezone.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() { }
  handleError(error) {
    Sentry.captureException(error.originalError || error);
    // Sentry.showReportDialog({ eventId });
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    SharedModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    AppStoreModule,
    FooterModule,
    HeaderModule,
    UsersModule,
    MailModule,
    PagesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    // Material modules
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
  ],
  providers: [
    AuthGuard,
    SharedService,
    OpenPgpService,
    BitcoinService,
    NotificationService,
    BreakpointsService,
    TimezoneService,
    MailService,
    DateTimeUtilService,
    DonationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: SentryErrorHandler
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
