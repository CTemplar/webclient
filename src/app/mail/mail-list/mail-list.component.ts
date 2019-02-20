import { Component, OnInit } from '@angular/core';
import { Folder, MailFolderType } from '../../store/models';
import { Observable } from 'rxjs';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState, MailBoxesState, UserState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { SearchState } from '../../store/reducers/search.reducers';
import { takeUntil } from 'rxjs/operators';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  mailFolder: string = MailFolderType.INBOX;
  backFromSearchFolder: string = MailFolderType.INBOX;
  mailFolderTypes = MailFolderType;
  customFolders: Folder[] = [];
  searchText: string;
  private page: number = 1;

  constructor(public route: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      this.mailFolder = params['folder'] as MailFolderType;
      this.page = +params['page'];
    });

    this.store.select(state => state.user).pipe(takeUntil(this.destroyed$))
      .subscribe((user: UserState) => {
        this.customFolders = user.customFolders;
      });
    this.store.select(state => state.search).pipe(takeUntil(this.destroyed$))
      .subscribe((search: SearchState) => {
        this.searchText = search.searchText;
        if (this.searchText) {
          this.backFromSearchFolder = this.mailFolder;
          this.mailFolder = MailFolderType.SEARCH;
          this.router.navigateByUrl(`/mail/search/page/1`);
        } else {
          this.mailFolder = this.backFromSearchFolder;
          this.router.navigateByUrl(`/mail/${this.mailFolder}/page/${this.page}`);
        }
      });
  }

  ngOnDestroy(): void {
  }
}
