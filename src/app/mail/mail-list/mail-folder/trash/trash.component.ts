import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, MailState } from '../../../../store/datatypes';
import { Mail, MailFolderType, mailFolderTypes } from '../../../../store/models';
import { GetMails } from '../../../../store/actions';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';

@TakeUntilDestroy()
@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  mailFolderTypes = mailFolderTypes;

  mails: Mail[];
  loaded: boolean;

  constructor(public store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.dispatch(new GetMails({ limit: 1000, offset: 0, folder: MailFolderType.TRASH }));

    this.store.select(state => state.mail).takeUntil(this.destroyed$)
      .subscribe((mailState: MailState) => {
        this.mails = mailState.mails;
        this.loaded = mailState.loaded;
      });
  }


  ngOnDestroy(): void {
  }
}
