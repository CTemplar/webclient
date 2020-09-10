import { Component, OnInit } from '@angular/core';

import { DynamicScriptLoaderService } from '../../shared/services/dynamic-script-loader.service';

@Component({
  selector: 'app-pages-donate',
  templateUrl: './pages-donate.component.html',
  styleUrls: ['./pages-donate.component.scss'],
})
export class PagesDonateComponent implements OnInit {
  constructor(private dynamicScriptLoader: DynamicScriptLoaderService) {}

  ngOnInit() {
    this.loadStripeScripts();
  }

  private loadStripeScripts() {
    this.dynamicScriptLoader
      .load('stripe')
      .then(data => {
        this.dynamicScriptLoader.load('stripe-key').then(stripeKeyLoaded => {
          // Stripe Loaded Successfully
        });
      })
      .catch(error => console.log(error));
  }
}
