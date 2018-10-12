import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { DeleteMail, MoveMail } from '../../store/actions';
import { ClearMailDetail, GetMailDetail, ReadMail } from '../../store/actions/mail.actions';
import { AppState, MailBoxesState, MailState } from '../../store/datatypes';
import { Mail, Mailbox, MailFolderType } from '../../store/models/mail.model';
import { OpenPgpService } from '../../store/services';
import { DateTimeUtilService } from '../../store/services/datetime-util.service';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-detail',
  templateUrl: './mail-detail.component.html',
  styleUrls: ['./mail-detail.component.scss']
})
export class MailDetailComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  mail: Mail;
  composeMailData: any = {};
  mailFolderType = MailFolderType;
  decryptedContents: any = {};
  mailOptions: any = {};
  isConversationCollapsed = true;
  private mailFolder: MailFolderType;
  private currentMailbox: Mailbox;

  constructor(private route: ActivatedRoute,
              private store: Store<AppState>,
              private pgpService: OpenPgpService,
              private router: Router,
              private dateTimeUtilService: DateTimeUtilService) {
  }

  ngOnInit() {
    this.store.select(state => state.mail).takeUntil(this.destroyed$)
      .subscribe((mailState: MailState) => {
        if (mailState.mailDetail) {
          this.mail = mailState.mailDetail;
          if (this.mail.folder === MailFolderType.OUTBOX && !this.mail.is_encrypted) {
            this.decryptedContents[this.mail.id] = this.mail.content;
          } else {
            const decryptedContent = mailState.decryptedContents[this.mail.id];
            if (!decryptedContent || (!decryptedContent.inProgress && !decryptedContent.content && this.mail.content)) {
              this.pgpService.decrypt(this.mail.mailbox, this.mail.id, this.mail.content);
            }
            if (decryptedContent && !decryptedContent.inProgress && decryptedContent.content) {
              this.decryptedContents[this.mail.id] = decryptedContent.content;

              // Mark mail as read
              if (!this.mail.read) {
                this.markAsRead(this.mail.id);
              }
            }
          }
          if (!this.mailOptions[this.mail.id]) {
            this.mailOptions[this.mail.id] = {};
          }
          if (this.mail.children) {
            this.mail.children.forEach(child => {
              if (child.folder === MailFolderType.OUTBOX && !child.is_encrypted) {
                this.decryptedContents[child.id] = child.content;
              } else {
                const childDecryptedContent = mailState.decryptedContents[child.id];
                if (!childDecryptedContent || (!childDecryptedContent.inProgress && !childDecryptedContent.content && child.content)) {
                  this.pgpService.decrypt(child.mailbox, child.id, child.content);
                }
                if (childDecryptedContent && !childDecryptedContent.inProgress && childDecryptedContent.content) {
                  this.decryptedContents[child.id] = childDecryptedContent.content;
                }
              }
              if (!this.mailOptions[child.id]) {
                this.mailOptions[child.id] = {};
              }
            });
          }
        }
      });

    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailBoxesState: MailBoxesState) => {
        this.currentMailbox = mailBoxesState.currentMailbox;
      });

    this.route.params.subscribe(params => {
      const id = +params['id'];

      // Check if email is already available in state
      if (!this.mail || this.mail.has_children) {
        this.getMailDetail(id);
      }

      this.mailFolder = params['folder'] as MailFolderType;

    });
  }

  getMailDetail(messageId: number) {
    this.store.dispatch(new GetMailDetail(messageId));
  }

  // getAttachementFileName(filepath: string) {
  //   const filePathTokens = filepath.split('/');
  //   console.log("testing");
  //   return  filePathTokens[filePathTokens.length - 1];
  // }

  private markAsRead(mailID: number) {
    this.store.dispatch(new ReadMail({ ids: mailID.toString(), read: true }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ClearMailDetail(this.mail || {}));
  }

  onReply(mail: Mail) {
    this.composeMailData[mail.id] = {
      subject: mail.subject,
      parentId: this.mail.id,
      content: this.getMessageSummary(mail)
    };
    if (mail.sender !== this.currentMailbox.email) {
      this.composeMailData[mail.id].receivers = [mail.sender];
    } else if (this.mail.sender !== this.currentMailbox.email) {
      this.composeMailData[mail.id].receivers = [this.mail.sender];
    } else {
      this.composeMailData[mail.id].receivers = this.mail.receiver;
    }
    this.mailOptions[mail.id].isComposeMailVisible = true;
  }

  onReplyAll(mail: Mail) {
    this.composeMailData[mail.id] = {
      cc: [...mail.receiver, ...mail.cc],
      subject: mail.subject,
      parentId: this.mail.id,
      content: this.getMessageSummary(mail)
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

  onForward(mail: Mail) {
    this.composeMailData[mail.id] = {
      content:  this.getMessageSummary(mail, 'Forwarded') + '</br>' + this.decryptedContents[mail.id],
      subject: this.mail.subject
    };
    this.mailOptions[mail.id].isComposeMailVisible = true;
  }

  onComposeMailHide(mail: Mail) {
    this.composeMailData[mail.id] = {};
    this.mailOptions[mail.id].isComposeMailVisible = false;
  }

  onDelete(mail: Mail) {
    if (mail.folder === MailFolderType.TRASH) {
      this.store.dispatch(new DeleteMail({ ids: mail.id }));
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
      this.router.navigateByUrl(`/mail/${this.mailFolder}`);
    }
  }

  toggleGmailExtra(mail: Mail) {
    this.mailOptions[mail.id].showGmailExtraContent = !this.mailOptions[mail.id].showGmailExtraContent;
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
        cc = `CC: <span class="text-muted">${hasCC.innerHTML}</span>`;
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
    setTimeout(() => {
      window.scrollTo({
        top: elementRef.offsetTop,
        behavior: 'smooth'
      });
    }, 100);
  }

  private getMessageSummary(mail: Mail, messageType: string = 'Original') {
    let content =  `</br>---------- ${messageType} message ----------</br>` +
      `From: &lt;${mail.sender}&gt;</br>` +
      `Date: ${mail.sent_at ? this.dateTimeUtilService.formatDateTimeStr(mail.sent_at, 'medium') : this.dateTimeUtilService.formatDateTimeStr(mail.created_at, 'medium')}</br>` +
      `Subject: ${mail.subject}</br>` +
      `To: ${mail.receiver.map(receiver => '&lt;' + receiver + '&gt;').join(', ')}</br>`;

    if (mail.cc.length > 0) {
      content += `CC: ${mail.cc.map(cc => '&lt;' + cc + '&gt;').join(', ')}</br>`;
    }

    return content;
  }
}
