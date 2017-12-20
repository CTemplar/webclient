// Angular
import { Component } from '@angular/core';

// Modals
import { SignUpModal } from '../shared/modals/signup/signup.component';

// Semantic UI
import { SuiModalService } from 'ng2-semantic-ui';
import { UsersService } from '../users/shared/users.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(
    public modalService: SuiModalService,
    public usersService: UsersService,
  ) {}

  signUp() {
    this.modalService.open(new SignUpModal());
  }
}
