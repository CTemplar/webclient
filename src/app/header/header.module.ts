// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

// Components
import { HeaderComponent } from './header.component';
import {SharedModule} from '../shared/shared.module';

// Third-party
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    SharedModule,
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }
