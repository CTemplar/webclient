import { Component, OnInit } from '@angular/core';
import { Folder, MailFolderType } from '../../store/models';
import { Observable } from 'rxjs/Observable';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { ActivatedRoute } from '@angular/router';
import { AppState, MailBoxesState, UserState } from '../../store/datatypes';
import { Store } from '@ngrx/store';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  mailFolder: string = MailFolderType.INBOX;
  mailFolderTypes = MailFolderType;
  customFolders: Folder[] = [];

  constructor(public route: ActivatedRoute,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.route.params.takeUntil(this.destroyed$).subscribe(params => {
      this.mailFolder = params['folder'] as MailFolderType;
    });

    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.customFolders = user.customFolders;
      });
  }

  ngOnDestroy(): void {
  }
}
