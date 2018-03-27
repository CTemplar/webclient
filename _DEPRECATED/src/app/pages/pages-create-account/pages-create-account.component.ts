// Angular
import { Component } from '@angular/core';

// Semantic UI
import { UsersService } from '../../users/shared/users.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-pages-create-account',
  templateUrl: './pages-create-account.component.html',
  styleUrls: ['./pages-create-account.component.scss']
})
export class PagesCreateAccountComponent {
  constructor(
    public usersService: UsersService,
  ) {}
}
