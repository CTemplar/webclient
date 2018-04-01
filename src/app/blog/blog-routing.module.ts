// == Angular modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// == Angular components
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';

const routes: Routes = [
  { path: 'blog', component: BlogListComponent },
  { path: 'blog/blog-post', component: BlogDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
