// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
// Service
import { SharedService } from '../../shared/shared.service';
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
@Component({
  selector: 'app-pages-pricing',
  templateUrl: './pages-pricing.component.html',
  styleUrls: ['./pages-pricing.component.scss']
})
export class PagesPricingComponent implements OnDestroy, OnInit {
  // == Defining public property as boolean
  public selectedIndex: number = -1; // Assuming no element are selected initially
  constructor(private sharedService: SharedService) { }
  ngOnInit() {
    this.sharedService.hideFooter.emit(true);
  }
  // == Toggle active state of the slide in price page
  toggleSlides(index) {
    this.selectedIndex = index;
    document.querySelector('.package-xs-tab > li').classList.remove('active');
    document.querySelector('.package-prime-col').classList.remove('active-slide');
  }
  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
  }
}
