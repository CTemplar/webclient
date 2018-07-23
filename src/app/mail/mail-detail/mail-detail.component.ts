import { Component, OnInit } from '@angular/core';
import { Mail } from '../../store/models/mail.model';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ClearMailDetail, GetMailDetail, ReadMail } from '../../store/actions/mail.actions';
import { Observable } from 'rxjs/Observable';
import { AppState, MailState } from '../../store/datatypes';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
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
  showReplyBox: boolean;
  decryptedContent: string;

  constructor(private route: ActivatedRoute,
              private store: Store<AppState>,
              private pgpService: OpenPgpService) {}

  ngOnInit() {
    this.store.select(state => state.mail).takeUntil(this.destroyed$)
      .subscribe((mailState: MailState) => {
        if (mailState.mailDetail) {
          this.mail = mailState.mailDetail;
          if (!mailState.isPGPInProgress && !mailState.decryptedContent && this.mail.content) {
            this.pgpService.decrypt(this.mail.content);
          }
        }
        if (!mailState.isPGPInProgress && mailState.decryptedContent && this.mail) {
          this.decryptedContent = mailState.decryptedContent;
        }
      });


    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.getMailDetail(id);
      this.markAsRead(id);
    });
  }

  getMailDetail(messageId: number) {
    this.store.dispatch(new GetMailDetail(messageId));
  }

  private markAsRead(mailID: number){
    this.store.dispatch(new ReadMail({ ids: mailID.toString(), read: true }));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ClearMailDetail());
  }

  onComposeMailHide() {
    this.showReplyBox = false;
  }
}
