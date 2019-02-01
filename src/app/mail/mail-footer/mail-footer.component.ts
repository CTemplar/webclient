import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState, UserState } from '../../store/datatypes';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-footer',
  templateUrl: './mail-footer.component.html',
  styleUrls: ['./mail-footer.component.scss']
})
export class MailFooterComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  public userState: UserState;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store
      .select(state => state.user)
      .takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.userState = user;
      });
  }

  ngOnDestroy(): void {}
}
