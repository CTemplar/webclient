// Angular
import { Component, OnInit } from '@angular/core';
// Models
import { Mail, MailFolderType } from '../../store/models';
// Rxjs
import { Observable } from 'rxjs/Observable';
// Store
import { Store } from '@ngrx/store';
import { getMails } from '../../store/selectors';
import { GetMails } from '../../store/actions';
import { OpenPgpService } from '../../store/services/openpgp.service';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { MailService } from '../../store/services/mail.service';
import { MoveMail } from '../../store/actions/mail.actions';
import { AppState, MailState } from '../../store/datatypes';

declare var openpgp;

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit, OnDestroy {
  mails: Mail[];
  checkedMailIds: number[] = [];
  private_key: string;
  public_key: string;
  getMailsState$: Observable<any>;
  readonly destroyed$: Observable<boolean>;

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;

  constructor(private store: Store<AppState>, private openPgpService: OpenPgpService, private mailService: MailService) {
    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailboxes) => {
        if (mailboxes.mailboxes[0]) {
          this.private_key = mailboxes.mailboxes[0].private_key;
          this.public_key = mailboxes.mailboxes[0].public_key;
        }
      });
  }

  ngOnInit() {
    this.store.select(state => state.mail).takeUntil(this.destroyed$)
      .subscribe((mailState: MailState) => {
        this.mails = mailState.mails;
      });
    this.getMails();

  }

  getMails() {
    this.store.dispatch(new GetMails({ limit: 1000, offset: 0 }));
  }

  rowSelectionChanged(event: any, mail: Mail) {
    if (this.checkedMailIds.indexOf(mail.id) < 0) {
      this.checkedMailIds = [...this.checkedMailIds, mail.id];
    } else {
      this.checkedMailIds = this.checkedMailIds.filter(checkedMailId => checkedMailId !== mail.id);
    }
  }

  moveToTrash() {
    this.moveToFolder(MailFolderType.TRASH);
  }

  moveToFolder(folder: string) {
    this.store.dispatch(new MoveMail({ ids: this.checkedMailIds.join(','), folder: <MailFolderType>folder }));
  }

  ngOnDestroy() {}
}
