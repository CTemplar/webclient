// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Components
import { PagesDonateComponent } from './pages-donate/pages-donate.component';
import { PaymentOptionsComponent } from './pages-donate/payment-options/payment-options.component';

// Modules
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';

// Third-party
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [CommonModule, NgbModule, PagesRoutingModule, SharedModule],
  declarations: [PagesDonateComponent, PaymentOptionsComponent]
})
export class PagesModule {}
