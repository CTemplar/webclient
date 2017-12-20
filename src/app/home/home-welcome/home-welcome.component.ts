// Angular
import { Component } from '@angular/core';

// Components
import { HeaderComponent } from '../../header/header.component';

// Modals
import { SignUpModal } from '../../shared/modals/signup/signup.component';

// Semantic UI
import { SuiModalService } from 'ng2-semantic-ui';
import { UsersService } from '../../users/shared/users.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-home-welcome',
  templateUrl: './home-welcome.component.html',
  styleUrls: ['./home-welcome.component.scss']
})
export class HomeWelcomeComponent {
  constructor(
    public modalService: SuiModalService,
    public usersService: UsersService,
  ) {}

  signUp() {
    this.modalService.open(new SignUpModal());
  }
}
