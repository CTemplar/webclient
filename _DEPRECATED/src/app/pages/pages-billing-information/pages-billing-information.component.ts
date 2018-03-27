// Angular
import { Component } from '@angular/core';

// Semantic UI
import { UsersService } from '../../users/shared/users.service';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


@Component({
  selector: 'app-pages-billing-information',
  templateUrl: './pages-billing-information.component.html',
  styleUrls: ['./pages-billing-information.component.scss']
})
export class PagesBillingInformationComponent {
  constructor(
    public usersService: UsersService,
  ) {}

  paymentMethod = 'Stripe';
  country = 'Country';
  date = 'Date';
  year = 'Year';
}
