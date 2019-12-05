import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { take } from 'rxjs/operators';
import { SummarySeparator } from '../../shared/config';
import { FilenamePipe } from '../../shared/pipes/filename.pipe';
import { WebSocketState } from '../../store';
import {
  DeleteMail,
  DeleteMailForAll,
  GetMailDetailSuccess,
  GetMails,
  MoveMail,
  SnackErrorPush,
  StarMail,
  WhiteListAdd
} from '../../store/actions';
import { ClearMailDetail, GetMailDetail, ReadMail } from '../../store/actions/mail.actions';
import { AppState, MailAction, MailBoxesState, MailState, SecureContent, UserState } from '../../store/datatypes';
import { Attachment, Folder, Mail, Mailbox, MailFolderType } from '../../store/models/mail.model';
import { LOADING_IMAGE, MailService, OpenPgpService, SharedService } from '../../store/services';
import { ComposeMailService } from '../../store/services/compose-mail.service';
import { DateTimeUtilService } from '../../store/services/datetime-util.service';

declare var Scrambler;

@Component({
  selector: 'app-mail-detail',
  templateUrl: './mail-detail.component.html',
  styleUrls: ['./mail-detail.component.scss']
})
export class MailDetailComponent implements OnInit, OnDestroy {

  @ViewChild('forwardAttachmentsModal', { static: false }) forwardAttachmentsModal;
  @ViewChild('incomingHeadersModal', { static: false }) incomingHeadersModal;

  mail: Mail;
  composeMailData: any = {};
  mailFolderTypes = MailFolderType;
  decryptedContents: any = {};
  decryptedAttachments: any = {};
  decryptedHeaders: any = {};
  selectedHeaders: string;
  mailOptions: any = {};
  selectedMailToForward: Mail;
  isDecrypting: any = {};

  parentMailCollapsed: boolean = true;
  childMailCollapsed: boolean[] = [];
  mailFolder: MailFolderType;
  customFolders: Folder[] = [];
  showGmailExtraContent: boolean;
  folderColors: any = {};
  markedAsRead: boolean;
  currentMailIndex: number;
  currentMailNumber: any;
  MAX_EMAIL_PAGE_LIMIT: number = 1;
  OFFSET: number = 0;
  loadingImage = LOADING_IMAGE;

  private currentMailbox: Mailbox;
  private forwardAttachmentsModalRef: NgbModalRef;
  private userState: UserState;
  private mailboxes: Mailbox[];
  private canScroll: boolean = true;
  private page: number;
  private mails: Mail[] = [];
  private EMAILS_PER_PAGE: number;

  // shortcuts: ShortcutInput[] = [];
  constructor(private route: ActivatedRoute,
              private store: Store<AppState>,
              private pgpService: OpenPgpService,
              private shareService: SharedService,
              private router: Router,
              private composeMailService: ComposeMailService,
              private dateTimeUtilService: DateTimeUtilService,
              private modalService: NgbModal,
              private mailService: MailService) {
  }

