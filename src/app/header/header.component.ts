import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // Public property of boolean type set false by default
  public navIsFixed: boolean = false;
  public menuIsOpened: boolean = false;

  constructor(@Inject(DOCUMENT) private document: any) { }

  ngOnInit() {
  }

  // == Setup click event to toggle mobile menu
  toggleState() { // click handler
    let bool = this.menuIsOpened;
    this.menuIsOpened = bool === false ? true : false;
  }

  // == Listeing scroll event for window object
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = window.scrollY || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    if (number > document.getElementById('mastHead').offsetHeight) {
      this.navIsFixed = true;
    } else if (this.navIsFixed && number < 10) {
      this.navIsFixed = false;
    }
  }
}
