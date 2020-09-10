import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/shared.module';

import { PagesDonateComponent } from './pages-donate/pages-donate.component';
import { PaymentOptionsComponent } from './pages-donate/payment-options/payment-options.component';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [CommonModule, NgbModule, PagesRoutingModule, SharedModule],
  declarations: [PagesDonateComponent, PaymentOptionsComponent],
})
export class PagesModule {}
