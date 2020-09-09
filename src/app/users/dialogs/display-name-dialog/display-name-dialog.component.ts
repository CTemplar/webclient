import { Component, OnDestroy, OnInit } from '@angular/core';
import { MailboxSettingsUpdate } from '../../../store/actions';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, AuthState, MailBoxesState } from '../../../store/datatypes';
import { Mailbox } from '../../../store/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedService } from '../../../store/services';

@UntilDestroy()
@Component({
  selector: 'app-display-name-dialog',
  templateUrl: './display-name-dialog.component.html',
  styleUrls: ['./display-name-dialog.component.scss']
})
export class DisplayNameDialogComponent implements OnInit, OnDestroy {
  changeDisplayNameForm: FormGroup;
  email = 'username@ctemplar.com';
  inProgress: boolean;
  recoveryKey: string;

  private selectedMailbox: Mailbox;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<AppState>,
    private sharedService: SharedService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.changeDisplayNameForm = this.formBuilder.group({
      username: ['', [Validators.required]]
    });

    this.store
      .select(state => state.mailboxes)
      .pipe(untilDestroyed(this))
      .subscribe((mailboxesState: MailBoxesState) => {
        this.inProgress = mailboxesState.inProgress;
        this.selectedMailbox = mailboxesState.currentMailbox;
        if (this.selectedMailbox) {
          this.email = this.selectedMailbox.email;
        } else if (mailboxesState.mailboxes && mailboxesState.mailboxes[0]) {
          this.email = mailboxesState.mailboxes[0].email;
        }
      });
    this.store
      .select(state => state.auth)
      .pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        this.recoveryKey = authState.recovery_key;
      });
  }

  submitDisplayNameForm() {
    if (!this.selectedMailbox) {
      this.close();
      return;
    }
    const dispName = this.changeDisplayNameForm.controls['username'].value;
    if (this.changeDisplayNameForm.valid && dispName !== '') {
      this.selectedMailbox.display_name = dispName;
      this.store.dispatch(
        new MailboxSettingsUpdate({ ...this.selectedMailbox, successMsg: 'Display name saved successfully.' })
      );
      this.close();
    }
  }

  copyToClipboard(text: string) {
    this.sharedService.copyToClipboard(text);
  }

  private close() {
    this.activeModal.dismiss();
  }

  ngOnDestroy(): void {}
}
