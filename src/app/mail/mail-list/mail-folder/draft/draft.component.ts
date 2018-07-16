import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, MailState } from '../../../../store/datatypes';
import { Mail, MailFolderType } from '../../../../store/models';
import { GetMails } from '../../../../store/actions';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';

@TakeUntilDestroy()
@Component({
  selector: 'app-draft',
  templateUrl: './draft.component.html',
  styleUrls: ['./draft.component.scss']
})
export class DraftComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  mailFolderTypes = MailFolderType;

  mailState: MailState;

  constructor(public store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.dispatch(new GetMails({ limit: 1000, offset: 0, folder: MailFolderType.DRAFT }));

    this.store.select(state => state.mail).takeUntil(this.destroyed$)
      .subscribe((mailState: MailState) => {
        this.mailState = mailState;
      });
  }


  ngOnDestroy(): void {
  }
}
