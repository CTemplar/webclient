// == Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Feature modules
import { BlogRoutingModule } from './blog-routing.module';
import { BlogLatestComponent } from './shared/blog-latest/blog-latest.component';

@NgModule({
  imports: [
    CommonModule,
    BlogRoutingModule
  ],
  declarations: [BlogLatestComponent],
  exports: [BlogLatestComponent]
})
export class BlogModule { }
