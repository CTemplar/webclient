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
  childDecryptedContents: any = {};
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

              // Mark mail as read
              if (!this.mail.read) {
                this.markAsRead(this.mail.id);
              }
            }
            if (this.mail.children) {
              this.mail.children.forEach(child => {
                const childDecryptedContent = mailState.decryptedContents[child.id];
                if (!childDecryptedContent || (!childDecryptedContent.inProgress && !childDecryptedContent.content && child.content)) {
                  this.pgpService.decrypt(child.id, child.content);
                }
                if (childDecryptedContent && !childDecryptedContent.inProgress && childDecryptedContent.content) {
                  this.childDecryptedContents[child.id] = childDecryptedContent.content;
                }
                // TODO: mark child email as read
              });
            }
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

  onReply() {
    this.composeMailData = {
      receivers: [this.mail.sender],
      subject: this.mail.subject,
      parentId: this.mail.id
    };
    this.isComposeMailVisible = true;
  }

  onReplyAll() {
    this.composeMailData = {
      receivers: [this.mail.sender],
      cc: [...this.mail.receiver, ...this.mail.cc],
      subject: this.mail.subject,
      parentId: this.mail.id
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

  onPrint() {
    if (this.decryptedContent) {
      const printWindow = window.open();
      printWindow.document.write(this.decryptedContent);
      printWindow.print();
      printWindow.close();
    }
  }
}
