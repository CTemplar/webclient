// Angular
import { Component, OnInit } from '@angular/core';
// Models
import { Mail, MailFolderType, mailFolderTypes } from '../../store/models';
// Rxjs
import { Observable } from 'rxjs/Observable';
// Store
import { Store } from '@ngrx/store';
import { GetMails, MoveMail, StarMail } from '../../store/actions';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { AppState, MailState } from '../../store/datatypes';
import { ReadMail } from '../../store/actions/mail.actions';
import { ActivatedRoute } from '@angular/router';

declare var openpgp;

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-list',
  templateUrl: './mail-list.component.html',
  styleUrls: ['./mail-list.component.scss']
})
export class MailListComponent implements OnInit, OnDestroy {

  mails: Mail[];
  mailFolder: MailFolderType = MailFolderType.INBOX;
  mailFolderTypes = mailFolderTypes;
  private_key: string;
  public_key: string;
  readonly destroyed$: Observable<boolean>;

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;

  constructor(public store: Store<AppState>, public route: ActivatedRoute) {
    this.store
      .select(state => state.mailboxes)
      .takeUntil(this.destroyed$)
      .subscribe(mailboxes => {
        if (mailboxes.mailboxes[0]) {
          this.private_key = mailboxes.mailboxes[0].private_key;
          this.public_key = mailboxes.mailboxes[0].public_key;
        }
      });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.mailFolder = params['folder'] as MailFolderType;
    });
    this.store
      .select(state => state.mail)
      .takeUntil(this.destroyed$)
      .subscribe((mailState: MailState) => {
        this.mails = mailState.mails;
      });
  }

  getMails(mailFolderType: MailFolderType) {
    this.store.dispatch(
      new GetMails({ limit: 1000, offset: 0, folder: mailFolderType })
    );
  }

  markSelectedMail(mail) {
    mail.marked = !mail.marked;
  }

  markAllMails(checkAll) {
    if (checkAll) {
      this.mails.map(mail => {
        mail.marked = true;
        return mail;
      });
    } else {
      this.mails.map(mail => {
        mail.marked = false;
        return mail;
      });
    }
  }

  markAsRead(isRead: boolean = true) {
    // Get comma separated list of mail IDs
    const ids = this.getMailIDs();
    // Dispatch mark as read event to store
    this.store.dispatch(new ReadMail({ ids: ids, read: isRead }));
  }

  toggleStarred(mail: Mail) {
    if (mail.starred) {
      this.store.dispatch(
        new StarMail({ ids: mail.id.toString(), starred: false })
      );
    } else {
      this.store.dispatch(
        new StarMail({ ids: mail.id.toString(), starred: true })
      );
    }
  }

  markAsStarred() {
    // Get comma separated list of mail IDs
    const ids = this.getMailIDs();
    // Dispatch mark as read event to store
    this.store.dispatch(new StarMail({ ids: ids, starred: true }));
  }

  moveToTrash() {
    this.moveToFolder(MailFolderType.TRASH);
  }

  moveToFolder(folder: MailFolderType) {
    // Get comma separated list of mail IDs
    const ids = this.getMailIDs();
    // Dispatch mark as read event to store
    this.store.dispatch(new MoveMail({ ids: ids, folder: folder }));
  }

  private getMailIDs() {
    // Get list of concatinated IDs from mail object list
    return this.mails.filter(mail => mail.marked).map(mail => mail.id).join(',');
  }

  ngOnDestroy() {}
}
