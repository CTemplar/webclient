import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import {
  DeleteMail,
  EmptyFolder,
  GetMailDetailSuccess,
  GetMails,
  GetUnreadMailsCount,
  MoveMail,
  RevertMailsMoved,
  ReadMail,
  SetCurrentFolder,
  StarMail,
} from '../../../../store/actions';
import { AppState, MailState, SecureContent, UserState } from '../../../../store/datatypes';
import { EmailDisplay, Folder, Mail, MailFolderType } from '../../../../store/models';
import { OpenPgpService, SharedService, UsersService } from '../../../../store/services';
import { ComposeMailService } from '../../../../store/services/compose-mail.service';
import { ClearSearch } from '../../../../store/actions/search.action';

declare let Scrambler: (arg0: { target: string; random: number[]; speed: number; text: string }) => void;

@UntilDestroy()
@Component({
  selector: 'app-generic-folder',
  templateUrl: './generic-folder.component.html',
  styleUrls: ['./generic-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericFolderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() mails: Mail[] = [];

  @Input() mailFolder: MailFolderType;

  @Input() showProgress: boolean;

  @Input() fetchMails: boolean;

  @ViewChild('confirmEmptyTrashModal') confirmEmptyTrashModal: any;

  @ViewChild('delateDraftModal') delateDraftModal: any;

  @ViewChild('input') input: ElementRef;

  customFolders: Folder[];

  mailFolderTypes = MailFolderType;

  selectAll: boolean;

  checkAll = false;

  noEmailSelected = true;

  isMobile: boolean;

  folderName: string;

  disableMoveTo: boolean;

  userState: UserState;

  MAX_EMAIL_PAGE_LIMIT = 1;

  LIMIT = 20;

  OFFSET = 0;

  PAGE = 0;

  MAX_DECRYPT_NUMBER = 3;

  folderColors: any = {};

  queueForDecryptSubject: any = [];

  isEnabledToDecryptSubject = false;

  private searchText: string;

  private mailState: MailState;

  private isInitialized: boolean;

  private confirmEmptyTrashModalRef: NgbModalRef;

  private delateDraftModalRef: NgbModalRef;

  isDeleteDraftClicked = false;

  isConversationView = true;

  constructor(
    public store: Store<AppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private composeMailService: ComposeMailService,
    private cdr: ChangeDetectorRef,
    private pgpService: OpenPgpService,
    private authService: UsersService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    /**
     * Get mail state from store and follow user's actions
     */
    this.store
      .select(state => state.mail)
      .pipe(untilDestroyed(this))
      .subscribe((mailState: MailState) => {
        this.mailState = mailState;
        this.showProgress = !mailState.loaded || mailState.inProgress;
        if (this.fetchMails) {
          this.MAX_EMAIL_PAGE_LIMIT = mailState.total_mail_count;
          this.mails = [...mailState.mails];
          if (this.mails.length > 0) {
            this.getMailReceiverList();
          }
        }
        if (this.mailState.isMailsMoved) {
          this.store.dispatch(new RevertMailsMoved());
          this.refresh();
        }
        if (this.isDeleteDraftClicked) {
          this.isDeleteDraftClicked = false;
          this.refresh();
        }
        this.setIsSelectAll();
        if (
          (this.userState && this.userState.settings && this.userState.settings.is_subject_auto_decrypt) ||
          this.isEnabledToDecryptSubject
        ) {
          this.decryptAllSubjects();
        }
        this.noEmailSelected = !this.isSomeEmailsSelected();
      });
    /**
     * Get user's settings and custom folders
     */
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.userState = user;
        this.isConversationView =
          this.userState.settings && !this.userState.settings.is_conversation_mode ? false : true;
        this.customFolders = user.customFolders;
        if (this.mailFolder === MailFolderType.SEARCH) {
          user.customFolders.forEach(folder => {
            this.folderColors[folder.name] = folder.color;
          });
        }
        if (this.fetchMails && this.userState.settings && user.settings.emails_per_page) {
          this.LIMIT = user.settings.emails_per_page;
          if (this.LIMIT && this.mailFolder !== MailFolderType.SEARCH && !this.isInitialized) {
            this.isInitialized = true;
            if (this.isNeedFetchMails()) {
              this.store.dispatch(
                new GetMails({ limit: user.settings.emails_per_page, offset: this.OFFSET, folder: this.mailFolder }),
              );
            }
            if (this.mailFolder === MailFolderType.OUTBOX) {
              this.store.dispatch(new GetUnreadMailsCount());
            }
          }
        }
      });
    // Search by search text
    if (this.mailFolder === MailFolderType.SEARCH) {
      this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe(parameters => {
        if (parameters.search) {
          this.searchText = parameters.search;
          this.store.dispatch(
            new GetMails({
              forceReload: true,
              searchText: this.searchText,
              limit: this.LIMIT,
              offset: this.OFFSET,
              folder: this.mailFolder,
            }),
          );
        }
      });
    }
    /**
     * Activated router management
     */
    this.activatedRoute.paramMap.pipe(untilDestroyed(this)).subscribe((parametersMap: any) => {
      const { params } = parametersMap;
      if (params) {
        if (params.page) {
          const page = +params.page;
          if (page !== this.PAGE + 1) {
            this.PAGE = page > 0 ? page - 1 : 0;
            this.OFFSET = this.PAGE * this.LIMIT;
            this.refresh();
          }
        }
        if (params.folder) {
          this.mailFolder = params.folder as MailFolderType;
          this.disableMoveTo = this.mailFolder === MailFolderType.OUTBOX || this.mailFolder === MailFolderType.DRAFT;
          this.store.dispatch(new SetCurrentFolder(this.mailFolder));
          if (this.mailFolder !== MailFolderType.SEARCH) {
            this.store.dispatch(new ClearSearch());
          }
        }
      }
    });
    this.isMobile = window.innerWidth <= 768; // handle as mobile when window width is less than 768px
    this.folderName = this.mailFolder.charAt(0).toUpperCase() + this.mailFolder.slice(1);

    window.removeEventListener('beforeunload', this.authService.onBeforeLoader, true);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  refresh() {
    this.store.dispatch(
      new GetMails({
        forceReload: true,
        limit: this.LIMIT,
        offset: this.OFFSET,
        folder: this.mailFolder,
        searchText: this.searchText,
      }),
    );
    this.store.dispatch(new GetUnreadMailsCount());
  }

  getMailReceiverList() {
    this.mails.forEach(mail => {
      if (mail.receiver_display.length > 1) {
        mail.receiver_list = '';
        mail.receiver_display.forEach((item: EmailDisplay) => {
          if (mail.sender !== item.email && item.name) {
            const nameToCombine = item.name !== item.email.split('@')[0] ? item.name : item.email;
            if (mail.receiver_list === '') {
              mail.receiver_list = nameToCombine;
            } else {
              mail.receiver_list += `, ${nameToCombine}`;
            }
          }
        });
      } else {
        mail.receiver_list = mail.receiver_display.map((item: EmailDisplay) => item.name).join(', ');
      }
    });
  }

  selectEntire(status: boolean) {
    if (status) {
      this.checkAll = true;
    } else {
      this.checkAll = false;
      this.markAllMails(false);
    }
  }

  markAllMails(checkAll: boolean) {
    if (checkAll && !this.isSomeEmailsSelected()) {
      this.mails.forEach(mail => {
        mail.marked = true;
      });
      this.noEmailSelected = false;
    } else {
      this.mails.forEach(mail => {
        mail.marked = false;
      });
      this.noEmailSelected = true;
      this.checkAll = false;
    }

    setTimeout(() => {
      this.setIsSelectAll();
    }, 5);
  }

  isSomeEmailsSelected() {
    const count = this.mails.filter(mail => mail.marked).length;
    return count > 0 && count <= this.mails.length;
  }

  markAsRead(isRead = true) {
    // Get comma separated list of mail IDs
    const ids = this.getMailIDs();
    if (ids) {
      // Dispatch mark as read event to store
      this.store.dispatch(new ReadMail({ ids, read: isRead, folder: this.mailFolder }));
    }
  }

  toggleStarred(mail: Mail) {
    this.store.dispatch(
      new StarMail({
        ids: mail.id.toString(),
        starred: !mail.has_starred_children,
        folder: this.mailFolder,
        withChildren: true,
      }),
    );
  }

  markAsStarred(starred = true) {
    // Get comma separated list of mail IDs
    const ids = this.getMailIDs();
    if (ids) {
      // Dispatch mark as starred event to store
      this.store.dispatch(new StarMail({ ids, starred, folder: this.mailFolder, withChildren: true }));
    }
  }

  isNeedRemoveStar() {
    if (this.getMarkedMails()) {
      const starred_mails = this.getMarkedMails().filter(mail => mail.starred) || [];
      if (starred_mails.length > 0) {
        return true;
      }
    }
    return false;
  }

  isNeedAddStar() {
    if (this.getMarkedMails()) {
      const starred_mails = this.getMarkedMails().filter(mail => mail.starred) || [];
      if (starred_mails.length === this.getMarkedMails().length) {
        return false;
      }
    }
    return true;
  }

  moveToTrash() {
    if (this.mailFolder === MailFolderType.TRASH) {
      const ids = this.getMailIDs();
      // Dispatch permanent delete mails event.
      if (ids) {
        this.store.dispatch(new DeleteMail({ ids, folder: this.mailFolder }));
        this.isDeleteDraftClicked = true;
      }
    } else {
      this.moveToFolder(MailFolderType.TRASH);
    }
  }

  onDecryptSubjects() {
    if (!this.isEnabledToDecryptSubject) {
      this.isEnabledToDecryptSubject = true;
      this.decryptAllSubjects();
    }
  }

  decryptAllSubjects() {
    // debugger
    this.queueForDecryptSubject = this.queueForDecryptSubject.filter((decryptingMail: number) => {
      // Item on queue would be removed when the following condition is matched
      // 1. decrypting is finished
      // 2. mail doesn't be existed on mail list
      // 3. mail (parent, if conversation mode) is encrypted with password
      let isExistMatchMail = false;
      for (let i = 0; i < this.mails.length; i++) {
        const mail = this.mails[i];
        if (mail.id === decryptingMail) {
          isExistMatchMail = true;
          if (!mail.is_subject_encrypted) {
            return false;
          }
          if (mail.encryption && mail.encryption.password_hint) {
            return false;
          }
        }
      }
      return isExistMatchMail;
    });

    for (let i = 0; i < this.mails.length; i++) {
      if (this.queueForDecryptSubject.length < this.MAX_DECRYPT_NUMBER) {
        const mail = this.mails[i];
        if (
          mail.is_subject_encrypted &&
          !(mail.encryption && mail.encryption.password_hint) &&
          !this.queueForDecryptSubject.includes(mail.id)
        ) {
          this.processDecryptSubject(mail.id);
          this.queueForDecryptSubject.push(mail.id);
          this.scrambleText(mail.id);
        }
      } else {
        break;
      }
    }
  }

  isSubjectDecrypting(mailID: number) {
    const queuedMail = this.queueForDecryptSubject.filter((mail: number) => mail === mailID);
    return queuedMail.length > 0;
  }

  processDecryptSubject(mailId: number) {
    const mailToDecrypt = this.mails.find(mail => {
      return mail.id === mailId;
    });
    if (mailToDecrypt) {
      setTimeout(() => {
        this.pgpService.decrypt(mailToDecrypt.mailbox, mailToDecrypt.id, new SecureContent(mailToDecrypt), true);
      }, 10);
    }
  }

  confirmDeleteAll() {
    this.confirmEmptyTrashModalRef = this.modalService.open(this.confirmEmptyTrashModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal',
    });
  }

  emptyDeleteAllConfirmed() {
    this.store.dispatch(new EmptyFolder({ folder: this.mailFolder }));
    this.confirmEmptyTrashModalRef.dismiss();
  }

  confirmDeleteDraft() {
    this.delateDraftModalRef = this.modalService.open(this.delateDraftModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal',
    });
  }

  deleteDraft() {
    const ids = this.getMailIDs();
    // Dispatch permanent delete mails event.
    if (ids) {
      this.store.dispatch(new DeleteMail({ ids, folder: this.mailFolder }));
    }
    this.delateDraftModalRef.dismiss();
    this.isDeleteDraftClicked = true;
  }

  openMail(mail: Mail) {
    if (this.mailFolder === MailFolderType.DRAFT && !mail.has_children) {
      this.composeMailService.openComposeMailDialog({
        draft: mail,
        isFullScreen: this.userState.settings.is_composer_full_screen,
      });
    } else {
      // change sender display before to open mail detail, because this sender display was for last child.
      // TODO should be regression test for this part for sender_display_name
      this.store.dispatch(
        new GetMailDetailSuccess({ ...mail, sender_display: { name: mail.sender, email: mail.sender } }),
      );
      const queryParams: any = {};
      if (this.mailFolder === MailFolderType.SEARCH && this.searchText) {
        queryParams.search = this.searchText;
      }
      this.router.navigate([`/mail/${this.mailFolder}/page/${this.PAGE + 1}/message/`, mail.id], { queryParams });
    }
  }

  /**
   * @description
   * Prime Users - Can create as many folders as they want
   * Free Users - Only allow a maximum of 5 folders per account
   */
  openCreateFolderDialog() {
    this.sharedService.openCreateFolderDialog(this.userState.isPrime, this.customFolders, {
      self: this,
      method: 'moveToFolder',
    });
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
      this.store.dispatch(
        new MoveMail({
          ids,
          folder,
          sourceFolder: this.mailFolder,
          mail: this.getMarkedMails(),
          allowUndo: true,
          fromTrash: this.mailFolder === MailFolderType.TRASH,
        }),
      );
    }
  }

  markReadMails() {
    let isExist = false;
    this.mails.forEach(mail => {
      mail.marked = mail.read;
      isExist = !isExist && mail.read ? true : isExist;
    });
    this.noEmailSelected = !isExist;
    this.setIsSelectAll();
  }

  markUnreadMails() {
    let isExist = false;
    this.mails.forEach(mail => {
      mail.marked = !mail.read;
      isExist = !isExist && mail.marked ? true : isExist;
    });
    this.noEmailSelected = !isExist;
    this.setIsSelectAll();
  }

  markStarredMails() {
    let isExist = false;
    this.mails.forEach(mail => {
      mail.marked = mail.has_starred_children;
      isExist = !isExist && mail.marked ? true : isExist;
    });
    this.noEmailSelected = !isExist;
    this.setIsSelectAll();
  }

  markUnstarredMails() {
    let isExist = false;
    this.mails.forEach(mail => {
      mail.marked = !mail.has_starred_children;
      isExist = !isExist && mail.marked ? true : isExist;
    });
    this.noEmailSelected = !isExist;
    this.setIsSelectAll();
  }

  setIsSelectAll() {
    if (this.mails.length === 0) {
      this.selectAll = false;
      return;
    }
    this.selectAll = this.mails.filter(mail => mail.marked).length === this.mails.length;
  }

  prevPage() {
    if (this.PAGE > 0) {
      this.PAGE--;
      this.OFFSET = this.PAGE * this.LIMIT;
      this.store.dispatch(
        new GetMails({
          inProgress: true,
          limit: this.LIMIT,
          searchText: this.searchText,
          offset: this.OFFSET,
          folder: this.mailFolder,
        }),
      );
      this.router.navigateByUrl(`/mail/${this.mailFolder}/page/${this.PAGE + 1}`);
    }
  }

  nextPage() {
    if ((this.PAGE + 1) * this.LIMIT < this.MAX_EMAIL_PAGE_LIMIT) {
      this.OFFSET = (this.PAGE + 1) * this.LIMIT;
      this.PAGE++;
      this.store.dispatch(
        new GetMails({
          inProgress: true,
          limit: this.LIMIT,
          searchText: this.searchText,
          offset: this.OFFSET,
          folder: this.mailFolder,
        }),
      );
      this.router.navigateByUrl(`/mail/${this.mailFolder}/page/${this.PAGE + 1}`);
    }
  }

  // display scrambler while decrypt mail id
  scrambleText(mailId: number) {
    setTimeout(() => {
      Scrambler({
        target: `#subject-scramble-${mailId}`,
        random: [1000, 120000],
        speed: 70,
        text: 'A7gHc6H66A9SAQfoBJDq4C7',
      });
    }, 100);
  }

  toggleEmailSelection(mail: any) {
    mail.marked = !mail.marked;
    if (mail.marked) {
      this.noEmailSelected = false;
    } else if (this.mails.filter(email => email.marked).length > 0) {
      this.noEmailSelected = false;
    } else {
      this.noEmailSelected = true;
    }
    this.setIsSelectAll();
  }

  /**
   * @name getMailIDs
   * @description Get list of comma separated IDs from mail object list
   * @returns {string} Comma separated IDs
   */
  private getMailIDs() {
    const allString = 'all';
    let markedMails = this.getMarkedMails();
    if (markedMails.length === this.LIMIT && this.checkAll) {
      return allString;
    } else {
      return this.getMarkedMails()
        .map(mail => mail.id)
        .join(',');
    }
  }

  getMarkedMails() {
    return this.mails.filter(mail => mail.marked);
  }

  /**
   * @name isNeedFetchMails
   * @description Decide to fetch the mails from the backend by checking the deicated folder is existed [store->mailState->folders]
   * @returns {boolean} Boolean value that the mails is existed for the current folder on Store
   */
  private isNeedFetchMails() {
    const curFolderMap = this.mailState.folderMap.get(this.mailFolder);
    if (curFolderMap && (curFolderMap.is_not_first_page || curFolderMap.is_dirty)) {
      return true;
    }
    if (!curFolderMap || !curFolderMap.mails || curFolderMap.mails.length === 0) {
      return true;
    }
    return false;
  }

  /**
   * @name getMailSenderReceiverInfo
   * @description Function to get tooltip, receiver, sender info.
   * @params Mail, isToolTip
   * @returns {String} The list of email or name for sender, receiver
   */
  getMailSenderReceiverInfo(mail: Mail, isTooltip: boolean = false) {
    let info = '';
    if (this.mailFolder === this.mailFolderTypes.DRAFT) {
      info = 'Draft';
    } else if (this.mailFolder === this.mailFolderTypes.INBOX) {
      info = isTooltip
        ? mail.sender_display_name
          ? mail.sender_display_name
          : mail.sender_display.email
        : mail.sender_display_name
        ? mail.sender_display_name
        : mail.sender_display.name;
    } else if (this.mailFolder === this.mailFolderTypes.SENT || this.mailFolder === this.mailFolderTypes.OUTBOX) {
      info = mail.receiver_list;
    } else {
      // For Search, All Emails, Custom Folders
      switch (mail.folder) {
        case MailFolderType.INBOX:
          info = isTooltip
            ? mail.sender_display_name
              ? mail.sender_display_name
              : mail.sender_display.email
            : mail.sender_display_name
            ? mail.sender_display_name
            : mail.sender_display.name;
          break;

        case MailFolderType.SENT:
        case MailFolderType.OUTBOX:
          info = mail.receiver_list;
          break;

        case MailFolderType.DRAFT:
          info = 'Draft';
          break;

        default:
          if (mail.send) {
            info = mail.receiver_list;
          } else {
            info = isTooltip
              ? mail.sender_display_name
                ? mail.sender_display_name
                : mail.sender_display.email
              : mail.sender_display_name
              ? mail.sender_display_name
              : mail.sender_display.name;
          }
          break;
      }
    }
    return info;
  }

  ngOnDestroy() {}
}
