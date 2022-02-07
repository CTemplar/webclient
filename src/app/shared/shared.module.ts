import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TagInputModule } from 'ngx-chips';
import { PlatformModule } from '@angular/cdk/platform';
import { NgxMaskModule, IConfig } from 'ngx-mask';

import { CreateFolderComponent } from '../mail/dialogs/create-folder/create-folder.component';
import { PaymentFailureNoticeComponent } from '../mail/dialogs/payment-failure-notice/payment-failure-notice.component';

import { UsersBillingInfoComponent } from './components/users-billing-info/users-billing-info.component';
import { SpinnerComponent } from './spinner/components/spinner.component';
import { SpinnerService } from './spinner/services/spinner.service';
import { SpinnerImageComponent } from './components/spinner-image/spinner-image.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { SafePipe } from './pipes/safe.pipe';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { DynamicScriptLoaderService } from './services/dynamic-script-loader.service';
import { FilenamePipe } from './pipes/filename.pipe';
import { PricingPlansComponent } from './components/pricing-plans/pricing-plans.component';
import { FilesizePipe } from './pipes/filesize.pipe';
import { RemainingTimePipe } from './pipes/remaining-time.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { AnchorScrollDirective } from './directives/anchor-scroll.directive';
import { CountdownTimerComponent } from './components/countdown-timer/countdown-timer.component';
import { BrowserDetectorService } from './services/browser-detector.service';
import { IsIeDirective } from './directives/is-ie.directive';
import { MomentDatePipe } from './pipes/moment-date.pipe';
import { StripeFormComponent } from './components/stripe-form/stripe-form.component';
import { BitcoinFormComponent } from './components/bitcoin-form/bitcoin-form.component';
import { LastActionPipe } from './pipes/last-action.pipe';
import { CreditCardNumberPipe } from './pipes/creditcard-number.pipe';
import { FixOutlookQuotesPipe } from './pipes/fix-outlook-quotes.pipe';
import { EmailFormatPipe } from './pipes/email-formatting.pipe';
import { LineBreakToBrTag } from './pipes/replace-linebreak-brtag.pipe';
import { CircleBarSpinnerComponent } from './circle-bar-spinner/circle-bar-spinner.component';
import { ThemeToggleService } from './services/theme-toggle-service';
import { AdvancedSearchComponent } from './components/advanced-search/advanced-search.component';
import { KeyManageService } from './services/key-manage.service';
import { UserSelectManageService } from './services/user-select-manage.service';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TagInputModule,
    MatIconModule,
    NgbModule,
    MatCheckboxModule,
    NgxMaskModule.forRoot(maskConfig),
    PlatformModule,
  ],
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
    AnchorScrollDirective,
    CountdownTimerComponent,
    IsIeDirective,
    MomentDatePipe,
    StripeFormComponent,
    BitcoinFormComponent,
    CreateFolderComponent,
    PaymentFailureNoticeComponent,
    LastActionPipe,
    CreditCardNumberPipe,
    FixOutlookQuotesPipe,
    LineBreakToBrTag,
    EmailFormatPipe,
    CircleBarSpinnerComponent,
    AdvancedSearchComponent,
  ],
  exports: [
    // Modules
    TranslateModule,
    TagInputModule,
    MatIconModule,
    NgxMaskModule,
    // Directives
    ClickOutsideDirective,
    IsIeDirective,
    AnchorScrollDirective,
    // Pipes
    EmailFormatPipe,
    SafePipe,
    LastActionPipe,
    FilenamePipe,
    FilesizePipe,
    RemainingTimePipe,
    MomentDatePipe,
    CreditCardNumberPipe,
    FixOutlookQuotesPipe,
    // Components
    SpinnerComponent,
    LineBreakToBrTag,
    LoadingComponent,
    SpinnerImageComponent,
    LoadingSpinnerComponent,
    ProgressBarComponent,
    PricingPlansComponent,
    UsersBillingInfoComponent,
    CircleBarSpinnerComponent,
    AdvancedSearchComponent,
    CountdownTimerComponent,
    StripeFormComponent,
    CreateFolderComponent,
    PaymentFailureNoticeComponent,
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
    KeyManageService,
    UserSelectManageService,
  ],
  entryComponents: [CreateFolderComponent, PaymentFailureNoticeComponent],
})
export class SharedModule {}
