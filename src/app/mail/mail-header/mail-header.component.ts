import { Component, OnInit, Inject } from '@angular/core';

import { NgbModal, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppState, UserState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { Logout } from '../../store/actions';
import { TranslateService } from '@ngx-translate/core';
import { Language, LANGUAGES } from '../../shared/config';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { UpdateSearch } from '../../store/actions/search.action';
import { DOCUMENT } from '@angular/platform-browser';

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

  constructor(private store: Store<AppState>,
              config: NgbDropdownConfig,
              private translate: TranslateService,
              @Inject(DOCUMENT) private document: Document) {
    config.autoClose = true;
  }

  ngOnInit() {
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        if (user.settings.language) {
          const language = this.languages.filter(item => item.name === user.settings.language)[0];
          if (this.selectedLanguage.name !== language.name) {
            this.changeLanguage(language);
          }
          this.selectedLanguage = language;
        }
      });

    this.searchInput.valueChanges.takeUntil(this.destroyed$)
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.store.dispatch(new UpdateSearch(value));
      });
  }

  // == Setup click event to toggle mobile menu
  toggleMenu() { // click handler
    const bool = this.menuIsOpened;
    this.menuIsOpened = bool === false ? true : false;
    this.document.body.classList.add('menu-open');
  }

  logout() {
    this.store.dispatch(new Logout());
  }

  changeLanguage(lang: Language) {
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(lang.locale);
    this.selectedLanguage = lang;
  }

  ngOnDestroy(): void {
  }
}
