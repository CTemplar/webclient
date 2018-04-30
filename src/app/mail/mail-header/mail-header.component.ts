import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mail-header',
  templateUrl: './mail-header.component.html',
  styleUrls: ['./mail-header.component.scss']
})
export class MailHeaderComponent implements OnInit {

  // Public property of boolean type set false by default
  public menuIsOpened: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  // == Setup click event to toggle mobile menu
  toggleState($event) { // click handler
    const bool = this.menuIsOpened;
    this.menuIsOpened = bool === false ? true : false;
  }

}
