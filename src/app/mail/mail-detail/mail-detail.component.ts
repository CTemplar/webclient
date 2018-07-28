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
      receivers: [this.mail.sender]
    };
    this.isComposeMailVisible = true;
  }

  onReplyAll() {
    this.composeMailData = {
      receivers: [this.mail.sender],
      cc: [...this.mail.receiver, ...this.mail.cc]
    };
    this.isComposeMailVisible = true;
  }

  onForward() {
    this.composeMailData = {
      content: this.decryptedContent
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
        mail: this.mail
      }));
    }
    this.router.navigateByUrl(`/mail/${this.mailFolder}`);
  }
}
