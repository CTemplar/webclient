import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users-sign-up',
  templateUrl: './users-sign-up.component.html',
  styleUrls: ['./users-sign-up.component.scss']
})
export class UsersSignUpComponent implements OnInit {

  // == Defining public property as boolean
  public selectedIndex: number = -1; // Assuming no element are selected initially

  constructor() { }

  ngOnInit() {
  }

  // == Toggle active state of the slide in price page
  toggleSlides(index, $event) {
    this.selectedIndex = index;
    document.querySelector('.package-xs-tab > li').classList.remove('active');
    document.querySelector('.package-prime-col').classList.remove('active-slide');
  }

}
