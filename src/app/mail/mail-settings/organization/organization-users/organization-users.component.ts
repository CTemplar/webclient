import { Component, OnInit } from '@angular/core';
import { OrganizationUser } from '../../../../store/models';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/internal/Observable';

@TakeUntilDestroy()
@Component({
  selector: 'app-organization-users',
  templateUrl: './organization-users.component.html',
  styleUrls: ['./organization-users.component.scss']
})
export class OrganizationUsersComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  users: OrganizationUser[] = [
    { username: 'atif@aretesol.com', domain: 'aretesol.com' },
    { username: 'nitish@aretesol.com', domain: 'aretesol.com' }
  ];

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

}
