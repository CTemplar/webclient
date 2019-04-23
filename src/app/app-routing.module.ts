// Angular
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: 'app/home/home.module#HomeModule'
  },
];

export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(routes);
