// Angular
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

// Components
import { AppComponent } from './app.component';

// Guards
import { AuthGuard } from './users/shared/auth.guard';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { BlogModule } from './blog/blog.module';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { MailModule } from './mail/mail.module';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';

// Semantic UI
import { SuiModule } from 'ng2-semantic-ui';

// Services
import { BlogService } from './blog/shared/blog.service';
import { MailService } from './mail/shared/mail.service';
import { SharedService } from './shared/shared.service';
import { UsersService } from './users/shared/users.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BlogModule,
    BrowserModule,
    FooterModule,
    HeaderModule,
    HomeModule,
    HttpClientModule,
    MailModule,
    PagesModule,
    SharedModule,
    SuiModule,
  ],
  providers: [
    AuthGuard,
    BlogService,
    MailService,
    SharedService,
    UsersService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
