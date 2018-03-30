import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { BlogModule } from './blog/blog.module';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { MailModule } from './mail/mail.module';
import { PagesModule } from './pages/pages.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
      BrowserModule,
      NgbModule.forRoot(),
      AppRoutingModule,
      BlogModule,
      FooterModule,      
      HeaderModule,
      HomeModule,
      MailModule,
      PagesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
