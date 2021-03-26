import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AppState, UserState } from '../../store/datatypes';
import { Folder, MailFolderType } from '../../store/models';

@UntilDestroy()
@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss'],
})
export class MailListComponent implements OnInit {
  mailFolder: string = MailFolderType.INBOX;

  mailFolderTypes = MailFolderType;

  customFolders: Folder[] = [];

  private page = 1;

  constructor(public route: ActivatedRoute, private store: Store<AppState>) {}

  ngOnInit() {
    /**
     * Get current folder and page from route
     * Default value: folder = Inbox, page = 1
     */
    this.route.params.pipe(untilDestroyed(this)).subscribe(parameters => {
      this.mailFolder = parameters.folder as MailFolderType;
      this.page = +parameters.page;
    });

    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.customFolders = user.customFolders;
      });
  }
}
