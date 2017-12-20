// Angular
import { Component } from '@angular/core';

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
export class HeaderComponent {
  constructor(
    public modalService: SuiModalService,
    public usersService: UsersService,
  ) {}

  signIn() {
    this.modalService.open(new SignInModal());
  }

  signUp() {
    this.modalService.open(new SignUpModal());
  }
}
