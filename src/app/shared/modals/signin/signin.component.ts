// Angular
import { Component } from '@angular/core';

// Models
import { User } from '../../../users/shared/users'

// Semantic UI
import { SuiModal, ComponentModalConfig } from "ng2-semantic-ui"

// Services
import { UsersService } from '../../../users/shared/users.service'

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SignInComponent {
  error: string;
  user = new User;

  constructor(
    public modal: SuiModal<void>,
    private usersService: UsersService,
  ) {}

  signIn() {
    this.usersService.signIn(this.user)
      .subscribe(data => {
        this.modal.approve(undefined);
      }, error => {
        this.error = 'Unable to sign in with provided credentials.';
      });
  }
}

export class SignInModal extends ComponentModalConfig<void> {
  constructor() {
    super(SignInComponent);
    this.isClosable = true;
    this.size = 'mini';
  }
}
