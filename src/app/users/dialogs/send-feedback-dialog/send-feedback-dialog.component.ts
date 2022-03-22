import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UntilDestroy } from '@ngneat/until-destroy';

import { AppState, FeedbackType } from '../../../store/datatypes';
import { SendFeedback } from '../../../store/actions';

@UntilDestroy()
@Component({
  selector: 'app-send-feedback-dialog',
  templateUrl: './send-feedback-dialog.component.html',
  styleUrls: ['./send-feedback-dialog.component.scss'],
})
export class SendFeedbackDialogComponent implements OnInit {
  feedbackForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private store: Store<AppState>, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.feedbackForm = this.formBuilder.group({ message: '' });
  }

  onSubmit() {
    const payload = { ...this.feedbackForm.value, feedback_type: FeedbackType.STOP_AUTO_RENEWAL };
    this.store.dispatch(new SendFeedback(payload));
    this.activeModal.dismiss();
  }
}
