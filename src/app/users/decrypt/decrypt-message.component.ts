import { Component, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { GetMessage } from '../../store/actions';
import { AppState, SecureContent, SecureMessageState } from '../../store/datatypes';
import { Mail } from '../../store/models';
import { OpenPgpService, SharedService } from '../../store/services';
import { DateTimeUtilService } from '../../store/services/datetime-util.service';

@UntilDestroy()
@Component({
  selector: 'app-decrypt-message',
  templateUrl: './decrypt-message.component.html',
  styleUrls: ['./decrypt-message.component.scss'],
})
export class DecryptMessageComponent implements OnInit, OnDestroy {
  decryptForm: FormGroup;

  hash: string;

  secret: string;

  senderId: string;

  message: Mail;

  decryptedContent: string;

  showFormErrors: boolean;

  errorMessage: string;

  isLoading: boolean;

  isMessageExpired: boolean;

  isReplying: boolean;

  decryptedSubject: string;

  secureMessageState: SecureMessageState;

  password = '';

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private openPgpService: OpenPgpService,
    private dateTimeUtilService: DateTimeUtilService,
  ) {}

  ngOnInit() {
    this.sharedService.hideEntireFooter.emit(true);
    this.sharedService.isExternalPage.emit(true);

    this.decryptForm = this.formBuilder.group({
      password: ['', [Validators.required]],
    });

    this.route.params.pipe(untilDestroyed(this)).subscribe(parameters => {
      this.hash = parameters.hash;
      this.secret = parameters.secret;
      this.senderId = decodeURIComponent(parameters.senderId);
      this.store.dispatch(new GetMessage({ hash: this.hash, secret: this.secret }));
    });

    this.store
      .select(state => state.secureMessage)
      .pipe(untilDestroyed(this))
      .subscribe((state: SecureMessageState) => {
        this.isLoading = state.inProgress || state.isContentDecryptionInProgress;
        this.errorMessage = state.errorMessage;
        if (!this.message && state.message) {
          // message is loaded so check if it has expired
          if (this.dateTimeUtilService.isDateTimeInPast(state.message.encryption.expires)) {
            this.isMessageExpired = true;
          }
        }
        this.message = state.message;
        if (state.decryptedContent) {
          if (state.decryptedContent.content) {
            this.decryptedContent = state.decryptedContent.content || '';
          }
          if (this.message && this.message.is_subject_encrypted && state.decryptedContent.subject) {
            this.decryptedSubject = state.decryptedContent.subject || '';
            this.message.subject = state.decryptedContent.subject || '';
          }
        }
      });
  }

  ngOnDestroy() {
    this.sharedService.hideEntireFooter.emit(false);
    this.sharedService.isExternalPage.emit(false);
  }

  onSubmit(data: any) {
    this.showFormErrors = true;
    this.password = data.password;
    if (this.decryptForm.valid && this.message) {
      this.isLoading = true;
      this.openPgpService.decryptWithOnlyPassword(new SecureContent(this.message), data.password);
    }
  }

  onReply() {
    this.isReplying = true;
  }

  onCancelReply() {
    this.isReplying = false;
  }

  onReplySuccess() {
    this.isReplying = false;
  }

  onExpired() {
    this.isMessageExpired = true;
  }
}
