import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesAboutComponent } from './pages-about/pages-about.component';

const routes: Routes = [
  { path: 'about', component: PagesAboutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
