import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, UserState } from '../../store/datatypes';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PRIMARY_WEBSITE } from '../../shared/config';

@UntilDestroy()
@Component({
  selector: 'app-mail-footer',
  templateUrl: './mail-footer.component.html',
  styleUrls: ['./mail-footer.component.scss']
})
export class MailFooterComponent implements OnInit, OnDestroy {
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

  ngOnDestroy(): void {}
}
