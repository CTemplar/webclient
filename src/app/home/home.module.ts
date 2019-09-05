// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// Modules
// Components
import { HomeComponent } from './home.component';
import { HomeWelcomeComponent } from './home-welcome/home-welcome.component';
import { HomeFeaturesComponent } from './home-features/home-features.component';
import { TranslateModule } from '@ngx-translate/core';
import { BlogGridComponent } from '../blog/blog-grid/blog-grid.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
  ],
  declarations: [HomeComponent, HomeFeaturesComponent, HomeWelcomeComponent, BlogGridComponent]
})
export class HomeModule {}
