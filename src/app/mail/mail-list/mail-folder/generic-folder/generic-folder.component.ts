import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';

import {
  DeleteMail,
  EmptyFolder,
  GetMailDetailSuccess,
  GetMails,
  GetUnreadMailsCount,
  MoveMail,
  ReadMail,
  RevertMailsMoved,
  SetCurrentFolder,
  StarMail,
} from '../../../../store';
import { AppState, MailState, SecureContent, UserState } from '../../../../store/datatypes';
import {
  AdvancedSearchQueryParameters,
  EmailDisplay,
  Folder,
  getMailFolderName,
  Mail,
  MailFolderType,
} from '../../../../store/models';
import { OpenPgpService, SharedService, UsersService } from '../../../../store/services';
import { ComposeMailService } from '../../../../store/services/compose-mail.service';
import { ClearSearch } from '../../../../store/actions/search.action';

declare let Scrambler: (argument0: { target: string; random: number[]; speed: number; text: string }) => void;

const KEY_LEFT_CONTROL = 'ControlLeft';
const KEY_SHIFT = 'ShiftLeft';

@UntilDestroy()
@Component({
  selector: 'app-generic-folder',
  templateUrl: './generic-folder.component.html',
  styleUrls: ['./generic-folder.component.scss'],
})
export class GenericFolderComponent implements OnInit, AfterViewInit {
  @Input() mails: Mail[] = [];

  @Input() mailFolder: MailFolderType | string;

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

  private advancedSearchQuery: AdvancedSearchQueryParameters = {};

  private mailState: MailState;

  private isInitialized: boolean;

  private confirmEmptyTrashModalRef: NgbModalRef;

  private delateDraftModalRef: NgbModalRef;

  isDeleteDraftClicked = false;

  isConversationView = true;

  isKeyDownCtrlBtn = false;

  isKeyDownShiftBtn = false;

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
    private translate: TranslateService,
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
        this.isConversationView = !(this.userState.settings && !this.userState.settings.is_conversation_mode);
        this.customFolders = user.customFolders;
        if (this.mailFolder === MailFolderType.SEARCH) {
          for (const folder of user.customFolders) {
            this.folderColors[folder.name] = folder.color;
          }
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
      this.makeSearchRequest();
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
    this.folderName = this.translate.instant(getMailFolderName(this.mailFolder));

    window.removeEventListener('beforeunload', this.authService.onBeforeLoader, true);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  makeSearchRequest() {
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe(parameters => {
      if (parameters.search) {
        this.advancedSearchQuery.q = parameters.q;
        this.advancedSearchQuery.folder = parameters.folder;
        this.advancedSearchQuery.start_date = parameters.start_date;
        this.advancedSearchQuery.end_date = parameters.end_date;
        this.advancedSearchQuery.sender = parameters.sender;
        this.advancedSearchQuery.receiver = parameters.receiver;
        this.advancedSearchQuery.size = parameters.size;
        this.advancedSearchQuery.size_operator = parameters.size_operator;
        this.advancedSearchQuery.exact = parameters.exact;
        this.store.dispatch(
          new GetMails({
            forceReload: true,
            search: true,
            searchData: this.advancedSearchQuery,
            limit: this.LIMIT,
            offset: this.OFFSET,
            folder: this.mailFolder,
          }),
        );
      }
    });
  }

  refresh() {
    if (this.mailFolder === MailFolderType.SEARCH) {
      this.makeSearchRequest();
    } else {
      this.store.dispatch(
        new GetMails({
          forceReload: true,
          limit: this.LIMIT,
          offset: this.OFFSET,
          folder: this.mailFolder,
          searchText: this.searchText,
        }),
      );
    }
    this.store.dispatch(new GetUnreadMailsCount());
  }

  getMailReceiverList() {
    for (const mail of this.mails) {
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
    }
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
      for (const mail of this.mails) {
        mail.marked = true;
      }
      this.noEmailSelected = false;
    } else {
      for (const mail of this.mails) {
        mail.marked = false;
      }
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
      const starredMails = this.getMarkedMails().filter(mail => mail.starred) || [];
      if (starredMails.length > 0) {
        return true;
      }
    }
    return false;
  }

