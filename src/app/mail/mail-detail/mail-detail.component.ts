import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { PRIMARY_WEBSITE, SummarySeparator } from '../../shared/config';
import { FilenamePipe } from '../../shared/pipes/filename.pipe';
import { EmailFormatPipe } from '../../shared/pipes/email-formatting.pipe';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { WebSocketState } from '../../store';
import {
  DeleteMail,
  DeleteMailForAll,
  GetMailDetailSuccess,
  GetMails,
  MoveMail,
  SendMail,
  SnackErrorPush,
  StarMail,
  WhiteListAdd,
} from '../../store/actions';
import { ClearMailDetail, GetMailDetail, ReadMail } from '../../store/actions/mail.actions';
import { AppState, MailAction, MailBoxesState, MailState, SecureContent, UserState } from '../../store/datatypes';
import { Attachment, Folder, Mail, Mailbox, MailFolderType } from '../../store/models/mail.model';
import { LOADING_IMAGE, MailService, OpenPgpService, SharedService } from '../../store/services';
import { ComposeMailService } from '../../store/services/compose-mail.service';
import { DateTimeUtilService } from '../../store/services/datetime-util.service';

declare let Scrambler;

@UntilDestroy()
@Component({
  selector: 'app-mail-detail',
  templateUrl: './mail-detail.component.html',
  styleUrls: ['./mail-detail.component.scss'],
})
export class MailDetailComponent implements OnInit, OnDestroy {
  @ViewChild('forwardAttachmentsModal') forwardAttachmentsModal;
  @ViewChild('includeAttachmentsModal') includeAttachmentsModal;
  @ViewChild('incomingHeadersModal') incomingHeadersModal;

  mail: Mail;

  composeMailData: any = {};

  mailFolderTypes = MailFolderType;

  decryptedContents: any = {};

  decryptedContentsPlain: any = {};

  decryptedAttachments: any = {};

  decryptedHeaders: any = {};

  selectedHeaders: string;

  mailOptions: any = {};

  selectedMailToForward: Mail;
  selectedMailToInclude: Mail;

  isDecrypting: any = {};

  parentMailCollapsed = true;

  childMailCollapsed: boolean[] = [];

  mailFolder: MailFolderType;

  customFolders: Folder[] = [];

  showGmailExtraContent: boolean;

  folderColors: any = {};

  markedAsRead: boolean;

  currentMailIndex: number;

  currentMailNumber: any;

  MAX_EMAIL_PAGE_LIMIT = 1;

  OFFSET = 0;

  loadingImage = LOADING_IMAGE;

  disableMoveTo: boolean;

  isMobile: boolean;

  primaryWebsite = PRIMARY_WEBSITE;

  showRawContent: any = {};

  isDarkMode: boolean;

  isConversationView: boolean;

  forceLightMode: boolean;

  progressBar: boolean;

  disableExternalImages: boolean;

  includeOriginMessage: boolean;

  xssPipe = SafePipe;

  hasDraft = false;

  plainTextViewState: any = {};

  private currentMailbox: Mailbox;

  private forwardAttachmentsModalRef: NgbModalRef;

  private includeAttachmentsModalRef: NgbModalRef;

  private userState: UserState;

  private mailboxes: Mailbox[];

  private canScroll = true;

  private page: number;

  private mails: Mail[] = [];

  private EMAILS_PER_PAGE: number;

  private shouldChangeMail = 0;

  // If you are in non-trash folder, this means to show trash children or not
  // If you are in trash folder, means to show non-trash children or not
  private isShowTrashRelatedChildren: boolean = false;

  // indicate to contain trash / non-trash children on the conversation
  private isContainTrashRelatedChildren: boolean = false;

