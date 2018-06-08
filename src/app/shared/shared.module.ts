// Angular
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

// Bootstrap
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// Components
import { LoadingComponent } from "./loading/loading.component";
import { PricingTableComponent } from "./pricing-table/pricing-table.component";
import { SpinnerComponent } from "./spinner/spinner.component";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@NgModule({
  imports: [CommonModule, NgbModule],
  declarations: [LoadingComponent, PricingTableComponent, SpinnerComponent],
  exports: [LoadingComponent, NgbModule, PricingTableComponent, SpinnerComponent]
})
export class SharedModule {}
