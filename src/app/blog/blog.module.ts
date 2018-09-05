// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Modules
import { MailModule } from '../mail/mail.module';
import { SharedModule } from '../shared/shared.module';

// Services
import { BlogService } from '../store/services';
import { BlogGridComponent } from './shared/blog-grid/blog-grid.component';



@NgModule({
  imports: [
    CommonModule,
    MailModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    BlogGridComponent,
  ],
  exports: [
    BlogGridComponent,
  ],
  providers: [
    BlogService
  ]
})
export class BlogModule { }
