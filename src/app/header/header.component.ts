import { Router } from '@angular/router';
import { Component, HostListener, Inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { AppState, AuthState } from '../store/datatypes';
import { ExpireSession, Logout } from '../store/actions';
import { Language, LANGUAGES, PRIMARY_WEBSITE } from '../shared/config';
import { SharedService } from '../store/services';
import { UsersService } from '../store/services/users.service';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  // Public property of boolean type set false by default
  public navIsFixed = false;

  public menuIsOpened = false;

  // Switch the footer call to action for this view.
  externalPageCallToAction = false;

  isLoggedIn: boolean;

  selectedLanguage: Language = { name: 'English', locale: 'en' };

  languages = LANGUAGES;

  primaryWebsite = PRIMARY_WEBSITE;

  constructor(
    @Inject(DOCUMENT) private document: any,
    public router: Router,
    private sharedService: SharedService,
    public usersService: UsersService,
    private store: Store<AppState>,
    private translate: TranslateService,
  ) {
    this.sharedService.isExternalPage.subscribe((data: boolean) => (this.externalPageCallToAction = data));
  }

  ngOnInit() {
    this.isLoggedIn = !!this.usersService.getUserKey();
    this.store
      .select(state => state.auth)
      .pipe(untilDestroyed(this))
      .subscribe((data: AuthState) => (this.isLoggedIn = data.isAuthenticated));
  }

  changeLanguage(lang: Language) {
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(lang.locale);
    this.selectedLanguage = lang;
  }

  // == Setup click event to toggle mobile menu
  toggleState() {
    // click handler
    const bool = this.menuIsOpened;
    this.menuIsOpened = bool === false;
  }

  // == Listening to scroll event for window object
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const number = window.scrollY || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    if (number > document.getElementById('mastHead').offsetHeight) {
      this.navIsFixed = true;
    } else if (this.navIsFixed && number < 10) {
      this.navIsFixed = false;
    }
  }

  closeMenu() {
    this.menuIsOpened = false;
  }

  logout() {
    this.store.dispatch(new ExpireSession());
    setTimeout(() => {
      this.store.dispatch(new Logout());
    }, 500);
  }
}