  ngOnInit() {

    this.store.select(state => state.webSocket).pipe(untilDestroyed(this))
      .subscribe((webSocketState: WebSocketState) => {
        if (webSocketState.message && !webSocketState.isClosed) {
          if (this.mail && (webSocketState.message.id === this.mail.id || webSocketState.message.parent_id === this.mail.id)) {
            this.store.dispatch(new GetMailDetailSuccess(webSocketState.message.mail));
          }
        }
      });

    this.store.select(state => state.mail).pipe(untilDestroyed(this))
      .subscribe((mailState: MailState) => {
        this.mails = [...mailState.mails];
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
            if (!this.mail.has_children && this.mail.content != null && !this.isDecrypting[this.mail.id] &&
              (!decryptedContent || (!decryptedContent.inProgress && decryptedContent.content == null && this.mail.content != null))) {
              this.isDecrypting[this.mail.id] = true;
              this.pgpService.decrypt(this.mail.mailbox, this.mail.id, new SecureContent(this.mail));
            }
            if (decryptedContent && !decryptedContent.inProgress && decryptedContent.content != null) {
              this.decryptedContents[this.mail.id] = decryptedContent.content;
              if (this.mail.is_subject_encrypted) {
                this.mail.subject = decryptedContent.subject;
              }
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
            if (this.childMailCollapsed.length !== this.mail.children.length) {
              this.parentMailCollapsed = true;
              // Collapse all emails by default
              this.childMailCollapsed = this.makeArrayOf(true, this.mail.children.length);
              // Do not collapse the last email in the list
              this.childMailCollapsed[this.mail.children.length - 1] = false;
            }

            this.decryptChildEmails(this.mail.children[this.mail.children.length - 1], mailState);
            setTimeout(() => {
              if (this.mail) {
                if (!this.isDecrypting[this.mail.id] && this.mail.content &&
                  (!decryptedContent || (!decryptedContent.inProgress && !decryptedContent.content && this.mail.content))) {
                  this.isDecrypting[this.mail.id] = true;
                  this.pgpService.decrypt(this.mail.mailbox, this.mail.id, new SecureContent(this.mail));
                }
                this.mail.children.forEach((child, index) => {
                  if (index !== this.mail.children.length - 1) {
                    this.decryptChildEmails(child, mailState);
                  }
                });
              }
            }, 1000);
          } else {
            this.parentMailCollapsed = false;
          }
        }
        if (this.mails.length > 0 && this.mail) {
          this.MAX_EMAIL_PAGE_LIMIT = mailState.total_mail_count;
          this.currentMailIndex = this.mails.findIndex(item => item.id === this.mail.id);
          this.currentMailNumber = ((this.EMAILS_PER_PAGE * (this.page - 1)) + this.currentMailIndex + 1) || '-';
        }
        if (!mailState.loaded && this.mails.length === 0 && !mailState.inProgress &&
          this.EMAILS_PER_PAGE && this.mailFolder !== MailFolderType.SEARCH) {
          this.store.dispatch(new GetMails({
            limit: this.EMAILS_PER_PAGE,
            inProgress: true, offset: this.OFFSET, folder: this.mailFolder
          }));
        }
      });

    this.store.select(state => state.mailboxes).pipe(untilDestroyed(this))
      .subscribe((mailBoxesState: MailBoxesState) => {
        this.currentMailbox = mailBoxesState.currentMailbox;
        this.mailboxes = mailBoxesState.mailboxes;
      });

    this.route.params.pipe(untilDestroyed(this))
      .subscribe(params => {
        const id = +params['id'];

        this.mailFolder = params['folder'] as MailFolderType;
        this.page = +params['page'];
        this.getMailDetail(id);
      });

