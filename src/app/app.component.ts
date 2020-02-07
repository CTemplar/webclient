// Angular
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// Services
import { SharedService } from './store/services';
// import { UsersService } from './users/shared/users.service';
import { Store } from '@ngrx/store';
import { AppState, AuthState, LoadingState } from './store/datatypes';
import { quotes } from './store/quotes';

import { TranslateService } from '@ngx-translate/core';
import { FinalLoading } from './store/actions';
import { REFFERAL_CODE_KEY, REFFERAL_ID_KEY } from './shared/config';
import { filter } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import Timer = NodeJS.Timer;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public hideFooter: boolean = false;
  public hideHeader: boolean = false;
  public windowIsResized: boolean = false;
  public isLoading: boolean = true;
  public isMail: boolean = false;
  public isHomepage: boolean;
  quote: object;
  isAuthenticated: boolean;

  constructor(public router: Router,
              private sharedService: SharedService,
              private activatedRoute: ActivatedRoute,
              private store: Store<AppState>,
              private translate: TranslateService) {
    this.store.dispatch(new FinalLoading({ loadingState: true }));
    this.sharedService.hideHeader.subscribe(data => (this.hideHeader = data));
    this.sharedService.hideFooter.subscribe(data => (this.hideFooter = data));
    this.sharedService.isMail.subscribe(data => (this.isMail = data));

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('en');
    setTimeout(() => {
      this.updateLoadingStatus();
      this.store.dispatch(new FinalLoading({ loadingState: false }));
    }, 2000);

    this.activatedRoute.queryParams.pipe(untilDestroyed(this))
      .subscribe((params: any) => {
        if (params) {
          if (params.referral_code) {
            localStorage.setItem(REFFERAL_CODE_KEY, params.referral_code);
          }
          const refferalId = params[REFFERAL_ID_KEY] || params[REFFERAL_ID_KEY.toUpperCase()];
          if (refferalId) {
            localStorage.setItem(REFFERAL_ID_KEY, refferalId);
          }
        }
      });

  }


  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((routeEvent: NavigationEnd) => {
        this.isHomepage = routeEvent.url === '/';
        window.scrollTo(0, 0);
      });

    this.quote = quotes[Math.floor(Math.random() * quotes.length)];

    this.store.select((state: AppState) => state.auth).pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        this.isAuthenticated = authState.isAuthenticated;
      });
  }

  private updateLoadingStatus(): void {
    this.store.select(state => state.loading).pipe(untilDestroyed(this))
      .subscribe((loadingState: LoadingState) => {
        this.isLoading = loadingState.Loading;
      });
  }

  ngOnDestroy(): void {
  }
}
