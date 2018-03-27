// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// Components
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogLatestComponent } from './shared/blog-latest/blog-latest.component';
import { BlogListComponent } from './blog-list/blog-list.component';

// Modules
import { BlogRoutingModule } from './blog-routing.module';
import { SuiPaginationModule } from 'ng2-semantic-ui'

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


@NgModule({
  imports: [
    BlogRoutingModule,
    CommonModule,
    FormsModule,
    SuiPaginationModule,
  ],
  declarations: [
    BlogLatestComponent,
    BlogListComponent,
    BlogDetailComponent
  ],
  exports: [BlogLatestComponent]
})
export class BlogModule {}
