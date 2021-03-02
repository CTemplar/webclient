import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TagInputModule } from 'ngx-chips';

import { CreateFolderComponent } from '../mail/dialogs/create-folder/create-folder.component';
import { PaymentFailureNoticeComponent } from '../mail/dialogs/payment-failure-notice/payment-failure-notice.component';

import { UsersBillingInfoComponent } from './components/users-billing-info/users-billing-info.component';
import { SpinnerComponent } from './spinner/components/spinner.component';
import { SpinnerService } from './spinner/services/spinner.service';
import { SpinnerImageComponent } from './spinner-image/spinner-image.component';
import { LoadingComponent } from './loading/loading.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { SafePipe } from './pipes/safe.pipe';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { DynamicScriptLoaderService } from './services/dynamic-script-loader.service';
import { FilenamePipe } from './pipes/filename.pipe';
import { PricingPlansComponent } from './components/pricing-plans/pricing-plans.component';
import { FilesizePipe } from './pipes/filesize.pipe';
import { RemainingTimePipe } from './pipes/remaining-time.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { CountdownTimerComponent } from './components/countdown-timer/countdown-timer.component';
import { BrowserDetectorService } from './services/browser-detector.service';
import { IsIeDirective } from './directives/is-ie.directive';
import { MomentDatePipe } from './pipes/moment-date.pipe';
import { StripeFormComponent } from './components/stripe-form/stripe-form.component';
import { BitcoinFormComponent } from './components/bitcoin-form/bitcoin-form.component';
import { LastActionPipe } from './pipes/last-action.pipe';
import { CreditCardNumberPipe } from './pipes/creditcard-number.pipe';
import { EmailFormatPipe } from './pipes/email-formatting.pipe';
import { LineBreakToBrTag } from './pipes/replace-linebreak-brtag.pipe';
import { CircleBarSpinnerComponent } from './circle-bar-spinner/circle-bar-spinner.component';
import { ThemeToggleService } from './services/theme-toggle-service';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, TagInputModule, MatIconModule, NgbModule],
  declarations: [
    SpinnerComponent,
    SpinnerImageComponent,
    LoadingComponent,
    LoadingSpinnerComponent,
    SafePipe,
    ProgressBarComponent,
    FilenamePipe,
    PricingPlansComponent,
    UsersBillingInfoComponent,
    FilesizePipe,
    RemainingTimePipe,
    ClickOutsideDirective,
    CountdownTimerComponent,
    IsIeDirective,
    MomentDatePipe,
    StripeFormComponent,
    BitcoinFormComponent,
    CreateFolderComponent,
    PaymentFailureNoticeComponent,
    LastActionPipe,
    CreditCardNumberPipe,
    LineBreakToBrTag,
    EmailFormatPipe,
    CircleBarSpinnerComponent,
  ],
  exports: [
    TranslateModule,
    SpinnerComponent,
    LoadingComponent,
    SpinnerImageComponent,
    LoadingSpinnerComponent,
    SafePipe,
    LastActionPipe,
    TagInputModule,
    ProgressBarComponent,
    FilenamePipe,
    MatIconModule,
    PricingPlansComponent,
    UsersBillingInfoComponent,
    FilesizePipe,
    RemainingTimePipe,
    ClickOutsideDirective,
    CountdownTimerComponent,
    IsIeDirective,
    MomentDatePipe,
    StripeFormComponent,
    CreateFolderComponent,
    PaymentFailureNoticeComponent,
    CreditCardNumberPipe,
    LineBreakToBrTag,
    EmailFormatPipe,
    CircleBarSpinnerComponent,
  ],
  providers: [
    SpinnerService,
    DynamicScriptLoaderService,
    BrowserDetectorService,
    FilesizePipe,
    FilenamePipe,
    CreditCardNumberPipe,
    LineBreakToBrTag,
    EmailFormatPipe,
    ThemeToggleService,
  ],
  entryComponents: [CreateFolderComponent, PaymentFailureNoticeComponent],
})
export class SharedModule {}
