import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, MailState } from '../../../../store/datatypes';
import { Mail, MailFolderType } from '../../../../store/models';
import { GetMails } from '../../../../store/actions';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';

@TakeUntilDestroy()
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  mailFolderTypes = MailFolderType;

  mails: Mail[];

  constructor(public store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.dispatch(new GetMails({ limit: 1000, offset: 0, folder: MailFolderType.INBOX }));

    this.store.select(state => state.mail).takeUntil(this.destroyed$)
      .subscribe((mailState: MailState) => {
        this.mails = mailState.mails;
      });
  }


  ngOnDestroy(): void {
  }
}