  isNeedAddStar() {
    if (this.getMarkedMails()) {
      const starredMails = this.getMarkedMails().filter(mail => mail.starred) || [];
      if (starredMails.length === this.getMarkedMails().length) {
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
    this.queueForDecryptSubject = this.queueForDecryptSubject.filter((decryptingMail: number) => {
      // Item on queue would be removed when the following condition is matched
      // 1. decrypting is finished
      // 2. mail doesn't be existed on mail list
      // 3. mail (parent, if conversation mode) is encrypted with password
      let isExistMatchMail = false;
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < this.mails.length; index++) {
        const mail = this.mails[index];
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
    // eslint-disable-next-line no-plusplus
    for (let index = 0; index < this.mails.length; index++) {
      if (this.queueForDecryptSubject.length < this.MAX_DECRYPT_NUMBER) {
        const mail = this.mails[index];
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
      const queryParameters: any = {};
      if (this.mailFolder === MailFolderType.SEARCH) {
        if (this.searchText) {
          queryParameters.search = this.searchText;
        }
        this.router.navigate(
          [`/mail/${this.mailFolder}/page/${this.PAGE + 1}/message/`, mail.parent ? mail.parent : mail.id],
          {
            queryParams: queryParameters,
          },
        );
      } else {
        if (this.isKeyDownCtrlBtn) {
          window.open(`/mail/${this.mailFolder}/page/${this.PAGE + 1}/message/${mail.id}`, '_blank');
        } else {
          this.store.dispatch(new GetMailDetailSuccess(mail));
          this.router.navigate([`/mail/${this.mailFolder}/page/${this.PAGE + 1}/message/`, mail.id], {
            queryParams: queryParameters,
          });
        }
      }
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
    for (const mail of this.mails) {
      mail.marked = mail.read;
      isExist = !isExist && mail.read ? true : isExist;
    }
    this.noEmailSelected = !isExist;
    this.setIsSelectAll();
  }

  markUnreadMails() {
    let isExist = false;
    for (const mail of this.mails) {
      mail.marked = !mail.read;
      isExist = !isExist && mail.marked ? true : isExist;
    }
    this.noEmailSelected = !isExist;
    this.setIsSelectAll();
  }

  markStarredMails() {
    let isExist = false;
    for (const mail of this.mails) {
      mail.marked = mail.has_starred_children;
      isExist = !isExist && mail.marked ? true : isExist;
    }
    this.noEmailSelected = !isExist;
    this.setIsSelectAll();
  }

  markUnstarredMails() {
    let isExist = false;
    for (const mail of this.mails) {
      mail.marked = !mail.has_starred_children;
      isExist = !isExist && mail.marked ? true : isExist;
    }
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
      this.PAGE -= 1;
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
      this.PAGE += 1;
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
        random: [1000, 120_000],
        speed: 70,
        text: 'A7gHc6H66A9SAQfoBJDq4C7',
      });
    }, 100);
  }

  toggleEmailSelection(mail: any) {
    mail.marked = !mail.marked;
    if (mail.marked && this.isKeyDownShiftBtn) {
      let selectedMailIndex = -1;
      const selectedMail = this.mails.find((mailList, index) => {
        mailList.id === mail?.id ? (selectedMailIndex = index) : (selectedMailIndex = -1);
        return mailList.id === mail?.id;
      });

      if (selectedMail) {
        const closestIndex = this.mails.reduce((closestIndex: number, currentMail: Mail, index: number) => {
          if (currentMail.id !== selectedMail.id && currentMail.marked) {
            if (closestIndex === -1) {
              return index;
            } else if (Math.abs(closestIndex - selectedMailIndex) > Math.abs(index - selectedMailIndex)) {
              return index;
            }
          }
          return closestIndex;
        }, -1);
        if (closestIndex !== -1) {
          if (closestIndex < selectedMailIndex) {
            for (let i = closestIndex; i < selectedMailIndex + 1; i += 1) {
              if (this.mails.length > i) {
                this.mails[i].marked = true;
              }
            }
          } else {
            for (let i = closestIndex; i > selectedMailIndex; i -= 1) {
              if (this.mails.length > i) {
                this.mails[i].marked = true;
              }
            }
          }
        }
      }
    }
    this.noEmailSelected = mail.marked ? false : this.mails.filter(email => email.marked).length <= 0;
    this.setIsSelectAll();
  }

  /**
   * @name getMailIDs
   * @description Get list of comma separated IDs from mail object list
   * @returns {string} Comma separated IDs
   */
  private getMailIDs() {
    const allString = 'all';
    const markedMails = this.getMarkedMails();
    if (markedMails.length === this.LIMIT && this.checkAll) {
      return allString;
    }
    return this.getMarkedMails()
      .map(mail => mail.id)
      .join(',');
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
    const currentFolderMap = this.mailState.folderMap.get(this.mailFolder);
    if (currentFolderMap && (currentFolderMap.is_not_first_page || currentFolderMap.is_dirty)) {
      return true;
    }
    return !currentFolderMap || !currentFolderMap.mails || currentFolderMap.mails.length === 0;
  }

  /**
   * @name getMailSenderReceiverInfo
   * @description Function to get tooltip, receiver, sender info.
   * @params Mail, isToolTip
   * @returns {String} The list of email or name for sender, receiver
   */
  getMailSenderReceiverInfo(mail: Mail, isTooltip = false) {
    let info = '';
    switch (this.mailFolder) {
      case this.mailFolderTypes.DRAFT: {
        info = 'Draft';

        break;
      }
      case this.mailFolderTypes.INBOX: {
        info = isTooltip
          ? mail.sender_display_name
            ? mail.sender_display_name
            : mail.sender_display.email
          : mail.sender_display_name
          ? mail.sender_display_name
          : mail.sender_display.name;

        break;
      }
      case this.mailFolderTypes.SENT:
      case this.mailFolderTypes.OUTBOX: {
        info = mail.receiver_list;
        if (mail.cc_display?.length > 0) {
          const cc = mail.cc_display.map((item: EmailDisplay) => item.name ?? item.email).join(', ');
          info = `${info}, ${cc}`;
        }
        if (mail.bcc_display?.length > 0) {
          const bcc = mail.bcc_display.map((item: EmailDisplay) => item.name ?? item.email).join(', ');
          info = `${info}, bcc: ${bcc}`;
        }

        break;
      }
      default: {
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
            if (mail.cc_display?.length > 0) {
              const cc = mail.cc_display.map((item: EmailDisplay) => item.name ?? item.email).join(', ');
              info = `${info}, ${cc}`;
            }
            if (mail.bcc_display?.length > 0) {
              const bcc = mail.bcc_display.map((item: EmailDisplay) => item.name ?? item.email).join(', ');
              info = `${info}, bcc: ${bcc}`;
            }
            break;

          case MailFolderType.DRAFT:
            info = 'Draft';
            break;

          default:
            if (mail.send) {
              info = mail.receiver_list;
              if (mail.cc_display?.length > 0) {
                const cc = mail.cc_display.map((item: EmailDisplay) => item.name ?? item.email).join(', ');
                info = `${info}, ${cc}`;
              }
              if (mail.bcc_display?.length > 0) {
                const bcc = mail.bcc_display.map((item: EmailDisplay) => item.name ?? item.email).join(', ');
                info = `${info}, bcc: ${bcc}`;
              }
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
    }
    return info;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.code === KEY_LEFT_CONTROL) {
      this.isKeyDownCtrlBtn = true;
    } else if (event.code === KEY_SHIFT) {
      this.isKeyDownShiftBtn = true;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.code === KEY_LEFT_CONTROL) {
      this.isKeyDownCtrlBtn = false;
    } else if (
      event.code === 'KeyA' &&
      this.isKeyDownCtrlBtn &&
      (!this.composeMailService.componentRefList || this.composeMailService.componentRefList.length === 0)
    ) {
      this.markAllMails(true);
    } else if (event.code === KEY_SHIFT) {
      this.isKeyDownShiftBtn = false;
    }
  }
}
