// Angular
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

// Semantic UI
import { UsersService } from '../../users/shared/users.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-pages-login',
  templateUrl: './pages-login.component.html',
  styleUrls: ['./pages-login.component.scss']
})
export class PagesLoginComponent implements OnInit {
  constructor(
    public usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    router.events.subscribe( (event: Event) => {
      if (event instanceof NavigationStart) {
        document.body.classList.remove('login-background');
      }
    });
  }

  ngOnInit() {
    document.body.classList.add('login-background');
  }
}
