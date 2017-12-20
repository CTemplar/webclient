// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Components
import { SignUpComponent } from './modals/signup/signup.component';
import { SignInComponent, SignInModal } from './modals/signin/signin.component';

// Modules
import { SuiMessageModule } from 'ng2-semantic-ui'

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SuiMessageModule,
  ],
  declarations: [
    SignUpComponent,
    SignInComponent,
  ],
  entryComponents: [
    SignInComponent,
    SignUpComponent,
  ],
})
export class SharedModule {}
