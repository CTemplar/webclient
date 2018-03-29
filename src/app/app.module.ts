import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MailComponent } from './mail/mail.component';
import { HomeModule } from './home/home.module';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    MailComponent,
  ],
  imports: [
      BrowserModule,
      NgbModule.forRoot(),
      AppRoutingModule,
      HomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
