import { Component, OnInit } from '@angular/core';

import { NgbModal, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { LogOut } from '../../store/actions';

@Component({
  selector: 'app-mail-header',
  templateUrl: './mail-header.component.html',
  styleUrls: ['./mail-header.component.scss']
})
export class MailHeaderComponent implements OnInit {

  // Public property of boolean type set false by default
  public menuIsOpened: boolean = false;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
  }

  // == Setup click event to toggle mobile menu
  toggleState($event) { // click handler
    const bool = this.menuIsOpened;
    this.menuIsOpened = bool === false ? true : false;
  }

  logout() {
    this.store.dispatch(new LogOut());
  }
}
