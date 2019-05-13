import { Component, Inject, OnInit } from '@angular/core';

import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppState, UserState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { ExpireSession, Logout } from '../../store/actions';
import { TranslateService } from '@ngx-translate/core';
import { Language, LANGUAGES } from '../../shared/config';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { UpdateSearch } from '../../store/actions/search.action';
import { DOCUMENT } from '@angular/common';
import { ComposeMailService } from '../../store/services/compose-mail.service';
import { MailFolderType } from '../../store/models';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { SearchState } from '../../store/reducers/search.reducers';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-header',
  templateUrl: './mail-header.component.html',
  styleUrls: ['./mail-header.component.scss']
})
export class MailHeaderComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  // Public property of boolean type set false by default
  menuIsOpened: boolean = false;
  selectedLanguage: Language = { name: 'English', locale: 'en' };
  languages = LANGUAGES;
  searchInput = new FormControl();
  mailFolderTypes = MailFolderType;
  mailFolder: MailFolderType;

  constructor(private store: Store<AppState>,
              config: NgbDropdownConfig,
              private route: ActivatedRoute,
              private translate: TranslateService,
              @Inject(DOCUMENT) private document: Document,
              private composeMailService: ComposeMailService) {
    config.autoClose = true;
  }

  ngOnInit() {
    this.store.select(state => state.user).pipe(takeUntil(this.destroyed$))
      .subscribe((user: UserState) => {
        if (user.settings.language) {
          const language = this.languages.filter(item => item.name === user.settings.language)[0];
          if (this.selectedLanguage.name !== language.name) {
            this.changeLanguage(language);
          }
          this.selectedLanguage = language;
        }
      });
    this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      this.mailFolder = params['folder'] as MailFolderType;
    });
    this.searchInput.valueChanges.pipe(takeUntil(this.destroyed$))
      .subscribe((value) => {
        if (!value) {
          this.store.dispatch(new UpdateSearch({ searchText: value, clearSearch: true }));
        }
      });
    this.store.select(state => state.search).pipe(takeUntil(this.destroyed$))
      .subscribe((searchState: SearchState) => {
        console.log(searchState);
        if (!searchState.searchText) {
          this.searchInput.setValue('', { emitEvent: false, emitModelToViewChange: true, emitViewToModelChange: false });
        }
      });
  }

  search() {
    this.store.dispatch(new UpdateSearch({ searchText: this.searchInput.value }));
  }

  // == Setup click event to toggle mobile menu
  toggleMenu() { // click handler
    const bool = this.menuIsOpened;
    this.menuIsOpened = bool === false ? true : false;
    this.document.body.classList.add('menu-open');
  }

  logout() {
    this.store.dispatch(new ExpireSession());
    setTimeout(() => {
      this.store.dispatch(new Logout());
    }, 500);
  }

  changeLanguage(lang: Language) {
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(lang.locale);
    this.selectedLanguage = lang;
  }

  openComposeMailDialog(receivers) {
    this.composeMailService.openComposeMailDialog({ receivers });
  }

  ngOnDestroy(): void {
  }
}
