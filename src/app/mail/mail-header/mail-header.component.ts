import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormControl } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ComposeMailService } from '../../store/services/compose-mail.service';
import { Language, LANGUAGES, PRIMARY_WEBSITE } from '../../shared/config';
import { ExpireSession, Logout, SaveDraftOnLogout } from '../../store/actions';
import { AppState, UserState } from '../../store/datatypes';
import { SearchState } from '../../store/reducers/search.reducers';
import { LOADING_IMAGE } from '../../store/services';
import { HttpCancelService } from '../../store/services';

@UntilDestroy()
@Component({
  selector: 'app-mail-header',
  templateUrl: './mail-header.component.html',
  styleUrls: ['./mail-header.component.scss'],
})
export class MailHeaderComponent implements OnInit, OnDestroy {
  @ViewChild('logoutModal') logoutModal;

  // Public property of boolean type set false by default
  menuIsOpened = false;

  selectedLanguage: Language = { name: 'English', locale: 'en' };

  languages = LANGUAGES;

  searchInput = new FormControl();

  searchPlaceholder = 'common.search';

  loadingImage = LOADING_IMAGE;

  private isContactsPage: boolean;

  primaryWebsite = PRIMARY_WEBSITE;

  constructor(
    private store: Store<AppState>,
    config: NgbDropdownConfig,
    private router: Router,
    private translate: TranslateService,
    private modalService: NgbModal,
    @Inject(DOCUMENT) private document: Document,
    private composeMailService: ComposeMailService,
    private httpCancelService: HttpCancelService,
  ) {
    config.autoClose = true;
  }

  ngOnInit() {
    /**
     * Change language with user's setting language
     */
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        if (user.settings.language) {
          const language = this.languages.find(item => item.name === user.settings.language);
          if (this.selectedLanguage.name !== language.name) {
            this.translate.use(language.locale);
          }
          this.selectedLanguage = language;
        }
      });

    this.setSearchPlaceholder(this.router.url);
    /**
     * Change placeholder of search bar on contacts page
     */
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter(event => event instanceof NavigationEnd),
      )
      .subscribe((event: NavigationEnd) => {
        this.setSearchPlaceholder(event.url);
      });

    this.store
      .select(state => state.search)
      .pipe(untilDestroyed(this))
      .subscribe((searchState: SearchState) => {
        this.searchInput.setValue('', { emitEvent: false, emitModelToViewChange: true, emitViewToModelChange: false });
      });
  }

  setSearchPlaceholder(url) {
    this.isContactsPage = url === '/mail/contacts';
    this.searchPlaceholder = this.isContactsPage ? 'common.search_contacts' : 'common.search';
  }

  search() {
    if (this.searchInput.value) {
      if (this.isContactsPage) {
        this.router.navigate(['/mail/contacts'], { queryParams: { search: this.searchInput.value } });
      } else {
        this.router.navigate(['/mail/search/page', 1], { queryParams: { search: this.searchInput.value } });
      }
    }
  }

  // == Setup click event to toggle mobile menu
  toggleMenu() {
    // click handler
    const bool = this.menuIsOpened;
    this.menuIsOpened = bool === false;
    this.document.body.classList.add('menu-open');
  }

  logout() {
    this.httpCancelService.cancelPendingRequests();
    this.store.dispatch(new SaveDraftOnLogout());
    const modalReference = this.modalService.open(this.logoutModal, {
      centered: true,
      backdrop: 'static',
      windowClass: 'modal-md change-password-modal',
    });
    setTimeout(() => {
      this.store.dispatch(new ExpireSession());
      setTimeout(() => {
        this.store.dispatch(new Logout());
        modalReference.close();
      }, 500);
    }, 2500);
    document.querySelector('#night-mode').innerHTML = '';
  }

  openComposeMailDialog(receivers) {
    this.composeMailService.openComposeMailDialog({ receivers });
  }

  ngOnDestroy(): void {}
}
