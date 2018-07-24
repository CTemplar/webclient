// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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

@NgModule({
  imports: [
    CommonModule,
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
  ],
  providers: [SpinnerService, DynamicScriptLoaderService]
})
export class SharedModule {
}
