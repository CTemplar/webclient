// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { FooterComponent } from './footer.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    NgbModule
  ],
  declarations: [FooterComponent],
  exports: [FooterComponent]
})
export class FooterModule { }
