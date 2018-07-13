// Angular
import { Component, OnInit } from '@angular/core';
// Models
import { Mail, MailFolderType } from '../../store/models';
// Rxjs
import { Observable } from 'rxjs/Observable';
// Store
import { Store } from '@ngrx/store';
import { GetMails, MoveMail } from '../../store/actions';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { AppState, MailState } from '../../store/datatypes';
import { ReadMail } from '../../store/actions/mail.actions';

declare var openpgp;

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit, OnDestroy {
  mails: Mail[];
  checkedMails: Mail[] = [];
  private_key: string;
  public_key: string;
  readonly destroyed$: Observable<boolean>;

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;

  constructor(private store: Store<AppState>) {
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

  rowSelectionChanged(mail: Mail) {
    if (!this.checkedMails.includes(mail)) {
      this.checkedMails = this.checkedMails.concat(mail);
    } else {
      this.checkedMails = this.checkedMails.filter(checkedMail => checkedMail.id !== mail.id);
    }
  }

  markAsRead() {
    // Get comma separated list of mail IDs
    const ids = this.getMailIDs();
    // Modify mail to be mark as read
    const readMailList = this.checkedMails.map(mail => {
      mail.read = true;
      return mail;
    });
    // Dispatch mark as read event to store
    this.store.dispatch(new ReadMail({ ids: ids, data: readMailList }));
    // Empty list of selected mails
    this.checkedMails = [];
  }

  moveToTrash() {
    this.moveToFolder(MailFolderType.TRASH);
  }

  moveToFolder(folder: MailFolderType) {
    // Get comma separated list of mail IDs
    const ids = this.getMailIDs();
    // Dispatch mark as read event to store
    this.store.dispatch(new MoveMail({ ids: ids, folder: folder }));
    // Empty list of selected mails
    this.checkedMails = [];
  }

  isMailChecked(mail: Mail) {
    return this.checkedMails.includes(mail);
  }

  get mailFolderType() {
    return MailFolderType;
  }

  private getMailIDs() {
    // Get list of concatinated IDs from mail object list
    return this.checkedMails.reduce((mailIDList: any, mail: Mail) => [...mailIDList, mail.id], []).join(',');
  }

  ngOnDestroy() {}
}