    this.store.select(state => state.user).pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.customFolders = user.customFolders;
        user.customFolders.forEach(folder => {
          this.folderColors[folder.name] = folder.color;
        });
        this.userState = user;
        this.EMAILS_PER_PAGE = user.settings.emails_per_page;
      });
  }

  scrambleText(elementId: string) {
    if (!this.decryptedContents[this.mail.id]) {
      setTimeout(() => {
        Scrambler({
          target: `#${elementId}`,
          random: [1000, 120000],
          speed: 70,
          text: 'A7gHc6H66A9SAQfoBJDq4C7'
        });
      }, 100);
    }
  }

  changeMail(index: number) {
    if (index < 0 || index >= this.mails.length) {
      return;
    }
    this.mail = null;
    setTimeout(() => {
      this.markedAsRead = false;
      this.router.navigateByUrl(`/mail/${this.mailFolder}/page/${this.page}/message/${this.mails[index].id}`);
    }, 500);
  }

  handleEmailLinks() {
    setTimeout(() => {
      const self = this;
      const anchorElements = document.getElementsByTagName('a');
      for (const i in anchorElements) {
        if (anchorElements.hasOwnProperty(i) && anchorElements[i].href.indexOf('mailto:') === 0) {
          const receivers = [anchorElements[i].href.split('mailto:')[1]];
          anchorElements[i].onclick = (event) => {
            event.preventDefault();
            self.composeMailService.openComposeMailDialog({ receivers });
          };
          anchorElements[i].href = '';
        }
      }
    }, 1000);

  }

  toggleGmailExtra(mail: Mail) {
    if (!this.mailOptions[mail.id]) {
      this.mailOptions[mail.id] = {};
    }
    this.mailOptions[mail.id].showGmailExtraContent = !this.mailOptions[mail.id].showGmailExtraContent;
  }

  makeArrayOf(value, length) {
    const arr = [];
    let i = length;
    while (i--) {
      arr[i] = value;
    }
    return arr;
  }

  decryptChildEmails(child: Mail, mailState: MailState) {
    if (child.folder === MailFolderType.OUTBOX && !child.is_encrypted) {
      this.decryptedContents[child.id] = child.content;
    } else {
      const childDecryptedContent = mailState.decryptedContents[child.id];
      if (!this.isDecrypting[child.id] &&
        (!childDecryptedContent || (!childDecryptedContent.inProgress && !childDecryptedContent.content && child.content))) {
        this.isDecrypting[child.id] = true;
        this.pgpService.decrypt(child.mailbox, child.id, new SecureContent(child));
      }
      if (childDecryptedContent && !childDecryptedContent.inProgress && childDecryptedContent.content) {
        this.decryptedContents[child.id] = childDecryptedContent.content;
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

  parseHeaders(headers: any) {
    if (!headers) {
      return [];
    }
    headers = JSON.parse(headers);
    const headersArray = [];
    for (const key in headers) {
      if (headers.hasOwnProperty(key)) {
        headersArray.push({ key, value: headers[key] });
      }
    }
    return headersArray;
  }

  getMailDetail(messageId: number) {
    this.store.dispatch(new GetMailDetail({ messageId, folder: this.mailFolder }));
  }

  decryptAttachment(attachment: Attachment, mail: Mail) {
    if (attachment.is_encrypted) {
      if (this.decryptedAttachments[attachment.id]) {
        if (!this.decryptedAttachments[attachment.id].inProgress) {
          this.downloadAttachment(this.decryptedAttachments[attachment.id]);
        }
      } else {
        this.decryptedAttachments[attachment.id] = { ...attachment, inProgress: true };
        this.mailService.getAttachment(attachment)
          .subscribe(response => {
              const uint8Array = this.shareService.base64ToUint8Array(response.data);
              attachment.name = FilenamePipe.tranformToFilename(attachment.document);
              const fileInfo = { attachment, type: response.file_type };
              this.pgpService.decryptAttachment(mail.mailbox, uint8Array, fileInfo)
                .pipe(
                  take(1)
                )
                .subscribe((decryptedAttachment: Attachment) => {
                    this.decryptedAttachments[attachment.id] = { ...decryptedAttachment, inProgress: false };
                    this.downloadAttachment(decryptedAttachment);
                  },
                  error => console.log(error));
            },
            errorResponse => this.store.dispatch(new SnackErrorPush({
              message: errorResponse.error || 'Failed to download attachment.'
            })));
      }
    }
  }

  downloadAttachment(attachment: Attachment) {
    this.shareService.downloadFile(attachment.decryptedDocument);
  }

  markAsStarred() {
    this.store.dispatch(new StarMail({ ids: `${this.mail.id}`, starred: true }));
  }

  markAsRead(mailID: number, read: boolean = true) {
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
      windowClass: this.selectedHeaders.length === 0 ? 'modal-sm' : ''
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

  onReply(mail: Mail, index: number = 0, isChildMail?: boolean, mainReply: boolean = false) {
    const previousMails = this.getPreviousMail(index, isChildMail, mainReply);
    const allRecipients = [...mail.receiver, mail.sender, mail.cc, mail.bcc];
    this.composeMailData[mail.id] = {
      subject: mail.subject,
      parentId: this.mail.id,
      messageHistory: this.getMessageHistory(previousMails),
      selectedMailbox: this.mailboxes.find(mailbox => allRecipients.includes(mailbox.email))
    };
    if (mail.reply_to && mail.reply_to.length > 0) {
      this.composeMailData[mail.id].receivers = mail.reply_to;
    } else if (mail.sender !== this.currentMailbox.email) {
      this.composeMailData[mail.id].receivers = [mail.sender];
    } else if (this.mail.sender !== this.currentMailbox.email) {
      this.composeMailData[mail.id].receivers = [this.mail.sender];
    } else {
      this.composeMailData[mail.id].receivers = this.mail.receiver;
    }
    this.composeMailData[mail.id].action = MailAction.REPLY;
    this.setActionParent(mail, isChildMail, mainReply);
    this.mailOptions[mail.id].isComposeMailVisible = true;
  }

  onReplyAll(mail: Mail, index: number = 0, isChildMail?: boolean, mainReply: boolean = false) {
    const previousMails = this.getPreviousMail(index, isChildMail, mainReply);
    this.composeMailData[mail.id] = {
      cc: [...mail.receiver, ...mail.cc],
      subject: mail.subject,
      parentId: this.mail.id,
      messageHistory: this.getMessageHistory(previousMails),
      selectedMailbox: this.mailboxes.find(mailbox => mail.receiver.includes(mailbox.email))
    };
    if (mail.sender !== this.currentMailbox.email) {
      this.composeMailData[mail.id].receivers = [mail.sender];
    } else if (this.mail.sender !== this.currentMailbox.email) {
      this.composeMailData[mail.id].receivers = [this.mail.sender];
    } else {
      this.composeMailData[mail.id].receivers = this.mail.receiver;
    }
    this.composeMailData[mail.id].cc = this.composeMailData[mail.id].cc
      .filter(email => email !== this.currentMailbox.email && !this.composeMailData[mail.id].receivers.includes(email));
    this.composeMailData[mail.id].action = MailAction.REPLY_ALL;
    this.setActionParent(mail, isChildMail, mainReply);
    this.mailOptions[mail.id].isComposeMailVisible = true;
  }

  onForward(mail: Mail, index: number = 0, isChildMail?: boolean, mainReply: boolean = false) {
    const previousMails = this.getPreviousMail(index, isChildMail, mainReply, true);
    this.composeMailData[mail.id] = {
      content: this.getForwardMessageSummary(mail),
      messageHistory: this.getMessageHistory(previousMails),
      subject: this.mail.subject,
      selectedMailbox: this.mailboxes.find(mailbox => mail.receiver.includes(mailbox.email))
    };
    this.selectedMailToForward = mail;
    this.composeMailData[mail.id].action = MailAction.FORWARD;
    this.setActionParent(mail, isChildMail, mainReply);
    if (mail.attachments.length > 0) {
      this.forwardAttachmentsModalRef = this.modalService.open(this.forwardAttachmentsModal, {
        centered: true,
        windowClass: 'modal-sm users-action-modal'
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

  onDelete(mail: Mail, index?: number) {
    if (mail.folder === MailFolderType.TRASH) {
      this.store.dispatch(new DeleteMail({ ids: mail.id.toString() }));
      if (this.mail.children && !(this.mail.children.filter(child => child.id !== mail.id)
        .some(child => child.folder === MailFolderType.TRASH))) {
        this.goBack(500);
      }
    } else {
      this.store.dispatch(new MoveMail({
        ids: mail.id,
        folder: MailFolderType.TRASH,
        sourceFolder: mail.folder,
        mail: mail,
        allowUndo: true
      }));
      if (this.mail.children) {
        this.mail.children = this.mail.children.filter(child => child.id !== mail.id);
      }
      this.onDeleteCollapseMail(index);
    }
    if (mail.id === this.mail.id) {
      this.goBack(500);
    }
  }

  onDeleteForAll(mail: Mail) {
    this.store.dispatch(new DeleteMailForAll({ id: mail.id, isMailDetailPage: true }));
    if (this.mail.children) {
      this.mail.children = this.mail.children.filter(child => child.id !== mail.id);
    }
    if (mail.id === this.mail.id) {
      this.goBack(500);
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
    this.store.dispatch(new MoveMail({
      ids: mail.id,
      folder: MailFolderType.SPAM,
      sourceFolder: mail.folder,
      mail: mail
    }));
    if (mail.id === this.mail.id) {
      this.goBack();
    }
  }

  markNotSpam(mail: Mail) {
    this.store.dispatch(new MoveMail({
      ids: mail.id,
      folder: MailFolderType.INBOX,
      sourceFolder: mail.folder,
      mail: mail
    }));
    setTimeout(() => {
      this.store.dispatch(new WhiteListAdd({ name: mail.sender, email: mail.sender }));
    }, 2000);
    this.goBack();
  }

  ontoggleStarred(mail: Mail) {
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

  moveToFolder(folder: MailFolderType) {
    this.store.dispatch(new MoveMail({ ids: this.mail.id, folder }));
    this.goBack(500);
  }

  goBack(wait: number = 1) {
    setTimeout(() => {
      this.router.navigateByUrl(`/mail/${this.mailFolder}/page/${this.page}`);
    }, wait);
  }

  openCreateFolderDialog() {
    this.shareService.openCreateFolderDialog(this.userState.isPrime, this.customFolders, { self: this, method: 'moveToFolder' });
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
          </html>`
      );
      popupWin.document.close();
    }
  }

  scrollTo(elementRef: any) {
    if (elementRef) {
      setTimeout(() => {
        window.scrollTo({
          top: elementRef.offsetTop,
          behavior: 'smooth'
        });
      }, 100);
    }
  }

  private getPreviousMail(index: number, isChildMail: boolean, mainReply: boolean = false, isForwarding: boolean = false) {
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
    previousMails.forEach(previousMail => history = this.getMessageSummary(history, previousMail));
    return `<div class="gmail_quote">${history}</div>`;
  }

  private getMessageSummary(content: string, mail: Mail): string {
    if (mail.folder !== MailFolderType.DRAFT && mail.folder !== MailFolderType.TRASH) {
      const formattedDateTime = mail.sent_at ? this.dateTimeUtilService.formatDateTimeStr(mail.sent_at, 'ddd, MMMM D, YYYY [at] h:mm:ss A') :
        this.dateTimeUtilService.formatDateTimeStr(mail.created_at, 'ddd, MMMM D, YYYY [at] h:mm:ss A');
      content += `</br>On ${formattedDateTime} &lt;${mail.sender}&gt; wrote:</br>${this.decryptedContents[mail.id]}</br>`;
    }
    return content;
  }

  private getForwardMessageSummary(mail: Mail): string {
    let content = `</br>---------- Forwarded message ----------</br>` +
      `From: &lt;${mail.sender}&gt;</br>` +
      `Date: ${mail.sent_at ? this.dateTimeUtilService.formatDateTimeStr(mail.sent_at, 'medium') : this.dateTimeUtilService.formatDateTimeStr(mail.created_at, 'medium')}</br>` +
      `Subject: ${mail.subject}</br>` +
      `To: ${mail.receiver.map(receiver => '&lt;' + receiver + '&gt;').join(', ')}</br>`;

    if (mail.cc.length > 0) {
      content += `CC: ${mail.cc.map(cc => '&lt;' + cc + '&gt;').join(', ')}</br>`;
    }

    content += `</br>${this.decryptedContents[mail.id]}</br>`;

    return content;

  }

}
