import { Component, OnInit } from '@angular/core';
import { MailFolderType } from '../../store/models';
import { Observable } from 'rxjs/Observable';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { ActivatedRoute } from '@angular/router';
import { AppState, MailBoxesState } from '../../store/datatypes';
import { Store } from '@ngrx/store';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  mailFolder: MailFolderType = MailFolderType.INBOX;
  mailFolderTypes = MailFolderType;
  customFolders: string[] = [];

  constructor(public route: ActivatedRoute,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.route.params.takeUntil(this.destroyed$).subscribe(params => {
      this.mailFolder = params['folder'] as MailFolderType;
    });

    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
    .subscribe((mailboxes: MailBoxesState) => {
      this.customFolders = mailboxes.customFolders;
    });
  }

  ngOnDestroy(): void {
  }
}
