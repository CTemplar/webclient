import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// Store
import { Store } from '@ngrx/store';
import { GetMessage } from '../../store/actions';
// Store
import { AppState, SecureContent, SecureMessageState } from '../../store/datatypes';
import { Mail } from '../../store/models';
// Service
import { OpenPgpService, SharedService } from '../../store/services';
import { DateTimeUtilService } from '../../store/services/datetime-util.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-decrypt-message',
  templateUrl: './decrypt-message.component.html',
  styleUrls: ['./decrypt-message.component.scss']
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

  private secureMessageState: SecureMessageState;

  constructor(private route: ActivatedRoute,
              private store: Store<AppState>,
              private formBuilder: FormBuilder,
              private sharedService: SharedService,
              private openPgpService: OpenPgpService,
              private dateTimeUtilService: DateTimeUtilService) {
  }

  ngOnInit() {
    this.sharedService.hideEntireFooter.emit(true);
    this.sharedService.isExternalPage.emit(true);

    this.decryptForm = this.formBuilder.group({
      password: ['', [Validators.required]]
    });

    this.route.params.pipe(untilDestroyed(this)).subscribe(params => {
      this.hash = params['hash'];
      this.secret = params['secret'];
      this.senderId = decodeURIComponent(params['senderId']);
      this.store.dispatch(new GetMessage({ hash: this.hash, secret: this.secret }));
    });

    this.store.select(state => state.secureMessage).pipe(untilDestroyed(this))
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
        if (this.secureMessageState) {
          if (this.secureMessageState.isKeyDecryptionInProgress && !state.isKeyDecryptionInProgress && !state.errorMessage) {
            this.openPgpService.decryptSecureMessageContent(state.decryptedKey, new SecureContent(this.message));
          } else if (this.secureMessageState.isContentDecryptionInProgress && !state.isContentDecryptionInProgress) {
            this.decryptedContent = state.decryptedContent.content;
            if (this.message.is_subject_encrypted) {
              this.decryptedSubject = state.decryptedContent.subject;
              this.message.subject = state.decryptedContent.subject;
            }
          }
        }
        this.secureMessageState = state;
      });
  }

  ngOnDestroy() {
    this.sharedService.hideEntireFooter.emit(false);
    this.sharedService.isExternalPage.emit(false);
  }

  onSubmit(data: any) {
    this.showFormErrors = true;
    if (this.decryptForm.valid && this.message) {
      this.isLoading = true;
      this.openPgpService.decryptSecureMessagePrivKey(this.message.encryption.private_key, data.password);
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
