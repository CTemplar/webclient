// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersBillingInfoComponent } from './components/users-billing-info/users-billing-info.component';
import { SpinnerComponent } from './spinner/components/spinner.component';
import { SpinnerService } from './spinner/services/spinner.service';
import { SpinnerImageComponent } from './spinner-image/spinner-image.component';
import { LoadingComponent } from './loading/loading.component';
import { ngxZendeskWebwidgetModule } from 'ngx-zendesk-webwidget';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafePipe } from './pipes/safe.pipe';
import { TagInputModule } from 'ngx-chips';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { DynamicScriptLoaderService } from './services/dynamic-script-loader.service';
import { FilenamePipe } from './pipes/filename.pipe';
import { MatIconComponent } from './components/mat-icon/mat-icon.component';
import { PricingPlansComponent } from './components/pricing-plans/pricing-plans.component';
import { FilesizePipe } from './pipes/filesize.pipe';
import { RemainingTimePipe } from './pipes/remaining-time.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { CountdownTimerComponent } from './components/countdown-timer/countdown-timer.component';
import { BrowserDetectorService } from './services/browser-detector.service';
import { IsIeDirective } from './directives/is-ie.directive';
import { MomentDatePipe } from './pipes/moment-date.pipe';
import { StripeFormComponent } from './components/stripe-form/stripe-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TagInputModule,
    MatIconModule,
    NgbModule,
  ],
  declarations: [
    SpinnerComponent,
    SpinnerImageComponent,
    LoadingComponent,
    LoadingSpinnerComponent,
    SafePipe,
    ProgressBarComponent,
    FilenamePipe,
    MatIconComponent,
    PricingPlansComponent,
    UsersBillingInfoComponent,
    FilesizePipe,
    RemainingTimePipe,
    ClickOutsideDirective,
    CountdownTimerComponent,
    IsIeDirective,
    MomentDatePipe,
    StripeFormComponent,
  ],
  exports: [
    TranslateModule,
    SpinnerComponent,
    LoadingComponent,
    SpinnerImageComponent,
    ngxZendeskWebwidgetModule,
    LoadingSpinnerComponent,
    SafePipe,
    TagInputModule,
    ProgressBarComponent,
    FilenamePipe,
    MatIconModule,
    MatIconComponent,
    PricingPlansComponent,
    UsersBillingInfoComponent,
    FilesizePipe,
    RemainingTimePipe,
    ClickOutsideDirective,
    CountdownTimerComponent,
    IsIeDirective,
    MomentDatePipe,
    StripeFormComponent,
  ],
  providers: [
    SpinnerService,
    DynamicScriptLoaderService,
    BrowserDetectorService,
    FilesizePipe,
    FilenamePipe
  ]
})
export class SharedModule {
}
