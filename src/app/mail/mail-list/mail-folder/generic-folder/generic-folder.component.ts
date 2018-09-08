import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { DeleteMail, GetMailDetailSuccess, GetMails, MoveMail, ReadMail, SetCurrentFolder, StarMail } from '../../../../store/actions';
import { AppState, MailBoxesState, MailState, UserState } from '../../../../store/datatypes';
import { Folder, Mail, MailFolderType } from '../../../../store/models';
import { SearchState } from '../../../../store/reducers/search.reducers';
import { SharedService } from '../../../../store/services';
import { ComposeMailService } from '../../../../store/services/compose-mail.service';
import { CreateFolderComponent } from '../../../dialogs/create-folder/create-folder.component';
import { NotificationService } from '../../../../store/services/notification.service';

@TakeUntilDestroy()
@Component({
  selector: 'app-generic-folder',
  templateUrl: './generic-folder.component.html',
  styleUrls: ['./generic-folder.component.scss']
})
export class GenericFolderComponent implements OnInit, OnDestroy, OnChanges {
  @Input() mails: Mail[] = [];
  @Input() mailFolder: MailFolderType;
  @Input() showProgress: boolean;
  @Input() fetchMails: boolean;
  customFolders: Folder[];

  mailFolderTypes = MailFolderType;
  selectAll: boolean;

  userState: UserState;

  readonly AUTO_REFRESH_DURATION: number = 10000; // duration in milliseconds
  readonly destroyed$: Observable<boolean>;

  constructor(public store: Store<AppState>,
              private router: Router,
              private sharedService: SharedService,
              private modalService: NgbModal,
              private notificationService: NotificationService,
              private composeMailService: ComposeMailService) {
  }

  ngOnInit() {
    this.store.dispatch(new SetCurrentFolder(this.mailFolder));
    if (this.fetchMails) {
      this.store.dispatch(new GetMails({ limit: 1000, offset: 0, folder: this.mailFolder }));
    }
    this.store.select(state => state.mail).takeUntil(this.destroyed$)
      .subscribe((mailState: MailState) => {
        this.showProgress = !mailState.loaded || mailState.inProgress;
        if (this.fetchMails) {
          this.mails = this.sharedService.sortByDate(mailState.mails, 'created_at');
        }
      });

    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.userState = user;
      });

    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailboxes: MailBoxesState) => {
        if (mailboxes.currentMailbox) {
          this.customFolders = mailboxes.currentMailbox.customFolders;
        }
      });

    this.store.select(state => state.search).takeUntil(this.destroyed$)
      .subscribe((searchState: SearchState) => {
        // TODO: apply search
      });

    this.initializeAutoRefresh();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['mails'] && changes['mails'].currentValue) {
      let sortField = 'created_at';
      if (this.mailFolder === MailFolderType.SENT) {
        sortField = 'sent_at';
      }
      this.mails = this.sharedService.sortByDate(changes['mails'].currentValue, sortField);
    }
  }

  initializeAutoRefresh() {
    if (this.mailFolder === MailFolderType.INBOX) {
      Observable.timer(this.AUTO_REFRESH_DURATION, this.AUTO_REFRESH_DURATION).takeUntil(this.destroyed$)
        .subscribe(event => {
          this.refresh();
        });
    }
  }

  refresh(forceReload: boolean = false) {
    if (!forceReload && this.mailFolder === MailFolderType.INBOX) {
      this.store.dispatch(new GetMails({ limit: 1000, offset: 0, folder: this.mailFolder, read: false }));
    } else {
      this.store.dispatch(new GetMails({ forceReload, limit: 1000, offset: 0, folder: this.mailFolder }));
    }
  }

  markAllMails(checkAll) {
    if (checkAll) {
      this.mails.map(mail => {
        mail.marked = true;
        return mail;
      });
      this.selectAll = true;
    } else {
      this.mails.map(mail => {
        mail.marked = false;
        return mail;
      });
      this.selectAll = false;
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
    mail.starred = !mail.starred;
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

  openMail(mail: Mail) {
    if (this.mailFolder === MailFolderType.DRAFT) {
      this.composeMailService.openComposeMailDialog({ draft: mail });
    }
    else {
      this.store.dispatch(new GetMailDetailSuccess(mail));
      this.router.navigate([`/mail/${this.mailFolder}/message/`, mail.id]);
    }
  }

  /**
   * @description
   * Prime Users - Can create as many folders as they want
   * Free Users - Only allow a maximum of 3 folders per account
   */
  openCreateFolderDialog() {
    if (this.userState.isPrime) {
      this.modalService.open(CreateFolderComponent, { centered: true, windowClass: 'modal-sm mailbox-modal' });
    } else if (this.customFolders === null || this.customFolders.length < 3) {
      this.modalService.open(CreateFolderComponent, { centered: true, windowClass: 'modal-sm mailbox-modal' });
    } else {
      this.notificationService.showSnackBar('Free users can only create a maximum of 3 folders.');
    }
  }

  /**
   * @name moveToFolder
   * @description Move mails to selected folder type
   * @param {MailFolderType} folder
   */
  moveToFolder(folder: string) {
    const ids = this.getMailIDs();
    if (ids) {
      // Dispatch move to selected folder event
      this.store.dispatch(new MoveMail({
        ids,
        folder,
        sourceFolder: this.mailFolder,
        mail: this.getMarkedMails(),
        allowUndo: folder === MailFolderType.TRASH
      }));
    }
  }

  markReadMails() {
    this.mails.map(mail => {
      if (mail.read) {
        mail.marked = true;
      } else {
        mail.marked = false;
      }
      return mail;
    });
  }

  markUneadMails() {
    this.mails.map(mail => {
      if (!mail.read) {
        mail.marked = true;
      } else {
        mail.marked = false;
      }
      return mail;
    });
  }

  markStarredMails() {
    this.mails.map(mail => {
      if (mail.starred) {
        mail.marked = true;
      } else {
        mail.marked = false;
      }
      return mail;
    });
  }

  markUnstarredMails() {
    this.mails.map(mail => {
      if (!mail.starred) {
        mail.marked = true;
      } else {
        mail.marked = false;
      }
      return mail;
    });
  }

  /**
   * @name getMailIDs
   * @description Get list of comma separated IDs from mail object list
   * @returns {string} Comma separated IDs
   */
  private getMailIDs() {
    return this.getMarkedMails().map(mail => mail.id).join(',');
  }

  private getMarkedMails() {
    return this.mails.filter(mail => mail.marked);
  }

  ngOnDestroy() {
  }
}
