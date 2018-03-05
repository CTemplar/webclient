// Angular
import { Component } from '@angular/core';

// Semantic UI
import { UsersService } from '../../users/shared/users.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-pages-account-type',
  templateUrl: './pages-account-type.component.html',
  styleUrls: ['./pages-account-type.component.scss']
})
export class PagesAccountTypeComponent {
  constructor(
    public usersService: UsersService,
  ) {}
}
