// Angular
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: 'app/home/home.module#HomeModule'
  },
  {
    path: 'blog',
    loadChildren: 'app/blog/blog.module#BlogModule'
  }
];

export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(routes);
