// Angular
import { Component } from "@angular/core";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Component({
  selector: "app-pricing-table",
  templateUrl: "./pricing-table.component.pug",
  styleUrls: ["./pricing-table.component.scss"]
})
export class PricingTableComponent {
  // REVIEW: WTF? {
  // == Toggle active state of the slide in price page
  selectedIndex: number = -1; // Assuming no element are selected initially
  toggleSlides(index) {
    this.selectedIndex = index;
    document.querySelector(".package-xs-tab > li").classList.remove("active");
    document
      .querySelector(".package-prime-col")
      .classList.remove("active-slide");
  }
  // }
}
