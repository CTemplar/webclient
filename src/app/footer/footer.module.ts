// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Components
import { FooterComponent } from './footer.component';

// Modules
import { RouterModule } from '@angular/router';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
  ],
  declarations: [FooterComponent],
  exports: [FooterComponent]
})
export class FooterModule {}
