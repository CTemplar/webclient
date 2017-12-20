// Angular
import { Component } from '@angular/core';

// Models
import { User } from '../../../users/shared/users';

// Semantic UI
import { SuiModal, ComponentModalConfig } from 'ng2-semantic-ui';

// Services
import { UsersService } from '../../../users/shared/users.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignUpComponent {
  error: string;
  user = new User;

  constructor(
    public modal: SuiModal<void>,
    private usersService: UsersService,
  ) {}

  signUp() {
    this.usersService.signUp(this.user)
      .subscribe(data => {
        this.modal.approve(undefined);
      }, error => {
        this.error = 'Username is already taken.';
      });
  }
}

export class SignUpModal extends ComponentModalConfig<void> {
  constructor() {
    super(SignUpComponent);
    this.isClosable = true;
    this.size = 'mini';
  }
}
