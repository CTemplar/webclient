// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// Modules
import { HomeRoutingModule } from './home-routing.module';
import { MailModule } from '../mail/mail.module';
// Components
import { HomeComponent } from './home.component';
import { HomeWelcomeComponent } from './home-welcome/home-welcome.component';
import { HomeFeaturesComponent } from './home-features/home-features.component';
import { TranslateModule } from '@ngx-translate/core';
import { BlogGridComponent } from '../blog/blog-grid/blog-grid.component';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    MailModule,
    TranslateModule
  ],
  declarations: [HomeComponent, HomeFeaturesComponent, HomeWelcomeComponent, BlogGridComponent]
})
export class HomeModule {}
