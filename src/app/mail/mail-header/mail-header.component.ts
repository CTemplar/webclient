import { Component, OnInit } from '@angular/core';

import { NgbModal, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { Logout } from '../../store/actions';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mail-header',
  templateUrl: './mail-header.component.html',
  styleUrls: ['./mail-header.component.scss']
})
export class MailHeaderComponent implements OnInit {

  // Public property of boolean type set false by default
  menuIsOpened: boolean = false;
  selectedLanguage: string = 'EN';

  constructor(private store: Store<AppState>,
              config: NgbDropdownConfig,
              private translate: TranslateService) {
    config.autoClose = true;
  }

  ngOnInit() {
  }

  // == Setup click event to toggle mobile menu
  toggleState($event) { // click handler
    const bool = this.menuIsOpened;
    this.menuIsOpened = bool === false ? true : false;
  }

  logout() {
    this.store.dispatch(new Logout());
  }

  changeLanguage(lang: string) {
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(lang);
    this.selectedLanguage = lang.toUpperCase();
  }
}
