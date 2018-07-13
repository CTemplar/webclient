// Angular
import { Component, OnInit } from '@angular/core';
// Models
import { Mail, MailFolderType } from '../../store/models';
// Rxjs
import { Observable } from 'rxjs/Observable';
// Store
import { Store } from '@ngrx/store';
import { getMails } from '../../store/selectors';
import { GetMails, MoveMail } from '../../store/actions';
import { OpenPgpService } from '../../store/services/openpgp.service';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { MailService } from '../../store/services/mail.service';
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
  checkedMailIds: number[] = [];
  checkedMails: Mail[] = [];
  private_key: string;
  public_key: string;
  passphrase: string;
  getMailsState$: Observable<any>;
  readonly destroyed$: Observable<boolean>;

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;

  constructor(private store: Store<any>, private openPgpService: OpenPgpService, private mailService: MailService) {
    this.getMailsState$ = this.store.select(getMails);
    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailboxes) => {
        if (mailboxes.mailboxes[0]) {
          this.private_key = mailboxes.mailboxes[0].private_key;
          this.public_key = mailboxes.mailboxes[0].public_key;
        }
      });
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user) => {
        if (user.mailboxes[0]) {
          this.passphrase = user.mailboxes[0].passphrase;
        }
      });
  }

  ngOnInit() {
    this.getMailsState$.subscribe((mails) => {
      this.mails = mails;
    });
    this.getMails();

  }

  getMails() {
    this.store.dispatch(new GetMails({ limit: 1000, offset: 0 }));
  }

  // == Show mail compose modal
  // == Setup click event to toggle mobile menu
  hideMailComposeModal() { // click handler
    const bool = this.isComposeVisible;
    this.isComposeVisible = false;
  }

  rowSelectionChanged(event: any, mail: Mail) {
    if (this.checkedMailIds.indexOf(mail.id) < 0) {
      this.checkedMailIds = [...this.checkedMailIds, mail.id];
      this.checkedMails = this.checkedMails.concat(mail);
    } else {
      this.checkedMailIds = this.checkedMailIds.filter(checkedMailId => checkedMailId !== mail.id);
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
    this.store.dispatch(new ReadMail({ ids: ids, data: readMailList}));
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

  get mailFolderType(){
    return MailFolderType;
  }

  private getMailIDs() {
    // Get list of concatinated IDs from mail object list
    return this.checkedMails.reduce((mailIDList: any, mail: Mail) => [...mailIDList, mail.id], []).join(',');
  }

  ngOnDestroy() {}
}
