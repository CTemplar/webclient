// Angular
import { Component, OnInit } from '@angular/core';

// Services
import { UsersService } from '../../users/shared/users.service';

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'app-mail-header',
  templateUrl: './mail-header.component.html',
  styleUrls: ['./mail-header.component.scss']
})
export class MailHeaderComponent implements OnInit {

  constructor(
    public usersService: UsersService,
  ) {}

  ngOnInit() {
  }

}
