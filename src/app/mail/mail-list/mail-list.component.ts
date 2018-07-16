import { Component, OnInit } from '@angular/core';
import { MailFolderType, mailFolderTypes } from '../../store/models';
import { Observable } from 'rxjs/Observable';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { ActivatedRoute } from '@angular/router';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  mailFolder: MailFolderType = MailFolderType.INBOX;
  mailFolderTypes = mailFolderTypes;

  constructor(public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.takeUntil(this.destroyed$).subscribe(params => {
      this.mailFolder = params['folder'] as MailFolderType;
    });
  }

  ngOnDestroy(): void {
  }
}
