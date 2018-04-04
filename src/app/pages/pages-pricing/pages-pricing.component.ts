// Angular
import { Component, OnInit } from '@angular/core';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-pages-pricing',
  templateUrl: './pages-pricing.component.html',
  styleUrls: ['./pages-pricing.component.scss']
})
export class PagesPricingComponent implements OnInit {

  // == Defining public property as boolean
  public selectedIndex: number = -1; // Assuming no element are selected initially

  constructor() { }

  ngOnInit() {
  }

  // == Toggle active state of the slide in price page
  toggleSlides(index) {
    this.selectedIndex = index;
  }

}
