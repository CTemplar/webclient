// == Angular core modules
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// == Angular Components
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
