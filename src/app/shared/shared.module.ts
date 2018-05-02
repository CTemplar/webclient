// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DecryptPipe } from './pipes/decrypt.pipe';
import { SpinnerComponent } from './spinner/components/spinner.component';
import { SpinnerService } from './spinner/services/spinner.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SpinnerComponent
  ],
  exports: [
    SpinnerComponent
  ],
  providers: [
    SpinnerService
  ]
})
export class SharedModule { }
