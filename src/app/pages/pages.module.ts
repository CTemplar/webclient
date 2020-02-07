// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Modules
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
// Components
import { PaymentOptionsComponent } from './pages-donate/payment-options/payment-options.component';
import { PagesDonateComponent } from './pages-donate/pages-donate.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    PagesRoutingModule,
    SharedModule
  ],
  declarations: [
    PaymentOptionsComponent,
    PagesDonateComponent
  ]
})
export class PagesModule {
}
