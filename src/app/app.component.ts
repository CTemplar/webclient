// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

// Services
import { BlogService } from './blog/shared/blog.service';
import { MailService } from './mail/shared/mail.service';
import { SharedService } from './shared/shared.service';
import { UsersService } from './users/shared/users.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isMail = false;
  isBlogReady = false;
  isMailReady = false;
  isReady = false;
  quotes = [
      'Be without fear in the face of your enemies.',
      'Stand brave and upright that the Lord may love thee.',
      'Speak the truth always even if it means your death.',
      'Protect the helpless.',
      'Do no wrong.',
  ];
  quote: string;

  constructor(
    private blogService: BlogService,
    private mailService: MailService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private usersService: UsersService,
  ) {
    this.sharedService.isMail
      .subscribe(data => this.isMail = data);
    this.sharedService.isBlogReady
      .subscribe(data => this.isBlogReady = data);
    this.sharedService.isMailReady
      .subscribe(data => this.isMailReady = data);
    this.sharedService.isReady
      .subscribe(data => this.isReady = data);
  }

  loading() {
    this.quote = this.quotes[Math.floor(Math.random() * 5)];
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.sharedService.isReady.emit(true);
      }, 5000);
    });

    if (this.usersService.signedIn()) {
      this.usersService.verifyToken().subscribe(_ => {
        this.blogService.cache();
        this.mailService.cache();
        this.usersService.refreshToken().subscribe();
      },
        error => this.usersService.signOut(),
      );
    } else {
      this.blogService.cache();
      this.sharedService.isMailReady.emit(true);
    }

    this.route.queryParams.subscribe(params => {
      if (params['ref']) {
        this.sharedService.patchReferrer(params['ref']);
        window.history.replaceState(null, null, window.location.pathname);
      }});
  }

  ngOnInit() {
    this.loading();
    this.router.events.subscribe(params => window.scrollTo(0, 0));
  }
}
