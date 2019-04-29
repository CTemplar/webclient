import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  DeleteMail,
  EmptyTrash,
  GetMailDetailSuccess,
  GetMails,
  GetUnreadMailsCount,
  MoveMail,
  ReadMail,
  SetCurrentFolder,
  StarMail
} from '../../../../store/actions';
import { AppState, MailState, UserState } from '../../../../store/datatypes';
import { Folder, Mail, MailFolderType } from '../../../../store/models';
import { SearchState } from '../../../../store/reducers/search.reducers';
import { SharedService } from '../../../../store/services';
import { ComposeMailService } from '../../../../store/services/compose-mail.service';

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

  @ViewChild('confirmEmptyTrashModal') confirmEmptyTrashModal;

  customFolders: Folder[];

  mailFolderTypes = MailFolderType;
  selectAll: boolean;
  noEmailSelected: boolean = true;

  userState: UserState;

  readonly destroyed$: Observable<boolean>;

  MAX_EMAIL_PAGE_LIMIT: number = 1;
  LIMIT: number = 20;
  OFFSET: number = 0;
  PAGE: number = 0;
  private searchText: string;
  private mailState: MailState;
  private isInitialized: boolean;
  private confirmEmptyTrashModalRef: NgbModalRef;

  constructor(public store: Store<AppState>,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private sharedService: SharedService,
              private composeMailService: ComposeMailService,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.store.select(state => state.mail).pipe(takeUntil(this.destroyed$))
      .subscribe((mailState: MailState) => {
        this.mailState = mailState;
        this.showProgress = !mailState.loaded || mailState.inProgress;
        if (this.fetchMails) {
          this.MAX_EMAIL_PAGE_LIMIT = mailState.total_mail_count;
          this.mails = this.sharedService.sortByDate(mailState.mails, 'created_at');
        }
      });

    this.store.select(state => state.user).pipe(takeUntil(this.destroyed$))
      .subscribe((user: UserState) => {
        this.userState = user;
        this.customFolders = user.customFolders;
        if (this.fetchMails && this.userState.settings && user.settings.emails_per_page) {
          this.LIMIT = user.settings.emails_per_page;
          if (this.LIMIT && this.mailFolder !== MailFolderType.SEARCH && !this.isInitialized) {
            this.isInitialized = true;
            this.store.dispatch(new GetMails({ limit: user.settings.emails_per_page, offset: this.OFFSET, folder: this.mailFolder }));
          }
        }
      });

    this.store.select(state => state.search).pipe(takeUntil(this.destroyed$))
      .subscribe((searchState: SearchState) => {
        this.searchText = searchState.searchText;
        if (this.searchText) {
          this.store.dispatch(new GetMails({
            forceReload: true,
            searchText: this.searchText,
            limit: this.LIMIT,
            offset: this.OFFSET,
            folder: this.mailFolder
          }));
          return;
        }
      });

    this.activatedRoute.paramMap.pipe(takeUntil(this.destroyed$))
      .subscribe((paramsMap: any) => {
        const params: any = paramsMap.params;
        if (params) {
          if (params.page) {
            const page = +params.page;
            if (page !== this.PAGE + 1) {
              this.PAGE = page > 0 ? page - 1 : 0;
              this.OFFSET = this.PAGE * this.LIMIT;
              this.refresh(true);
            }
          }
          if (params.folder) {
            this.mailFolder = params.folder as MailFolderType;
            this.store.dispatch(new SetCurrentFolder(this.mailFolder));
          }
        }
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

  refresh(forceReload: boolean = false, isForcedByUser?: boolean) {
    if (!forceReload && this.mailFolder === MailFolderType.INBOX) {
      this.store.dispatch(new GetMails({ limit: this.LIMIT, offset: 0, folder: this.mailFolder, read: false, seconds: 300 }));
    } else {
      this.store.dispatch(new GetMails({ forceReload, limit: this.LIMIT, offset: this.OFFSET, folder: this.mailFolder }));
      if (isForcedByUser) {
        this.store.dispatch(new GetUnreadMailsCount());
      }
    }
  }

  markAllMails(checkAll) {
    if (checkAll) {
      this.mails.map(mail => {
        mail.marked = true;
        return mail;
      });
      this.selectAll = true;
      this.noEmailSelected = false;
    } else {
      this.mails.map(mail => {
        mail.marked = false;
        return mail;
      });
      this.selectAll = false;
      this.noEmailSelected = true;
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
    if (this.mailFolder === MailFolderType.STARRED) {
      setTimeout(() => {
        this.mails.splice(this.mails.indexOf(mail), 1);
      }, 1000);
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

  confirmEmptyTrash() {
    this.confirmEmptyTrashModalRef = this.modalService.open(this.confirmEmptyTrashModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
  }

  emptyTrashConfirmed() {
    this.store.dispatch(new EmptyTrash());
    this.confirmEmptyTrashModalRef.dismiss();
  }

  openMail(mail: Mail) {
    if (this.mailFolder === MailFolderType.DRAFT) {
      this.composeMailService.openComposeMailDialog({ draft: mail });
    } else {
      // change sender display before to open mail detail, because this sender display was for last child.
      this.store.dispatch(new GetMailDetailSuccess({ ...mail, sender_display: { name: mail.sender, email: mail.sender } }));
      this.router.navigate([`/mail/${this.mailFolder}/page/${this.PAGE + 1}/message/`, mail.id]);
    }
  }

  /**
   * @description
   * Prime Users - Can create as many folders as they want
   * Free Users - Only allow a maximum of 3 folders per account
   */
  openCreateFolderDialog() {
    this.sharedService.openCreateFolderDialog(this.userState.isPrime, this.customFolders);
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
    setTimeout(() => {
      this.refresh(true);
    }, 2000);
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

  prevPage() {
    if (this.PAGE > 0) {
      this.PAGE--;
      this.OFFSET = this.PAGE * this.LIMIT;
      this.store.dispatch(new GetMails({
        inProgress: true,
        limit: this.LIMIT,
        searchText: this.searchText,
        offset: this.OFFSET,
        folder: this.mailFolder
      }));
      this.router.navigateByUrl(`/mail/${this.mailFolder}/page/${this.PAGE + 1}`);
    }
  }

  nextPage() {
    if (((this.PAGE + 1) * this.LIMIT) < this.MAX_EMAIL_PAGE_LIMIT) {
      this.OFFSET = (this.PAGE + 1) * this.LIMIT;
      this.PAGE++;
      this.store.dispatch(new GetMails({
        inProgress: true,
        limit: this.LIMIT,
        searchText: this.searchText,
        offset: this.OFFSET,
        folder: this.mailFolder
      }));
      this.router.navigateByUrl(`/mail/${this.mailFolder}/page/${this.PAGE + 1}`);
    }
  }


  toggleEmailSelection(mail, event) {
    mail.marked = event;
    if (event) {
      this.noEmailSelected = false;
    } else {
      if (this.mails.filter(m => m.marked === true).length > 0) {
        this.noEmailSelected = false;
      } else {
        this.noEmailSelected = true;
      }
    }
  }

  /**
   * @name getMailIDs
   * @description Get list of comma separated IDs from mail object list
   * @returns {string} Comma separated IDs
   */
  private getMailIDs() {
    return this.getMarkedMails().map(mail => mail.id).join(',');
  }


  getMarkedMails() {
    return this.mails.filter(mail => mail.marked);
  }

  ngOnDestroy() {
    this.store.dispatch(new SetCurrentFolder(''));
  }
}
