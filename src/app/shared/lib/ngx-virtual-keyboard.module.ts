
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxVirtualKeyboardDirective } from './ngx-virtual-keyboard.directive';
import { NgxVirtualKeyboardComponent } from './ngx-virtual-keyboard.component';
import { NgxVirtualKeyboardKeyComponent } from './ngx-virtual-keyboard-key.component';
import { NgxVirtualKeyboardService } from './ngx-virtual-keyboard.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    NgxVirtualKeyboardDirective,
    NgxVirtualKeyboardComponent,
    NgxVirtualKeyboardKeyComponent
  ],
  providers: [
    NgxVirtualKeyboardService
  ],
  entryComponents: [
    NgxVirtualKeyboardComponent
  ],
  exports: [
    NgxVirtualKeyboardDirective
  ]
})

export class NgxVirtualKeyboardModule { }
