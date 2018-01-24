// Angular
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

// Modals
import { SignInModal } from '../shared/modals/signin/signin.component';
import { SignUpModal } from '../shared/modals/signup/signup.component';

// Services
import { SuiModalService } from 'ng2-semantic-ui';
import { UsersService } from '../users/shared/users.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    public modalService: SuiModalService,
    public usersService: UsersService,
    public router: Router
  ) {}

  hasScroll = false;

  signIn() {
    this.modalService.open(new SignInModal());
  }

  signUp() {
    this.modalService.open(new SignUpModal());
  }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (): void => {
    if (this.router.url === '/') {
      this.hasScroll = window.scrollY > 100;
    }
  }
}
