// Angular
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

// Bootstrap
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// Components
import { AlertsComponent } from "./alerts/alerts.component";
import {
  CaptchaModal,
  DialogModal,
  ProgressModal,
  RecoverModal,
  ResetModal
} from "./modals";
import { LoadingComponent } from "./loading/loading.component";
import { PricingTableComponent } from "./pricing-table/pricing-table.component";
import { SpinnerComponent } from "./spinner/spinner.component";

// reCAPTCHA
import { RecaptchaModule } from "ng-recaptcha";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RouterModule
  ],
  declarations: [
    AlertsComponent,
    LoadingComponent,
    CaptchaModal,
    DialogModal,
    ProgressModal,
    RecoverModal,
    ResetModal,
    PricingTableComponent,
    SpinnerComponent
  ],
  exports: [
    AlertsComponent,
    CommonModule,
    FormsModule,
    LoadingComponent,
    CaptchaModal,
    DialogModal,
    ProgressModal,
    ReactiveFormsModule,
    RecoverModal,
    ResetModal,
    NgbModule,
    PricingTableComponent,
    SpinnerComponent
  ]
})
export class SharedModule {}