  private properFolderLastChildIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private store: Store<AppState>,
    private pgpService: OpenPgpService,
    private shareService: SharedService,
    private router: Router,
    private composeMailService: ComposeMailService,
    private dateTimeUtilService: DateTimeUtilService,
    private modalService: NgbModal,
    private mailService: MailService,
  ) {}

  ngOnInit() {
    SafePipe.hasExternalImages = false;
    /**
     * Check getting mail is succeeded
     */
    this.store
      .select(state => state.webSocket)
      .pipe(untilDestroyed(this))
      .subscribe((webSocketState: WebSocketState) => {
        if (webSocketState.message && !webSocketState.isClosed) {
          if (
            this.mail &&
            (webSocketState.message.id === this.mail.id || webSocketState.message.parent_id === this.mail.id)
          ) {
            this.store.dispatch(new GetMailDetailSuccess(webSocketState.message.mail));
            if (!webSocketState.message.mail.read) {
              this.markAsRead(this.mail.id);
            }
          }
        }
      });
    /**
     * Get mails from DB
     */
    this.store
      .select(state => state.mail)
      .pipe(untilDestroyed(this))
      .subscribe((mailState: MailState) => {
        this.mails = [...mailState.mails];
        if (this.shouldChangeMail && mailState.loaded) {
          if (this.shouldChangeMail === 1) {
            this.mail.id = this.mails[this.mails.length - 1].id;
            this.changeMail(this.mails.length - 1);
          } else if (this.shouldChangeMail === 2) {
            this.mail.id = this.mails[0].id;
            this.changeMail(0);
          }
          this.shouldChangeMail = 0;
        }
        if (mailState.mailDetail && mailState.noUnreadCountChange) {
          this.mail = mailState.mailDetail;
          if (this.mail.is_subject_encrypted) {
            this.scrambleText('subject-scramble');
          }
          this.mail.has_children = this.mail.has_children || (this.mail.children && this.mail.children.length > 0);
          const decryptedContent = mailState.decryptedContents[this.mail.id];
          if (this.mail.folder === MailFolderType.OUTBOX && !this.mail.is_encrypted) {
            this.decryptedContents[this.mail.id] = this.mail.content;
          } else {
            if (
              !this.mail.has_children &&
              this.mail.content != undefined &&
              !this.isDecrypting[this.mail.id] &&
              (!decryptedContent ||
                (!decryptedContent.inProgress &&
                  decryptedContent.content == undefined &&
                  this.mail.content != undefined))
            ) {
              this.isDecrypting[this.mail.id] = true;
              this.pgpService.decrypt(this.mail.mailbox, this.mail.id, new SecureContent(this.mail));
            }
            if (decryptedContent && !decryptedContent.inProgress && decryptedContent.content != undefined) {
              this.decryptedContents[this.mail.id] = this.mail.is_html
                ? decryptedContent.content.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
                : decryptedContent.content;
              if (this.mail.is_subject_encrypted) {
                this.mail.subject = decryptedContent.subject;
              }
              this.decryptedContentsPlain[this.mail.id] = decryptedContent.content_plain;
              this.decryptedHeaders[this.mail.id] = this.parseHeaders(decryptedContent.incomingHeaders);
              this.handleEmailLinks();

              // Automatically scrolls to last element in the list
              // Class name .last-child is set inside the template
              if (this.canScroll && this.mail.children && this.mail.children.length > 0) {
                setTimeout(() => {
                  this.canScroll = false;
                }, 3000);
                this.scrollTo(document.querySelector('.last-child'));
              }
              // Mark mail as read
              if (!this.mail.read && !this.markedAsRead) {
                this.markedAsRead = true;
                this.markAsRead(this.mail.id);
              }
            }
          }
          if (!this.mailOptions[this.mail.id]) {
            this.mailOptions[this.mail.id] = {};
          }
          if (this.mail.children && this.mail.children.length > 0) {
            // find the latest child with trash/non-trash folder
            let filteredChildren = [];
            if (this.mailFolder === MailFolderType.TRASH) {
              filteredChildren = this.mail.children.filter(child => child.folder === MailFolderType.TRASH);
            } else {
              filteredChildren = this.mail.children.filter(child => child.folder !== MailFolderType.TRASH);
            }
            if (filteredChildren.length > 0) this.decryptChildEmails(filteredChildren[filteredChildren.length - 1]);
            if (this.childMailCollapsed.length !== this.mail.children.length) {
              this.parentMailCollapsed = true;
              // Collapse all emails by default
              this.childMailCollapsed = this.makeArrayOf(true, this.mail.children.length);
              // Do not collapse the last email in the list, needs to consider the proper folder
              if (filteredChildren.length > 0) {
                this.properFolderLastChildIndex = this.mail.children.findIndex(
                  child => child.id === filteredChildren[filteredChildren.length - 1].id,
                );
                this.childMailCollapsed[this.properFolderLastChildIndex] = false;
              } else {
                this.childMailCollapsed[this.mail.children.length - 1] = false;
              }
            }
            this.mail.children.forEach(child => {
              this.backupChildDecryptedContent(child, mailState);
            });
            setTimeout(() => {
              if (this.mail) {
                if (
                  !this.isDecrypting[this.mail.id] &&
                  this.mail.content &&
                  (!decryptedContent ||
                    (!decryptedContent.inProgress && !decryptedContent.content && this.mail.content))
                ) {
                  this.isDecrypting[this.mail.id] = true;
                  this.pgpService.decrypt(this.mail.mailbox, this.mail.id, new SecureContent(this.mail));
                }
              }
            }, 1000);
          } else {
            this.parentMailCollapsed = false;
          }
        }
        if (mailState.mailDetailLoaded) {
          this.progressBar = true;
        }
        if (this.mails.length > 0 && this.mail && mailState.loaded) {
          this.MAX_EMAIL_PAGE_LIMIT = mailState.total_mail_count;
          this.currentMailIndex = this.mails.findIndex(item => item.id === this.mail.id);
          this.currentMailNumber = this.EMAILS_PER_PAGE * (this.page - 1) + this.currentMailIndex + 1 || '-';
        }
        if (
          !mailState.loaded &&
          this.mails.length === 0 &&
          !mailState.inProgress &&
          this.EMAILS_PER_PAGE &&
          this.mailFolder !== MailFolderType.SEARCH
        ) {
          this.store.dispatch(
            new GetMails({
              limit: this.EMAILS_PER_PAGE,
              inProgress: true,
              offset: this.OFFSET,
              folder: this.mailFolder,
            }),
          );
        }

        if (this.mail && this.mail.children) {
          const draft_children = this.mail.children.filter(child => child.folder === 'draft');
          draft_children.length > 0 ? (this.hasDraft = true) : (this.hasDraft = false);
          // Get whether this contains trash/non-trash children
          if (
            (this.mailFolder !== MailFolderType.TRASH &&
              (this.mail.children.filter(child => child.folder === MailFolderType.TRASH).length > 0 ||
                this.mail.folder === MailFolderType.TRASH)) ||
            (this.mailFolder === MailFolderType.TRASH &&
              (this.mail.children.filter(child => child.folder !== MailFolderType.TRASH).length > 0 ||
                this.mail.folder !== MailFolderType.TRASH))
          ) {
            this.isContainTrashRelatedChildren = true;
          } else {
            this.isContainTrashRelatedChildren = false;
          }
        }
      });

    this.store
      .select(state => state.mailboxes)
      .pipe(untilDestroyed(this))
      .subscribe((mailBoxesState: MailBoxesState) => {
        this.currentMailbox = mailBoxesState.currentMailbox;
        this.mailboxes = mailBoxesState.mailboxes;
      });
    /**
     * Get folder and page from route
     */
    this.route.params.pipe(untilDestroyed(this)).subscribe(parameters => {
      const id = +parameters.id;
      this.mailFolder = parameters.folder as MailFolderType;
      this.disableMoveTo = this.mailFolder === MailFolderType.OUTBOX || this.mailFolder === MailFolderType.DRAFT;
      this.page = +parameters.page;
      this.getMailDetail(id);
    });
    /**
     * Get user settings
     */
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.customFolders = user.customFolders;
        user.customFolders.forEach(folder => {
          this.folderColors[folder.name] = folder.color;
        });
        this.userState = user;
        this.isDarkMode = this.userState.settings.is_night_mode;
        this.isConversationView = this.userState.settings.is_conversation_mode;
        this.EMAILS_PER_PAGE = user.settings.emails_per_page;
        this.disableExternalImages = this.userState.settings.is_disable_loading_images;
        this.includeOriginMessage = this.userState.settings.include_original_message;
      });

    this.isMobile = window.innerWidth <= 768;
    this.activatedRoute.queryParams.pipe(untilDestroyed(this)).subscribe((parameters: Params) => {
      this.forceLightMode = parameters.lightMode;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobile = window.innerWidth <= 768;
  }

  scrambleText(elementId: string) {
    if (!this.decryptedContents[this.mail.id]) {
      setTimeout(() => {
        Scrambler({
          target: `#${elementId}`,
          random: [1000, 120000],
          speed: 70,
          text: 'A7gHc6H66A9SAQfoBJDq4C7',
        });
      }, 100);
    }
  }

  changeMail(index: number) {
    if (index < 0 || index >= this.mails.length) {
      if (index >= this.EMAILS_PER_PAGE) {
        this.shouldChangeMail = 2;
        this.page++;
      } else if (index <= 0 && this.page > 1) {
        this.page--;
        this.shouldChangeMail = 1;
      } else {
        return;
      }
      this.store.dispatch(
        new GetMails({
          forceReload: true,
          limit: this.EMAILS_PER_PAGE,
          offset: this.EMAILS_PER_PAGE * (this.page - 1),
          folder: this.mailFolder,
        }),
      );
      return;
    }
    this.mail = null;
    setTimeout(() => {
      this.markedAsRead = false;
      this.router.navigateByUrl(`/mail/${this.mailFolder}/page/${this.page}/message/${this.mails[index].id}`);
    }, 500);
  }

  /**
   * Input email links to compose receivers
   */
  handleEmailLinks() {
    setTimeout(() => {
      const self = this;
      const anchorElements = document.querySelectorAll('a');
      for (const i in anchorElements) {
        if (anchorElements.hasOwnProperty(i) && anchorElements[i].href.indexOf('mailto:') === 0) {
          const receivers = [anchorElements[i].href.split('mailto:')[1]];
          anchorElements[i].addEventListener('click', event => {
            event.preventDefault();
            self.composeMailService.openComposeMailDialog({
              receivers,
              isFullScreen: this.userState.settings.is_composer_full_screen,
            });
          });
          anchorElements[i].href = '';
        }
      }
    }, 1000);
  }

  viewEmailInLightMode() {
    const win = window.open(`${document.location.href}?lightMode=true`, '_blank');
    win.focus();
  }

  isNeedRemoveStar(mail: Mail): boolean {
    if (!mail) {
      return false;
    }
    if (mail && !this.isConversationView) {
      return mail.starred;
    }
    if (mail && mail.starred) {
      return true;
    }
    if (mail.children && mail.children.length > 0) {
      return mail.children.some(child => child.starred) || mail.starred;
    }
    return false;
  }

  isNeedAddStar(mail: Mail): boolean {
    if (!mail) {
      return false;
    }
    if (mail && !this.isConversationView) {
      return !mail.starred;
    }
    if (mail && !mail.starred) {
      return true;
    }
    if (mail.children && mail.children.length > 0) {
      return mail.children.some(child => !child.starred) || !mail.starred;
    }
    return false;
  }

  toggleGmailExtra(mail: Mail) {
    if (!this.mailOptions[mail.id]) {
      this.mailOptions[mail.id] = {};
    }
    this.mailOptions[mail.id].showGmailExtraContent = !this.mailOptions[mail.id].showGmailExtraContent;
  }

  makeArrayOf(value, length) {
    const array = [];
    let i = length;
    while (i--) {
      array[i] = value;
    }
    return array;
  }

  decryptChildEmails(child: Mail) {
    if (child.folder === MailFolderType.OUTBOX && !child.is_encrypted) {
      this.decryptedContents[child.id] = child.content;
    } else {
      const childDecryptedContent = this.decryptedContents[child.id];
      if (
        !this.isDecrypting[child.id] &&
        (!childDecryptedContent ||
          (!childDecryptedContent.inProgress && !childDecryptedContent.content && child.content))
      ) {
        this.isDecrypting[child.id] = true;
        this.pgpService.decrypt(child.mailbox, child.id, new SecureContent(child));
      }
    }
  }

  backupChildDecryptedContent(child: Mail, mailState: MailState) {
    if (child.folder === MailFolderType.OUTBOX && !child.is_encrypted) {
      this.decryptedContents[child.id] = child.content;
    } else {
      const childDecryptedContent = mailState.decryptedContents[child.id];
      if (childDecryptedContent && !childDecryptedContent.inProgress && childDecryptedContent.content) {
        const decryptedContents = child.is_html
          ? childDecryptedContent.content.replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
          : childDecryptedContent.content;
        this.decryptedContents[child.id] = decryptedContents;
        this.decryptedContentsPlain[child.id] = childDecryptedContent.content_plain;
        if (child.is_subject_encrypted) {
          child.subject = childDecryptedContent.subject;
        }
        this.decryptedHeaders[child.id] = this.parseHeaders(childDecryptedContent.incomingHeaders);
        this.handleEmailLinks();
      }
    }
    if (!this.mailOptions[child.id]) {
      this.mailOptions[child.id] = {};
    }
  }

  /**
   * Parse headers with new json format from origin headers
   */
  parseHeaders(headers: any) {
    if (!headers) {
      return [];
    }
    headers = JSON.parse(headers);
    const headersArray = [];
    headers.forEach(header => {
      Object.keys(header).map(key => {
        if (header.hasOwnProperty(key)) {
          headersArray.push({ key, value: header[key] });
        }
      });
    });
    return headersArray;
  }

  getMailDetail(messageId: number) {
    this.store.dispatch(new GetMailDetail({ messageId, folder: this.mailFolder }));
  }

  // TODO: Merge with display-secure-message and compose-mail components
  decryptAttachment(attachment: Attachment, mail: Mail) {
    if (attachment.is_encrypted) {
      if (this.decryptedAttachments[attachment.id]) {
        if (!this.decryptedAttachments[attachment.id].inProgress) {
          this.downloadAttachment(this.decryptedAttachments[attachment.id]);
        }
      } else {
        this.decryptedAttachments[attachment.id] = { ...attachment, inProgress: true };
        this.mailService.getAttachment(attachment).subscribe(
          response => {
            if (!attachment.name) {
              attachment.name = FilenamePipe.tranformToFilename(attachment.document);
            }
            const fileInfo = { attachment, type: response.file_type };
            this.pgpService
              .decryptAttachment(mail.mailbox, response.data, fileInfo)
              .pipe(take(1))
              .subscribe(
                (decryptedAttachment: Attachment) => {
                  this.decryptedAttachments[attachment.id] = { ...decryptedAttachment, inProgress: false };
                  this.downloadAttachment(decryptedAttachment);
                },
                error => console.log(error),
              );
          },
          errorResponse =>
            this.store.dispatch(
              new SnackErrorPush({
                message: errorResponse.error || 'Failed to download attachment.',
              }),
            ),
        );
      }
    }
  }

  downloadAttachment(attachment: Attachment) {
    this.shareService.downloadFile(attachment.decryptedDocument);
  }

  markAsStarred(starred = true, withChildren: boolean = true) {
    this.store.dispatch(new StarMail({ ids: `${this.mail.id}`, starred, withChildren }));
  }

  markAsRead(mailID: number, read = true) {
    this.store.dispatch(new ReadMail({ ids: mailID.toString(), read }));
    if (!read) {
      this.goBack();
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ClearMailDetail(this.mail || {}));
  }

  showIncomingHeaders(mail: Mail) {
    this.selectedHeaders = this.decryptedHeaders[mail.id];
    this.modalService.open(this.incomingHeadersModal, {
      centered: true,
      windowClass: this.selectedHeaders.length === 0 ? 'modal-sm' : '',
    });
  }

  setActionParent(mail: Mail, isChildMail: boolean, mainReply: boolean) {
    if (!isChildMail && mainReply) {
      if (this.mail.children && this.mail.children.length > 0) {
        this.composeMailData[mail.id].action_parent_id = this.mail.children[this.mail.children.length - 1].id;
      } else {
        this.composeMailData[mail.id].action_parent_id = this.mail.id;
      }
    } else {
      this.composeMailData[mail.id].action_parent_id = mail.id;
    }
  }

  onReply(mail: Mail, index = 0, isChildMail?: boolean, mainReply = false) {
    const previousMails = this.getPreviousMail(index, isChildMail, mainReply);
    const allRecipients = new Set([...mail.receiver, mail.sender, mail.cc, mail.bcc]);
    let parentId = this.mail.id;
    if (!this.isConversationView && this.mail.parent) {
      parentId = this.mail.parent;
    }
    this.composeMailData[mail.id] = {
      subject: `Re: ${mail.subject}`,
      parentId: parentId,
      content: this.getMessageHistory(previousMails),
      selectedMailbox: this.mailboxes.find(mailbox => allRecipients.has(mailbox.email)),
    };
    if (mail.reply_to && mail.reply_to.length > 0) {
      this.composeMailData[mail.id].receivers = mail.reply_to;
    } else {
      let lastSender = '';
      let lastReceiver = '';
      if (mail.children && mail.children.length) {
        for (let i = mail.children.length; i > 0; i--) {
          if (mail.children[i - 1].folder !== 'trash') {
            lastSender = mail.children[i - 1].sender;
            lastReceiver = mail.children[i - 1].receiver[0];
            break;
          }
        }
        if (lastSender && lastReceiver) {
          this.composeMailData[mail.id].receivers =
            lastSender !== this.currentMailbox.email ? [lastSender] : [lastReceiver];
        } else {
          this.composeMailData[mail.id].receivers =
            mail.sender !== this.currentMailbox.email ? [mail.sender] : this.mail.receiver;
        }
      } else {
        this.composeMailData[mail.id].receivers =
          mail.sender !== this.currentMailbox.email ? [mail.sender] : this.mail.receiver;
      }
    }
    this.selectedMailToInclude = mail;
    this.composeMailData[mail.id].action = MailAction.REPLY;
    this.setActionParent(mail, isChildMail, mainReply);
    if (mail.attachments.length > 0) {
      this.includeAttachmentsModalRef = this.modalService.open(this.includeAttachmentsModal, {
        centered: true,
        windowClass: 'modal-sm users-action-modal',
      });
    } else {
      this.confirmIncludeAttachments();
    }
    // this.mailOptions[mail.id].isComposeMailVisible = true;
  }

  onReplyAll(mail: Mail, index = 0, isChildMail?: boolean, mainReply = false) {
    const previousMails = this.getPreviousMail(index, isChildMail, mainReply);
    this.composeMailData[mail.id] = {
      subject: `Re: ${mail.subject}`,
      parentId: this.mail.id,
      content: this.getMessageHistory(previousMails),
      selectedMailbox: this.mailboxes.find(mailbox => mail.receiver.includes(mailbox.email)),
    };
    if (mail.sender !== this.currentMailbox.email) {
      const receivers = [mail.sender, ...mail.receiver, ...mail.cc, ...mail.bcc];
      this.composeMailData[mail.id].receivers = receivers;
    } else {
      this.composeMailData[mail.id].receivers = Array.isArray(mail.receiver)
        ? [...mail.receiver, ...mail.cc, ...mail.bcc]
        : [mail.receiver, ...mail.cc, ...mail.bcc];
    }
    this.composeMailData[mail.id].receivers = this.composeMailData[mail.id].receivers.filter(
      email => email !== this.currentMailbox.email,
    );
    this.selectedMailToInclude = mail;
    this.composeMailData[mail.id].action = MailAction.REPLY_ALL;
    this.setActionParent(mail, isChildMail, mainReply);
    if (mail.attachments.length > 0) {
      this.includeAttachmentsModalRef = this.modalService.open(this.includeAttachmentsModal, {
        centered: true,
        windowClass: 'modal-sm users-action-modal',
      });
    } else {
      this.confirmIncludeAttachments();
    }
  }

  confirmIncludeAttachments(shouldInclude?: boolean) {
    if (shouldInclude) {
      this.composeMailData[this.selectedMailToInclude.id].forwardAttachmentsMessageId = this.selectedMailToInclude.id;
    }
    this.mailOptions[this.selectedMailToInclude.id].isComposeMailVisible = true;
    this.selectedMailToInclude = null;
    if (this.includeAttachmentsModalRef) {
      this.includeAttachmentsModalRef.dismiss();
    }
  }

  onForward(mail: Mail, index = 0, isChildMail?: boolean, mainReply = false) {
    this.composeMailData[mail.id] = {
      content: this.getForwardMessageSummary(mail),
      subject: `Fwd: ${this.mail.subject}`,
      selectedMailbox: this.mailboxes.find(mailbox => mail.receiver.includes(mailbox.email)),
    };
    this.selectedMailToForward = mail;
    this.composeMailData[mail.id].action = MailAction.FORWARD;
    this.setActionParent(mail, isChildMail, mainReply);
    if (mail.attachments.length > 0) {
      this.forwardAttachmentsModalRef = this.modalService.open(this.forwardAttachmentsModal, {
        centered: true,
        windowClass: 'modal-sm users-action-modal',
      });
    } else {
      this.confirmForwardAttachments();
    }
  }

  confirmForwardAttachments(shouldForward?: boolean) {
    if (shouldForward) {
      this.composeMailData[this.selectedMailToForward.id].forwardAttachmentsMessageId = this.selectedMailToForward.id;
    }
    this.mailOptions[this.selectedMailToForward.id].isComposeMailVisible = true;
    this.selectedMailToForward = null;
    if (this.forwardAttachmentsModalRef) {
      this.forwardAttachmentsModalRef.dismiss();
    }
  }

  onComposeMailHide(mail: Mail) {
    this.composeMailData[mail.id] = {};
    this.mailOptions[mail.id].isComposeMailVisible = false;
  }

  onDelete(mail: Mail, index?: number, withChildren = true) {
    if (mail.folder === MailFolderType.TRASH && this.mailFolder === MailFolderType.TRASH) {
      this.store.dispatch(new DeleteMail({ ids: mail.id.toString(), parent_only: !withChildren }));
      if (
        this.mail.children &&
        !this.mail.children.filter(child => child.id !== mail.id).some(child => child.folder === MailFolderType.TRASH)
      ) {
        this.changeMailAfterDelete(this.currentMailIndex + 1);
      }
    } else {
      this.store.dispatch(
        new MoveMail({
          ids: mail.id,
          folder: MailFolderType.TRASH,
          sourceFolder: mail.folder,
          mail,
          allowUndo: true,
          withChildren,
        }),
      );
      if (index !== -1) {
        this.onDeleteCollapseMail(index);
      }
    }
    let excepted_children = [];
    if (this.mail.children) {
      excepted_children =
        this.mailFolder === this.mailFolderTypes.TRASH
          ? this.mail.children.filter(child => child.folder === this.mailFolderTypes.TRASH)
          : this.mail.children.filter(child => child.folder !== this.mailFolderTypes.TRASH);
      excepted_children = excepted_children.filter(child => child.id !== mail.id);
    }
    if (
      (mail.id === this.mail.id && (withChildren || !excepted_children || excepted_children.length === 0)) ||
      (mail.id !== this.mail.id &&
        (!excepted_children || excepted_children.length === 0) &&
        this.mail.folder === MailFolderType.TRASH) ||
      (mail.id === this.mail.id && this.mail.folder === MailFolderType.TRASH)
    ) {
      this.changeMailAfterDelete(this.currentMailIndex + 1);
    }
  }

  changeMailAfterDelete(index: number) {
    if (index < 0 || index >= this.mails.length) {
      this.goBack(500);
    }
    this.mail = null;
    setTimeout(() => {
      this.markedAsRead = false;
      this.router.navigateByUrl(`/mail/${this.mailFolder}/page/${this.page}/message/${this.mails[index].id}`);
    }, 500);
  }

  onDeleteForAll(mail: Mail) {
    this.store.dispatch(new DeleteMailForAll({ id: mail.id, isMailDetailPage: true }));
    if (this.mail.children) {
      this.mail.children = this.mail.children.filter(child => child.id !== mail.id);
    }
    if (mail.id === this.mail.id) {
      this.changeMailAfterDelete(this.currentMailIndex + 1);
    }
  }

  onDeleteCollapseMail(index?: number) {
    if (index > 0) {
      this.childMailCollapsed[index - 1] = false;
      this.childMailCollapsed.splice(index, 1);
    } else if (index === 0) {
      this.parentMailCollapsed = false;
    }
  }

  onMarkAsSpam(mail: Mail) {
    this.store.dispatch(
      new MoveMail({
        ids: mail.id,
        folder: MailFolderType.SPAM,
        sourceFolder: mail.folder,
        mail,
        allowUndo: true,
      }),
    );
    if (mail.id === this.mail.id) {
      this.goBack();
    }
  }

  markNotSpam(mail: Mail) {
    this.store.dispatch(
      new MoveMail({
        ids: mail.id,
        folder: MailFolderType.INBOX,
        sourceFolder: mail.folder,
        mail,
        allowUndo: true,
      }),
    );
    setTimeout(() => {
      this.store.dispatch(new WhiteListAdd({ name: mail.sender, email: mail.sender }));
    }, 2000);
    this.goBack();
  }

  ontoggleStarred(event, mail: Mail, withChildren: boolean = true) {
    event.stopPropagation();
    event.preventDefault();
    this.store.dispatch(
      new StarMail({
        ids: mail.id.toString(),
        starred: withChildren ? !mail.has_starred_children : !mail.starred,
        withChildren,
      }),
    );
  }

  moveToFolder(folder: MailFolderType | string) {
    // Dispatch move to selected folder event
    this.store.dispatch(
      new MoveMail({
        ids: this.mail.id,
        folder,
        sourceFolder: this.mailFolder,
        allowUndo: true,
        mail: this.mail,
        fromTrash: this.mailFolder === MailFolderType.TRASH,
      }),
    );

    this.goBack(500);
  }

  onCancelSend(mail) {
    mail.delayed_delivery = 'CancelSend';
    const updatedMail = { draft: mail };
    this.store.dispatch(new SendMail(updatedMail));

    this.goBack(500);
  }

  goBack(wait = 1) {
    setTimeout(() => {
      this.router.navigateByUrl(`/mail/${this.mailFolder}/page/${this.page}`);
    }, wait);
  }

  openCreateFolderDialog() {
    this.shareService.openCreateFolderDialog(this.userState.isPrime, this.customFolders, {
      self: this,
      method: 'moveToFolder',
    });
  }

  onPrint(mail: Mail) {
    if (this.decryptedContents[mail.id]) {
      let popupWin;

      const subject = document.getElementById(`${this.mail.id}-mail-subject`).innerHTML;
      const from = document.getElementById(`${mail.id}-mail-from`).innerHTML;
      const to = document.getElementById(`${mail.id}-mail-to`).innerHTML;
      const date = document.getElementById(`${mail.id}-mail-date`).innerHTML;
      const content = document.getElementById(`${mail.id}-mail-content`).innerHTML;

      const hasCC = document.getElementById(`${mail.id}-mail-cc`);
      let cc = '';
      if (hasCC) {
        cc = `<span class="text-muted">${hasCC.innerHTML}</span>`;
      }

      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
          <html>
            <head>
              <title>Print tab</title>
              <style>
              body {
                font-family: "Roboto", Helvetica, Arial, sans-serif;
                }

                .navbar-brand-logo {
                    margin-right: 10px;
                    max-width: 32px;
                }

                a {
                    color: #3498db;
                }

                .container {
                    max-width: 900px;
                    padding: 100px 15px;
                    margin: auto;
                    color: #757675;
                }

                .row {
                    padding-left: -15px;
                    padding-right: -15px;
                }

                .text-center {
                    text-align: center;
                }

                .text-secondary {
                    color: #34495e;
                }

                .page-title {
                    font-weight: 300;
                }

                .dashed-separator {
                    border-top: 1px dashed #777;margin:20px 0 20px;
                }
              </style>
            </head>
            <body onload="window.print();window.close()">
            <div class="container">
                <div class="row">
                    <!-- Mail Subject -->
                    <h1>${subject}</h1>
                    <div class="dashed-separator"></div>
                    <!-- Mail From  -->
                    <span class="text-muted">${from}</span>
                    <br>
                    <!-- Mail To  -->
                    <span class="text-muted">${to}</span>
                    <br>
                    <!-- Mail CC  -->
                    ${cc}
                    <br>
                    <!-- Mail Date Created  -->
                    Dated:<strong>${date}</strong>
                    <br>
                    <div class="dashed-separator"></div>
                    <!-- Mail Content  -->
                    <div>
                      ${content}
                    </div>
                </div>
            </div>
            </body>
          </html>`);
      popupWin.document.close();
    }
  }

  scrollTo(elementReference: any) {
    if (elementReference) {
      setTimeout(() => {
        window.scrollTo({
          top: elementReference.offsetTop,
          behavior: 'smooth',
        });
      }, 100);
    }
  }

  onSwitchHtmlPlainTextMode(mail: Mail) {
    this.plainTextViewState[mail.id] = !this.plainTextViewState[mail.id];
  }

  private getPreviousMail(index: number, isChildMail: boolean, mainReply = false, isForwarding = false) {
    let children: Mail[] = this.mail.children || [];
    if (this.mailFolder !== MailFolderType.TRASH && this.mail.children) {
      children = this.mail.children.filter(child => child.folder !== MailFolderType.TRASH);
    }
    const previousMail = [];
    if (isChildMail) {
      previousMail.push(children[index]);
    } else if (mainReply === true && children.length > 0) {
      previousMail.push(children[children.length - 1]);
    } else if (this.mail.folder !== MailFolderType.TRASH && !isForwarding) {
      previousMail.push(this.mail);
    }
    return previousMail;
  }

  private getMessageHistory(previousMails: Mail[]): string {
    if (previousMails.length === 0) {
      return '';
    }
    let history = SummarySeparator;
    previousMails.forEach(previousMail => (history = this.getMessageSummary(history, previousMail)));
    return `<div class="gmail_quote">${history}</div>`;
  }

  /**
   * Add original message status when reply or forward
   */
  private getMessageSummary(content: string, mail: Mail): string {
    if (mail.folder !== MailFolderType.DRAFT && mail.folder !== MailFolderType.TRASH && this.includeOriginMessage) {
      const formattedDateTime = mail.sent_at
        ? this.dateTimeUtilService.formatDateTimeStr(mail.sent_at, 'ddd, MMMM D, YYYY [at] h:mm:ss A')
        : this.dateTimeUtilService.formatDateTimeStr(mail.created_at, 'ddd, MMMM D, YYYY [at] h:mm:ss A');
      if (this.decryptedContents[mail.id] === undefined) {
        this.decryptedContents[mail.id] = '';
      }
      content += `</br>---------- Original Message ----------</br>On ${formattedDateTime} < ${
        mail.sender
      } > wrote:</br><div class="originalblock">${this.decryptedContents[mail.id]}</div></br>`;
    }
    return content;
  }

  /**
   * Add forwarded message summary with original message
   */
  private getForwardMessageSummary(mail: Mail): string {
    let content =
      `</br>---------- Forwarded message ----------</br>` +
      `From: ${EmailFormatPipe.transformToFormattedEmail(
        mail.sender_display.email,
        mail.sender_display.name,
        true,
      )}</br>` +
      `Date: ${
        mail.sent_at
          ? this.dateTimeUtilService.formatDateTimeStr(mail.sent_at, 'medium')
          : this.dateTimeUtilService.formatDateTimeStr(mail.created_at, 'medium')
      }</br>` +
      `Subject: ${mail.subject}</br>` +
      `To: ${mail.receiver_display
        .map(receiver => EmailFormatPipe.transformToFormattedEmail(receiver.email, receiver.name, true))
        .join(', ')}</br>`;

    if (mail.cc.length > 0) {
      content += `CC: ${mail.cc.map(cc => `< ${cc} >`).join(', ')}</br>`;
    }
    content += `</br>${this.decryptedContents[mail.id]}</br>`;
    return content;
  }

  /**
   * @name onClickChildHeader
   * @description This would be called, when hitting the header of child mail. Will change the state of childMailCollapsed by index
   * @params Index of child from mails
   * @returns None
   */
  private onClickChildHeader(childIndex) {
    this.childMailCollapsed[childIndex] = !this.childMailCollapsed[childIndex];
    this.decryptChildEmails(this.mail.children[childIndex]);
  }

  private onShowTrashRelatedChildren() {
    this.isShowTrashRelatedChildren = !this.isShowTrashRelatedChildren;
  }
}
