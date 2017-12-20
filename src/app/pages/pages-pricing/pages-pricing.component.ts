// Angular
import { Component } from '@angular/core';

// Modals
import { SignUpModal } from '../../shared/modals/signup/signup.component';

// Semantic UI
import { SuiModalService } from 'ng2-semantic-ui';
import { UsersService } from '../../users/shared/users.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-pages-pricing',
  templateUrl: './pages-pricing.component.html',
  styleUrls: ['./pages-pricing.component.scss']
})
export class PagesPricingComponent {
  constructor(
    public modalService: SuiModalService,
    public usersService: UsersService,
  ) {}

  signUp() {
    this.modalService.open(new SignUpModal());
  }
}
