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
  mailFolderType = MailFolderType;
  decryptedContents: any = {};
  mailOptions: any = {};
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
            this.decryptedContents[this.mail.id] = this.mail.content;
          } else {
            const decryptedContent = mailState.decryptedContents[this.mail.id];
            if (!decryptedContent || (!decryptedContent.inProgress && !decryptedContent.content && this.mail.content)) {
              this.pgpService.decrypt(this.mail.id, this.mail.content);
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
                  this.pgpService.decrypt(child.id, child.content);
                }
                if (childDecryptedContent && !childDecryptedContent.inProgress && childDecryptedContent.content) {
                  this.decryptedContents[child.id] = childDecryptedContent.content;
                }
                // TODO: mark child email as read
              }
              if (!this.mailOptions[child.id]) {
                this.mailOptions[child.id] = {};
              }
            });
          }
        }
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
      receivers: [mail.sender],
      subject: mail.subject,
      parentId: this.mail.id // TODO: check if this is correct
    };
    this.mailOptions[mail.id].isComposeMailVisible = true;
  }

  onReplyAll(mail: Mail) {
    this.composeMailData[mail.id] = {
      receivers: [mail.sender],
      cc: [...mail.receiver, ...mail.cc],
      subject: mail.subject,
      parentId: this.mail.id
    };
    this.mailOptions[mail.id].isComposeMailVisible = true;
  }

  onForward(mail: Mail) {
    this.composeMailData[mail.id] = {
      content: this.decryptedContents[mail.id],
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

  onPrint(mail: Mail) {
    if (this.decryptedContents[mail.id]) {
      const printWindow = window.open();
      printWindow.document.write(this.decryptedContents[mail.id]);
      printWindow.print();
      printWindow.close();
    }
  }
}
