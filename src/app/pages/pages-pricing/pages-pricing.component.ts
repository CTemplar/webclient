// Angular
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
// Service
import { SharedService } from '../../store/services';
import { DynamicScriptLoaderService } from '../../shared/services/dynamic-script-loader.service';

import {
  FinalLoading,
  MembershipUpdate
} from '../../store/actions';
import { Router } from '@angular/router';

// Store
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-pages-pricing',
  templateUrl: './pages-pricing.component.html',
  styleUrls: ['./pages-pricing.component.scss']
})
export class PagesPricingComponent implements OnDestroy, OnInit {
  // == Defining public property as boolean
  public selectedIndex: number = -1; // Assuming no element are selected initially
  @Input('hideHeader') hideHeader: boolean;
  @Input('blockGapsZero') blockGapsZero: boolean; // Flag to add top and bottom gap conditionally

  constructor(
    private sharedService: SharedService,
    private store: Store<any>,
    private router: Router,
    private dynamicScriptLoader: DynamicScriptLoaderService
  ) {}
  ngOnInit() {
    this.sharedService.hideFooter.emit(true);
    this.loadStripeScripts();
    this.store.dispatch(new FinalLoading({ loadingState: false }));
  }
  // == Toggle active state of the slide in price page
  toggleSlides(index) {
    this.selectedIndex = index;
    document.querySelector('.package-xs-tab > li').classList.remove('active');
    document
      .querySelector('.package-prime-col')
      .classList.remove('active-slide');
  }

  selectPlan(id) {
    this.store.dispatch(new MembershipUpdate({ id }));
    this.router.navigateByUrl('/create-account');
  }

  private loadStripeScripts() {
    this.dynamicScriptLoader.load('stripe', 'stripe-key').then(data => {
      // Script Loaded Successfully
    }).catch(error => console.log(error));
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
    this.store.dispatch(new FinalLoading({ loadingState: true }));
  }
}
