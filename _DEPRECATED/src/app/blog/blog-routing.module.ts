// Angular
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { BlogListComponent } from './blog-list/blog-list.component'
import { BlogDetailComponent } from './blog-detail/blog-detail.component'

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


const routes: Routes = [
  { path: "blog", redirectTo: '/blog/page/1', pathMatch: 'full' },
  { path: "blog/page/:page", component: BlogListComponent },
  { path: "blog/:slug", component: BlogDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {}
