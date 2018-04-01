// == Angular modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// == Feature modules
import { BlogRoutingModule } from './blog-routing.module';
import { MailModule } from '../mail/mail.module';

// == Angular components
import { BlogLatestComponent } from './shared/blog-latest/blog-latest.component';
import { BlogRelatedComponent } from './blog-related/blog-related.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';

@NgModule({
  imports: [
    CommonModule,
    BlogRoutingModule,
    MailModule
  ],
  declarations: [BlogLatestComponent, BlogRelatedComponent, BlogListComponent, BlogDetailComponent],
  exports: [BlogLatestComponent, BlogRelatedComponent]
})
export class BlogModule { }
