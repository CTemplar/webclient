import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState, MailState, MailBoxesState } from '../../../../store/datatypes';
import { Mail, MailFolderType } from '../../../../store/models';
import { Observable } from 'rxjs/Observable';
import { DeleteMail, GetMailDetailSuccess, GetMails, MoveMail, ReadMail, SetCurrentFolder, StarMail } from '../../../../store/actions';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { CreateFolderComponent } from '../../../dialogs/create-folder/create-folder.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../../../store/services';
import { SearchState } from '../../../../store/reducers/search.reducers';

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
  customFolders: string[];

  mailFolderTypes = MailFolderType;

  readonly destroyed$: Observable<boolean>;

  constructor(public store: Store<AppState>,
              private router: Router,
              private sharedService: SharedService,
              private modalService: NgbModal) {}

  ngOnInit() {
    this.store.dispatch(new SetCurrentFolder(this.mailFolder));
    if (this.fetchMails) {
      this.store.dispatch(new GetMails({ limit: 1000, offset: 0, folder: this.mailFolder }));
      this.store.select(state => state.mail).takeUntil(this.destroyed$)
        .subscribe((mailState: MailState) => {
          this.showProgress = !mailState.loaded;
          this.mails = this.sharedService.sortByDate(mailState.mails, 'created_at');
        });
    }

    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailboxes: MailBoxesState) => {
        this.customFolders = mailboxes.customFolders;
      });

    this.store.select(state => state.search).takeUntil(this.destroyed$)
      .subscribe((searchState: SearchState) => {
        // TODO: apply search
      });
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

  openMail(mail: Mail) {
    this.store.dispatch(new GetMailDetailSuccess(mail));
    this.router.navigate(['/mail/message/', mail.id]);
  }

  openCreateFolderDialog() {
    this.modalService.open(CreateFolderComponent, { centered: true, windowClass: 'modal-sm mailbox-modal' });
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
