// == Angular core modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// == Feature modules
import { HomeRoutingModule } from './home-routing.module';

// == Home page related Components
import { HomeComponent } from './home.component';
import { HomeWelcomeComponent } from './home-welcome/home-welcome.component';
import { HomeFeaturesComponent } from './home-features/home-features.component';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent, HomeWelcomeComponent, HomeFeaturesComponent]
})
export class HomeModule { }
