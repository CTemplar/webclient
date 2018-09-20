import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { DeleteMail, MoveMail } from '../../store/actions';
import { ClearMailDetail, GetMailDetail, ReadMail } from '../../store/actions/mail.actions';
import { AppState, MailState } from '../../store/datatypes';
import { Mail, MailFolderType } from '../../store/models/mail.model';
import { OpenPgpService } from '../../store/services';

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
  isComposeMailVisible: boolean;
  decryptedContent: string;
  mailFolderType = MailFolderType;
  private mailFolder: MailFolderType;

  constructor(private route: ActivatedRoute,
              private store: Store<AppState>,
              private pgpService: OpenPgpService,
              private router: Router) {
  }

  ngOnInit() {
    this.store.select(state => state.mail).takeUntil(this.destroyed$)
      .subscribe((mailState: MailState) => {
        if (mailState.mailDetail) {
          this.mail = mailState.mailDetail;
          if (this.mail.folder === MailFolderType.OUTBOX && !this.mail.is_encrypted) {
            this.decryptedContent = this.mail.content;
          } else {
            const decryptedContent = mailState.decryptedContents[this.mail.id];
            if (!decryptedContent || (!decryptedContent.inProgress && !decryptedContent.content && this.mail.content)) {
              this.pgpService.decrypt(this.mail.id, this.mail.content);
            }
            if (decryptedContent && !decryptedContent.inProgress && decryptedContent.content) {
              this.decryptedContent = decryptedContent.content;

              // Mar mail as read
              if (!this.mail.read) {
                this.markAsRead(this.mail.id);
              }
            }
          }

        }
      });

    this.route.params.subscribe(params => {
      const id = +params['id'];

      // Check if email is already available in state
      if (!this.mail) {
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

  onReply() {
    this.composeMailData = {
      receivers: [this.mail.sender],
      subject: this.mail.subject
    };
    this.isComposeMailVisible = true;
  }

  onReplyAll() {
    this.composeMailData = {
      receivers: [this.mail.sender],
      cc: [...this.mail.receiver, ...this.mail.cc],
      subject: this.mail.subject
    };
    this.isComposeMailVisible = true;
  }

  onForward() {
    this.composeMailData = {
      content: this.decryptedContent,
      subject: this.mail.subject
    };
    this.isComposeMailVisible = true;
  }

  onComposeMailHide() {
    this.composeMailData = {};
    this.isComposeMailVisible = false;
  }

  onDelete() {
    if (this.mail.folder === MailFolderType.TRASH) {
      this.store.dispatch(new DeleteMail({ ids: this.mail.id }));
    } else {
      this.store.dispatch(new MoveMail({
        ids: this.mail.id,
        folder: MailFolderType.TRASH,
        sourceFolder: this.mail.folder,
        mail: this.mail,
        allowUndo: true
      }));
    }
    this.router.navigateByUrl(`/mail/${this.mailFolder}`);
  }

  onMarkAsSpam() {
    this.store.dispatch(new MoveMail({
      ids: this.mail.id,
      folder: MailFolderType.SPAM,
      sourceFolder: this.mail.folder,
      mail: this.mail
    }));
    this.router.navigateByUrl(`/mail/${this.mailFolder}`);
  }

  onPrint(): void {
    if (this.decryptedContent) {

        let popupWin;

        const subject = document.getElementById('mail-subject').innerHTML;
        const from = document.getElementById('mail-from').innerHTML;
        const to = document.getElementById('mail-to').innerHTML;
        const date = document.getElementById('mail-date').innerHTML;
        const content = document.getElementById('mail-content').innerHTML;

        const hasCC = document.getElementById('mail-cc');
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
}
