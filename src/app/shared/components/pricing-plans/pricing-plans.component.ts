// Angular
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DynamicScriptLoaderService } from 'app/shared/services/dynamic-script-loader.service';
import { FinalLoading, MembershipUpdate } from 'app/store/actions';
import { SharedService } from 'app/store/services';

@Component({
  selector: 'app-pricing-plans',
  templateUrl: './pricing-plans.component.html',
  styleUrls: ['./pricing-plans.component.scss']
})
export class PricingPlansComponent implements OnInit, OnDestroy {

  // == Defining public property as boolean
  public selectedIndex: number = -1; // Assuming no element are selected initially
  @Input('hideHeader') hideHeader: boolean;
  @Input('blockGapsZero') blockGapsZero: boolean; // Flag to add top and bottom gap conditionally
  @Input() showCurrentPlan: boolean;
  @Input() isPrime: boolean;

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
    this.dynamicScriptLoader.load('stripe').then(data => {
      this.dynamicScriptLoader.load('stripe-key').then(stripeKeyLoaded => {
        // Script Loaded Successfully
      });
    }).catch(error => console.log(error));
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
    this.store.dispatch(new FinalLoading({ loadingState: true }));
  }

}
