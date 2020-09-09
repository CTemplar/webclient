// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Components
import { FooterComponent } from './footer.component';
import { TranslateModule } from '@ngx-translate/core';

// Third-party
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, NgbModule, RouterModule, TranslateModule],
  exports: [FooterComponent],
})
export class FooterModule {}
