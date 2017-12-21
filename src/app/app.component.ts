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
      {
        content: 'Veritas vos liberabit – The truth shall set you free.',
        author: ' – Templar Saying- '
      },
      {
        content: 'You assist an evil system most by following its orders and decrees.', 
        author: ' – Mahatma Gandhi - '
      },
      {
        content:'Safeguard the helpless', 
        author:' - Templar\'s honor code -'
      },
      {
        content:'Do no wrong.', 
        author:' - Templar\'s honor code -'
      },
      {
        content:'In a time of universal deceit, telling the truth is a revolutionary act.', 
        author:' – George Orwell – '
      },
      {
        content:'The essence of government is control, or the attempt to control.', 
        author:' – Benjamin Tucker – '
      },
      {
        content:'You are not what you were born, but what you have it in yourself to be.', 
        author:' – Godfrey of Ibelin - '
      },
      {
        content:'It is a kingdom of conscience, or nothing.', 
        author:' – Balian of Ibelin -'
      },
      {
        content:'But man is not made for defeat. A man can be destroyed but not defeated.', 
        author:' – Ernest Hemingway -'
      },
      {
        content:'All men having power ought to be distrusted to a certain degree.', 
        author:' – James Madison - '
      },
      {
        content:'There is no charm equal to tenderness of heart.', 
        author:' – Jane Austen -'
      },
      {
        content:'Keep your face always toward the sunshine - and shadows will fall behind you.', 
        author:' – Walt Whitman -'
      },
      {
        content:'Honesty is the first chapter in the book of wisdom.', 
        author:' – Thomas Jefferson -'
      },
      {
        content:'The secret of getting ahead is getting started.', 
        author:' – Mark Twain -'
      },
      {
        content:'None are more hopelessly enslaved than those who believe they are free.', 
        author:' – Johann Wolfgang von Goethe -'
      },
      {
        content:'The further a society drifts from truth, the more it will hate those who speak it.', 
        author:'– George Orwell – '
      },
      {
        content:'The disappearance of a sense of morality is the most far-reaching consequence of submission to a system of authority.', 
        author:'  – Stanley Milgram – '
      },
      {
        content:'It is dangerous to be right when the government is wrong.', 
        author:' – Voltaire – '
      },
      {
        content:'There is no greater tyranny than that which is perpetrated under the shield of the law and in the name of justice.', 
        author:'  - Charles-Louis de Secondat, baron de La Brède et de Montesquieu - '
      },
      {
        content:'All human beings have three lives: public, private, and secret.', 
        author:' – Gabriel García Márquez -'
      },
      {
        content:'A truly strong person does not need the approval of others any more than a lion needs the approval of sheep.', 
        author:' – Vernon Howard -'
      }
  ];
  quote: object;

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
