import { Component, OnDestroy, OnInit } from '@angular/core';
import { Folder, MailFolderType } from '../../store/models';
import { ActivatedRoute } from '@angular/router';
import { AppState, UserState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit, OnDestroy {

  mailFolder: string = MailFolderType.INBOX;
  mailFolderTypes = MailFolderType;
  customFolders: Folder[] = [];
  private page = 1;

  constructor(public route: ActivatedRoute,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.route.params.pipe(untilDestroyed(this)).subscribe(params => {
      this.mailFolder = params['folder'] as MailFolderType;
      this.page = +params['page'];
    });

    this.store.select(state => state.user).pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.customFolders = user.customFolders;
      });
  }

  ngOnDestroy(): void {}
}
