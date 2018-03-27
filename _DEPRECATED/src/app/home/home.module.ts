// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { HomeRoutingModule } from './home-routing.module';
import { BlogModule } from '../blog/blog.module';

// Components
import { HomeComponent } from './home.component';
import { HomeWelcomeComponent } from './home-welcome/home-welcome.component';
import { HomeFeaturesComponent } from './home-features/home-features.component';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@NgModule({
  imports: [
    CommonModule,

    HomeRoutingModule,
    BlogModule,
  ],
  declarations: [HomeComponent, HomeWelcomeComponent, HomeFeaturesComponent]
})
export class HomeModule { }
