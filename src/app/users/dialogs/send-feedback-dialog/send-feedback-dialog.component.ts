import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AppState, AuthState, FeedbackType, MailBoxesState } from '../../../store/datatypes';
import { Mailbox } from '../../../store/models';
import { MailboxSettingsUpdate, SendFeedback } from '../../../store/actions';
import { SharedService } from '../../../store/services';
import { NoWhiteSpaceValidator } from '../../../shared/validators/no-whitespace.validator';
import { UseCacheDialogComponent } from '../use-cache-dialog/use-cache-dialog.component';

@UntilDestroy()
@Component({
  selector: 'app-send-feedback-dialog',
  templateUrl: './send-feedback-dialog.component.html',
  styleUrls: ['./send-feedback-dialog.component.scss'],
})
export class SendFeedbackDialogComponent implements OnInit, OnDestroy {
  feedbackForm: FormGroup;

  inProgress: boolean;

  feedbackType: FeedbackType = FeedbackType.ACCOUNT_DELETE;

  showFormError: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.feedbackForm = this.formBuilder.group({
      feedback: ['', [Validators.required]],
    });
    this.store
      .select(state => state.auth)
      .pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {});
  }

  onSubmit() {
    this.showFormError = true;
    if (this.feedbackForm.valid) {
      this.store.dispatch(
        new SendFeedback({
          message: this.feedbackForm.controls['feedback'].value,
          feedback_type: this.feedbackType,
        }),
      );
      this.close();
    }
  }

  private close() {
    this.activeModal.dismiss();
  }

  ngOnDestroy(): void {}
}
