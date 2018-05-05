// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogLatestComponent } from './shared/blog-latest/blog-latest.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogRelatedComponent } from './blog-detail/blog-related/blog-related.component';

// Modules
import { BlogRoutingModule } from './blog-routing.module';
import { MailModule } from '../mail/mail.module';
import { SharedModule } from '../shared/shared.module';

// Services
import { BlogService } from '../providers/blog.service';
import { BlogSampleComponent } from './shared/blog-sample/blog-sample.component';


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@NgModule({
  imports: [
    CommonModule,
    BlogRoutingModule,
    MailModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    BlogDetailComponent,
    BlogLatestComponent,
    BlogListComponent,
    BlogRelatedComponent,
    BlogSampleComponent,
  ],
  exports: [
    BlogLatestComponent,
    BlogRelatedComponent,
    BlogSampleComponent
  ],
  providers: [
    BlogService
  ]
})
export class BlogModule { }
