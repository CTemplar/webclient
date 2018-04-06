// Angular
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { AppComponent } from './app.component';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { BlogModule } from './blog/blog.module';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { MailModule } from './mail/mail.module';
import { PagesModule } from './pages/pages.module';

// Services
import { BlogService } from './blog/shared/blog.service';
// import { MailService } from './mail/shared/mail.service';
import { SharedService } from './shared/shared.service';
import { UsersModule } from './users/users.module';
// import { UsersService } from './users/shared/users.service';


///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    BlogModule,
    FooterModule,
    HeaderModule,
    HomeModule,
    MailModule,
    PagesModule,
    UsersModule,
  ],
  providers: [
    BlogService,
    SharedService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
