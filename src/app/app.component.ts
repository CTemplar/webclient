import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';

import { SharedService, getCryptoRandom } from './store/services';
import { AppState, AuthState, LoadingState } from './store/datatypes';
import { quotes, QuoteType } from './store/quotes';
import { FinalLoading } from './store';
import { PROMO_CODE_KEY, REFFERAL_CODE_KEY, REFFERAL_ID_KEY } from './shared/config';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('cookieLaw') cookieLawEl: any;

  public windowIsResized = false;

  public isLoading = true;

  quote: QuoteType;

  isAuthenticated: boolean;

  cookieEnabled = true;

  isMailStaff = false;

  constructor(
    public router: Router,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private translate: TranslateService,
  ) {
    this.store.dispatch(new FinalLoading({ loadingState: true }));
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe((event: NavigationEnd) => {
        this.isMailStaff = !!event.url.includes('/mail');
      });

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
    setTimeout(() => {
      this.updateLoadingStatus();
      this.store.dispatch(new FinalLoading({ loadingState: false }));
    }, 3000);

    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe((parameters: any) => {
      if (parameters) {
        if (parameters.referral_code) {
          localStorage.setItem(REFFERAL_CODE_KEY, parameters.referral_code);
        }
        const refferalId = parameters[REFFERAL_ID_KEY] || parameters[REFFERAL_ID_KEY.toUpperCase()];
        if (refferalId) {
          localStorage.setItem(REFFERAL_ID_KEY, refferalId);
        }
        const promoCode = parameters[PROMO_CODE_KEY] || parameters[PROMO_CODE_KEY.toUpperCase()];
        if (promoCode) {
          localStorage.setItem(PROMO_CODE_KEY, promoCode);
        }
      }
    });
    this.checkCookie();
  }

  ngOnInit() {
    this.quote = quotes[Math.floor(getCryptoRandom() * quotes.length)];
    this.store
      .select((state: AppState) => state.auth)
      .pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        this.isAuthenticated = authState.isAuthenticated;
      });
  }

  private updateLoadingStatus(): void {
    this.store
      .select(state => state.loading)
      .pipe(untilDestroyed(this))
      .subscribe((loadingState: LoadingState) => {
        this.isLoading = loadingState.Loading;
      });
  }

  dismiss(): void {
    this.cookieLawEl.dismiss();
  }

  checkCookie() {
    let { cookieEnabled } = navigator;
    if (!cookieEnabled) {
      // Checking if cookie is absolutely disabled
      // eslint-disable-next-line unicorn/no-document-cookie
      document.cookie = 'testcookie';
      cookieEnabled = document.cookie.includes('testcookie');
    }
    this.cookieEnabled = cookieEnabled;
  }
}
