import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/datatypes';
import { Mail, MailFolderType, mailFolderTypes } from '../../../../store/models';
import { Observable } from 'rxjs/Observable';
import { DeleteMail, GetMails, MoveMail, ReadMail, StarMail } from '../../../../store/actions';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';

@TakeUntilDestroy()
@Component({
  selector: 'app-generic-folder',
  templateUrl: './generic-folder.component.html',
  styleUrls: ['./generic-folder.component.scss']
})
export class GenericFolderComponent implements OnInit, OnDestroy {
  @Input() mails: Mail[] = [];
  @Input() mailFolder: string;
  @Input() showProgress: boolean;

  mailFolderTypes = mailFolderTypes;

  readonly destroyed$: Observable<boolean>;

  constructor(public store: Store<AppState>) {}

  ngOnInit() {}

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
    if (ids) {
      // Dispatch mark as read event to store
      this.store.dispatch(new ReadMail({ ids: ids, read: isRead }));
    }
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
    if (ids) {
      // Dispatch mark as starred event to store
      this.store.dispatch(new StarMail({ ids, starred: true }));
    }
  }

  moveToTrash() {
    if (this.mailFolder === MailFolderType.TRASH) {
      const ids = this.getMailIDs();
      // Dispatch permanent delete mails event.
      if (ids) {
        this.store.dispatch(new DeleteMail({ ids }));
      }
    } else {
      this.moveToFolder(MailFolderType.TRASH);
    }
  }

  /**
   * @name moveToFolder
   * @description Move mails to selected folder type
   * @param {MailFolderType} folder
   */
  moveToFolder(folder: MailFolderType) {
    const ids = this.getMailIDs();
    if (ids) {
      // Dispatch move to selected folder event
      this.store.dispatch(new MoveMail({ ids, folder: folder }));
    }
  }

  /**
   * @name getMailIDs
   * @description Get list of comma separated IDs from mail object list
   * @returns {string} Comma separated IDs
   */
  private getMailIDs() {
    return this.mails.filter(mail => mail.marked).map(mail => mail.id).join(',');
  }

  ngOnDestroy() {}
}
