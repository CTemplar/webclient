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
import { BehaviorSubject } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-decrypt-message',
  templateUrl: './decrypt-message.component.html',
  styleUrls: ['./decrypt-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecryptMessageComponent implements OnInit, OnDestroy {
  decryptForm: FormGroup;

  hash: string;

  secret: string;

  senderId: string;

  message$: BehaviorSubject<Mail> = new BehaviorSubject<Mail>({ content: '' });

  decryptedContent: string;

  showFormErrors: boolean;

  errorMessage: string;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
        this.isLoading$.next(state.inProgress || state.isContentDecryptionInProgress);
        this.errorMessage = state.errorMessage;
        if (!this.message$.value && state.message) {
          // message is loaded so check if it has expired
          if (this.dateTimeUtilService.isDateTimeInPast(state.message.encryption.expires)) {
            this.isMessageExpired = true;
          }
        }

        this.message$.next(state.message);
        if (state.decryptedContent) {
          if (state.decryptedContent.content) {
            this.decryptedContent = state.decryptedContent.content || '';
          }
          if (state.message && state.message.is_subject_encrypted && state.decryptedContent.subject) {
            this.decryptedSubject = state.decryptedContent.subject || '';
            this.message$.value.subject = state.decryptedContent.subject || '';
          }
        }
      });
  }

  ngOnDestroy() {
    this.sharedService.isExternalPage.emit(false);
  }

  onSubmit(data: any) {
    this.showFormErrors = true;
    this.password = data.password;
    if (this.decryptForm.valid && this.message$.value) {
      this.isLoading$.next(true);
      this.openPgpService.decryptWithOnlyPassword(new SecureContent(this.message$.value), data.password);
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
