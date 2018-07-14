// Angular
import { Component, OnInit } from '@angular/core';
// Models
import { Mail, MailFolderType } from '../../store/models';
// Rxjs
import { Observable } from 'rxjs/Observable';
// Store
import { Store } from '@ngrx/store';
import {GetMails, MoveMail, StarMail} from '../../store/actions';
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
  markedMailsMap: Map<number, Mail> = new Map();
  private_key: string;
  public_key: string;
  readonly destroyed$: Observable<boolean>;

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute) {
    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailboxes) => {
        if (mailboxes.mailboxes[0]) {
          this.private_key = mailboxes.mailboxes[0].private_key;
          this.public_key = mailboxes.mailboxes[0].public_key;
        }
      });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const mailFolderType: MailFolderType = params['folder'] as MailFolderType;
      this.getMails( mailFolderType);
    });
    this.store.select(state => state.mail).takeUntil(this.destroyed$)
      .subscribe((mailState: MailState) => {
        this.mails = mailState.mails;
      });

  }

  getMails(mailFolderType: MailFolderType) {
    this.store.dispatch(new GetMails({ limit: 1000, offset: 0 , folder: mailFolderType }));
  }

  markSelectedMail(mail){
    if (this.markedMailsMap.has(mail.id)) {
      this.markedMailsMap.delete(mail.id);
    } else {
      this.markedMailsMap.set(mail.id, mail);
    }
  }

  markAllMails(checkAll){
    if (checkAll){
      this.mails.forEach(mail => {
        this.markedMailsMap.set(mail.id, mail);
      })
    } else {
      this.markedMailsMap = new Map();
    }
  }

  markAsRead() {
    // Get comma separated list of mail IDs
    const ids = this.getMailIDs();
    // Dispatch mark as read event to store
    this.store.dispatch(new ReadMail({ ids: ids, read: true }));
    // Empty list of selected mails
    this.markedMailsMap = new Map();
  }

  markAsStarred() {
      // Get comma separated list of mail IDs
      const ids = this.getMailIDs();
      // Dispatch mark as read event to store
      this.store.dispatch(new StarMail({ ids: ids, starred: true }));
      // Empty list of selected mails
      this.markedMailsMap = new Map();
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
    this.markedMailsMap = new Map();
  }

  get mailFolderType() {
    return MailFolderType;
  }

  private getMailIDs() {
    // Get list of concatinated IDs from mail object list
    return Array.from(this.markedMailsMap.keys()).join(',');
  }

  ngOnDestroy() {}
}
