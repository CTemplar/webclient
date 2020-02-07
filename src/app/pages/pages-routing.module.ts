// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricingPlansComponent } from 'app/shared/components/pricing-plans/pricing-plans.component';
import { PaymentOptionsComponent } from './pages-donate/payment-options/payment-options.component';
import { StripeFormComponent } from '../shared/components/stripe-form/stripe-form.component';
import { BitcoinFormComponent } from '../shared/components/bitcoin-form/bitcoin-form.component';
import { PagesDonateComponent } from './pages-donate/pages-donate.component';

const routes: Routes = [
  {
    path: 'donate',
    component: PagesDonateComponent,
    children: [
      { path: '', component: PaymentOptionsComponent },
      { path: 'stripe', component: StripeFormComponent },
      { path: 'bitcoin', component: BitcoinFormComponent }
    ]
  },
  { path: 'pricing', component: PricingPlansComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}
