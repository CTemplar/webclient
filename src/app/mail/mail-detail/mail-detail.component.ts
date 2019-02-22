import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { DeleteMail, GetUnreadMailsCount, MoveMail, StarMail } from '../../store/actions';
import { ClearMailDetail, GetMailDetail, ReadMail } from '../../store/actions/mail.actions';
import { AppState, MailBoxesState, MailState, UserState } from '../../store/datatypes';
import { Folder, Mail, Mailbox, MailFolderType } from '../../store/models/mail.model';
import { OpenPgpService, SharedService } from '../../store/services';
import { DateTimeUtilService } from '../../store/services/datetime-util.service';
import { takeUntil } from 'rxjs/operators';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-detail',
  templateUrl: './mail-detail.component.html',
  styleUrls: ['./mail-detail.component.scss']
})
export class MailDetailComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  @ViewChild('forwardAttachmentsModal') forwardAttachmentsModal;
  @ViewChild('incomingHeadersModal') incomingHeadersModal;

  mail: Mail;
  composeMailData: any = {};
  mailFolderTypes = MailFolderType;
  decryptedContents: any = {};
  decryptedHeaders: any = {};
  selectedHeaders: string;
  mailOptions: any = {};
  selectedMailToForward: Mail;

  parentMailCollapsed: boolean = true;
  childMailCollapsed: boolean[] = [];
  mailFolder: MailFolderType;
  customFolders: Folder[] = [];

  private currentMailbox: Mailbox;
  private forwardAttachmentsModalRef: NgbModalRef;
  private userState: UserState;
  private mailboxes: Mailbox[];
  private canScroll: boolean = true;
  private page: number;

  constructor(private route: ActivatedRoute,
              private store: Store<AppState>,
              private pgpService: OpenPgpService,
              private shareService: SharedService,
              private router: Router,
              private dateTimeUtilService: DateTimeUtilService,
              private modalService: NgbModal) {
  }

  ngOnInit() {

    this.store.select(state => state.mail).pipe(takeUntil(this.destroyed$))
      .subscribe((mailState: MailState) => {
        if (mailState.mailDetail && mailState.noUnreadCountChange) {
          this.mail = mailState.mailDetail;
          if (this.mail.folder === MailFolderType.OUTBOX && !this.mail.is_encrypted) {
            this.decryptedContents[this.mail.id] = this.mail.content;
          } else {
            const decryptedContent = mailState.decryptedContents[this.mail.id];
            if (!decryptedContent || (!decryptedContent.inProgress && !decryptedContent.content && this.mail.content)) {
              this.pgpService.decrypt(this.mail.mailbox, this.mail.id, this.mail.content, this.mail.incoming_headers);
            }
            if (decryptedContent && !decryptedContent.inProgress && decryptedContent.content) {
              this.decryptedContents[this.mail.id] = decryptedContent.content;
              this.decryptedHeaders[this.mail.id] = this.parseHeaders(decryptedContent.incomingHeaders);

              // Automatically scrolls to last element in the list
              // Class name .last-child is set inside the template
              if (this.canScroll && this.mail.children && this.mail.children.length > 0) {
                setTimeout(() => {
                  this.canScroll = false;
                }, 3000);
                this.scrollTo(document.querySelector('.last-child'));
              }

              // Mark mail as read
              if (!this.mail.read) {
                this.markAsRead(this.mail.id);
              }
            }
          }
          if (!this.mailOptions[this.mail.id]) {
            this.mailOptions[this.mail.id] = {};
          }
          if (this.mail.children && this.mail.children.length > 0) {
            this.parentMailCollapsed = true;
            if (this.childMailCollapsed.length !== this.mail.children.length) {
              // Collapse all emails by default
              this.childMailCollapsed = this.makeArrayOf(true, this.mail.children.length);
              // Do not collapse the last email in the list
              this.childMailCollapsed[this.mail.children.length - 1] = false;
            }

            this.mail.children.forEach((child, index) => {
              if (index === this.mail.children.length - 1) {
                this.decryptChildEmails(child, mailState);
              } else {
                setTimeout(() => {
                  this.decryptChildEmails(child, mailState);
                }, 3000);
              }
            });
          } else {
            this.parentMailCollapsed = false;
          }
        }
      });

    this.store.select(state => state.mailboxes).pipe(takeUntil(this.destroyed$))
      .subscribe((mailBoxesState: MailBoxesState) => {
        this.currentMailbox = mailBoxesState.currentMailbox;
        this.mailboxes = mailBoxesState.mailboxes;
      });

    this.route.params.subscribe(params => {
      const id = +params['id'];

      // Check if email is already available in state
      if (!this.mail || this.mail.has_children) {
        this.getMailDetail(id);
      }

      this.mailFolder = params['folder'] as MailFolderType;
      this.page = +params['page'];

      this.store.select(state => state.user).pipe(takeUntil(this.destroyed$))
        .subscribe((user: UserState) => {
          this.customFolders = user.customFolders;
          this.userState = user;
        });

    });
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
      if (!childDecryptedContent || (!childDecryptedContent.inProgress && !childDecryptedContent.content && child.content)) {
        this.pgpService.decrypt(child.mailbox, child.id, child.content, child.incoming_headers);
      }
      if (childDecryptedContent && !childDecryptedContent.inProgress && childDecryptedContent.content) {
        this.decryptedContents[child.id] = childDecryptedContent.content;
        this.decryptedHeaders[child.id] = this.parseHeaders(childDecryptedContent.incomingHeaders);
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
    this.store.dispatch(new GetMailDetail(messageId));
  }

  // getAttachementFileName(filepath: string) {
  //   const filePathTokens = filepath.split('/');
  //   console.log("testing");
  //   return  filePathTokens[filePathTokens.length - 1];
  // }

  markAsStarred() {
    this.store.dispatch(new StarMail({ ids: `${this.mail.id}`, starred: true }));
  }

  markAsRead(mailID: number, read: boolean = true) {
    this.store.dispatch(new ReadMail({ ids: mailID.toString(), read }));
    if (!read) {
      this.router.navigateByUrl(`/mail/${this.mailFolder}/page/${this.page}`);
    } else {
      setTimeout(() => {
        this.store.dispatch(new GetUnreadMailsCount());
      }, 1000);
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

  onReply(mail: Mail, index: number = 0, isChildMail?: boolean) {
    const previousMails = this.getPreviousMails(index, isChildMail);
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
    this.mailOptions[mail.id].isComposeMailVisible = true;
  }

  onReplyAll(mail: Mail, index: number = 0, isChildMail?: boolean) {
    const previousMails = this.getPreviousMails(index, isChildMail);
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
    this.mailOptions[mail.id].isComposeMailVisible = true;
  }

  onForward(mail: Mail, index: number = 0, isChildMail?: boolean) {
    const previousMails = this.getPreviousMails(index, isChildMail);
    this.composeMailData[mail.id] = {
      content: this.getForwardMessageSummary(mail),
      messageHistory: this.getMessageHistory(previousMails),
      subject: this.mail.subject,
      selectedMailbox: this.mailboxes.find(mailbox => mail.receiver.includes(mailbox.email))
    };
    this.selectedMailToForward = mail;
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

  onDelete(mail: Mail) {
    if (mail.folder === MailFolderType.TRASH) {
      this.store.dispatch(new DeleteMail({ ids: mail.id.toString() }));
    } else {
      this.store.dispatch(new MoveMail({
        ids: mail.id,
        folder: MailFolderType.TRASH,
        sourceFolder: mail.folder,
        mail: mail,
        allowUndo: true
      }));
    }
    if (mail.id === this.mail.id) {
      this.router.navigateByUrl(`/mail/${this.mailFolder}`);
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
      this.router.navigateByUrl(`/mail/${this.mailFolder}/page/${this.page}`);
    }
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
  }

  goBack() {
    this.router.navigateByUrl(`/mail/${this.mailFolder}/page/${this.page}`);
  }

  openCreateFolderDialog() {
    this.shareService.openCreateFolderDialog(this.userState.isPrime, this.customFolders);
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

  private getPreviousMails(index: number, isChildMail: boolean) {
    const previousMails = [];
    if (isChildMail && index >= 0) {
      // previous mails in order of most recent first to parent last (including the mail at given index)
      for (let i = index; i >= 0; i--) {
        previousMails.push(this.mail.children[i]);
      }
    } else {
      previousMails.push(...this.mail.children);
      previousMails.reverse();
    }
    previousMails.push(this.mail);
    return previousMails;
  }

  private getMessageHistory(previousMails: Mail[]): string {
    let history = '';
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
