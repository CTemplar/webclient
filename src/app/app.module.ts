import { MatButtonModule } from '@angular/material';
// Angular
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatKeyboardModule } from 'ngx7-material-keyboard';
// Components
import { AppComponent } from './app.component';
// Modules
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { PagesModule } from './pages/pages.module';
import { DateTimeUtilService } from './store/services/datetime-util.service';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { AppStoreModule } from './store/store.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
// Services
import { AuthGuard, BitcoinService, MailService, OpenPgpService, SharedService, TokenInterceptor } from './store/services';
import { NotificationService } from './store/services/notification.service';
import { BreakpointsService } from './store/services/breakpoint.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TimezoneService } from './store/services/timezone.service';
import { DonationService } from './store/services/donation.service';
import { AppRoutingModule } from './app-routing.module';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    SharedModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    AppStoreModule,
    FooterModule,
    HeaderModule,
    HomeModule,
    PagesModule,
    UsersModule,
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
