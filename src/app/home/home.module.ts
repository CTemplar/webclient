// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Modules
import { HomeRoutingModule } from './home-routing.module';
import { BlogModule } from '../blog/blog.module';
import { MailModule } from '../mail/mail.module';

// Components
import { HomeComponent } from './home.component';
import { HomeWelcomeComponent } from './home-welcome/home-welcome.component';
import { HomeFeaturesComponent } from './home-features/home-features.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    BlogModule,
    MailModule,
    TranslateModule
  ],
  declarations: [HomeComponent, HomeFeaturesComponent, HomeWelcomeComponent]
})
export class HomeModule {}
