// Angular
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { ngxZendeskWebwidgetService } from 'ngx-zendesk-webwidget';
// Services
import { BlogService, SharedService } from './store/services';
// import { UsersService } from './users/shared/users.service';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState, AuthState, LoadingState } from './store/datatypes';
import { quotes } from './store/quotes';

import 'rxjs/add/operator/filter';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { FinalLoading } from './store/actions';

@TakeUntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  public hideFooter: boolean = false;
  public hideHeader: boolean = false;
  public windowIsResized: boolean = false;
  public resizeTimeout: number = null;
  public isLoading: boolean = true;
  public isMail: boolean = false;
  public isHomepage: boolean;
  quote: object;

  private isZendeskWebWidgetShown: boolean;

  constructor(@Inject(DOCUMENT) private document: any,
              public router: Router,
              private blogService: BlogService,
              private sharedService: SharedService,
              private store: Store<AppState>,
              private translate: TranslateService,
              private _ngxZendeskWebwidgetService: ngxZendeskWebwidgetService) {
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

    _ngxZendeskWebwidgetService.identify({
      name: '',
      email: ''
    });
  }


  ngOnInit() {
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((routeEvent: NavigationEnd) => {
        this.isHomepage = routeEvent.url === '/';
        window.scrollTo(0, 0);
      });

    this.quote = quotes[Math.floor(Math.random() * 5)];

    this.store.select((state: AppState) => state.auth).takeUntil(this.destroyed$)
      .subscribe((authState: AuthState) => {
        if (authState.isAuthenticated) {
          this.hideZendeskWebWidget();
        } else {
          this.showZendeskWebWidget();
        }
      });
  }

  // Resize event for window object
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowIsResized = true;
    if (this.resizeTimeout && this.windowIsResized) {
      // this.windowIsResized = true;
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(
      (() => {
        this.windowIsResized = false;
      }).bind(this),
      10
    );
  }

  private updateLoadingStatus(): void {
    this.store.select(state => state.loading).takeUntil(this.destroyed$)
      .subscribe((loadingState: LoadingState) => {
        this.isLoading = loadingState.Loading;
      });
  }

  private showZendeskWebWidget() {
    if (!this.isZendeskWebWidgetShown) {
      this._ngxZendeskWebwidgetService.show();
      this.isZendeskWebWidgetShown = true;
    }
  }

  private hideZendeskWebWidget() {
    if (this.isZendeskWebWidgetShown) {
      this._ngxZendeskWebwidgetService.hide();
      this.isZendeskWebWidgetShown = false;
    }
  }

  ngOnDestroy(): void {
  }
}
