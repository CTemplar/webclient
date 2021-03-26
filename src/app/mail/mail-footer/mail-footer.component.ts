import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AppState, UserState } from '../../store/datatypes';
import { PRIMARY_WEBSITE } from '../../shared/config';

@UntilDestroy()
@Component({
  selector: 'app-mail-footer',
  templateUrl: './mail-footer.component.html',
  styleUrls: ['./mail-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailFooterComponent implements OnInit {
  public userState: UserState;

  primaryWebsite = PRIMARY_WEBSITE;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.userState = user;
      });
  }
}
