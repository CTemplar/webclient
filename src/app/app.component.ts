import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SharedService } from './store/services';
// import { UsersService } from './users/shared/users.service';
import { AppState, AuthState, LoadingState } from './store/datatypes';
import { quotes } from './store/quotes';
import { FinalLoading } from './store/actions';
import { PROMO_CODE_KEY, REFFERAL_CODE_KEY, REFFERAL_ID_KEY } from './shared/config';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public hideFooter = false;

  public hideHeader = false;

  public windowIsResized = false;

  public isLoading = true;

  public isMail = false;

  quote: object;

  isAuthenticated: boolean;

  constructor(
    public router: Router,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private translate: TranslateService,
  ) {
    // this.store.dispatch(new RefreshToken());
    this.store.dispatch(new FinalLoading({ loadingState: true }));
    this.sharedService.hideHeader.subscribe(data => (this.hideHeader = data));
    this.sharedService.hideFooter.subscribe(data => (this.hideFooter = data));
    this.sharedService.isMail.subscribe(data => (this.isMail = data));

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
  }

  ngOnInit() {
    this.quote = quotes[Math.floor(Math.random() * quotes.length)];
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

  ngOnDestroy(): void {}
}
