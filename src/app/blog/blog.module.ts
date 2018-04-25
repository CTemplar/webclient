// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Components
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogLatestComponent } from './shared/blog-latest/blog-latest.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogRelatedComponent } from './blog-detail/blog-related/blog-related.component';

// Modules
import { BlogRoutingModule } from './blog-routing.module';
import { MailModule } from '../mail/mail.module';

// Services
import { BlogService } from '../providers/blog.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@NgModule({
  imports: [
    CommonModule,
    BlogRoutingModule,
    MailModule
  ],
  declarations: [
    BlogDetailComponent,
    BlogLatestComponent,
    BlogListComponent,
    BlogRelatedComponent,
  ],
  exports: [
    BlogLatestComponent,
    BlogRelatedComponent,
  ],
  providers: [
    BlogService
  ]
})
export class BlogModule { }
