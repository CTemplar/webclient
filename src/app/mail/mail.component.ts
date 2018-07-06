import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SharedService } from '../store/services';

// Actions
import { AccountDetailsGet, FinalLoading } from '../store/actions';

// Store
import { Store } from '@ngrx/store';
import { AppState } from '../store/datatypes';
import { TakeUntilDestroy, OnDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MailComponent implements OnDestroy, OnInit {
  readonly destroyed$: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private sharedService: SharedService,
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new AccountDetailsGet());
    this.sharedService.hideFooter.emit(true);
    this.sharedService.hideHeader.emit(true);
    this.sharedService.hideEntireFooter.emit(true);
    this.sharedService.isMail.emit(true);
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe(user => {
        this.store.dispatch(new FinalLoading({ loadingState: false }));
      });
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
    this.sharedService.hideHeader.emit(false);
    this.sharedService.hideEntireFooter.emit(false);
    this.sharedService.isMail.emit(false);
  }
}
