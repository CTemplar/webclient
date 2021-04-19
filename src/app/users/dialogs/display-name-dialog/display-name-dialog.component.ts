import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AppState, AuthState, MailBoxesState } from '../../../store/datatypes';
import { Mailbox } from '../../../store/models';
import { MailboxSettingsUpdate } from '../../../store/actions';
import { SharedService } from '../../../store/services';
import { NoWhiteSpaceValidator } from '../../../shared/validators/no-whitespace.validator';
import { NOT_FIRST_LOGIN } from '../../../shared/config';
import { UseCacheDialogComponent } from '../use-cache-dialog/use-cache-dialog.component';

@UntilDestroy()
@Component({
  selector: 'app-display-name-dialog',
  templateUrl: './display-name-dialog.component.html',
  styleUrls: ['./display-name-dialog.component.scss'],
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
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.changeDisplayNameForm = this.formBuilder.group({
      username: ['', [Validators.required, NoWhiteSpaceValidator.noWhiteSpaceValidator]],
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
    const dispName = this.changeDisplayNameForm.controls.username.value;
    if (this.changeDisplayNameForm.valid && dispName !== '') {
      this.selectedMailbox.display_name = dispName;
      this.store.dispatch(
        new MailboxSettingsUpdate({ ...this.selectedMailbox, successMsg: 'Display name saved successfully.' }),
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

  openUseCacheConfirmDialog() {
    const ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-sm users-action-modal',
    };
    this.modalService.open(UseCacheDialogComponent, ngbModalOptions);
  }

  ngOnDestroy(): void {
    /**
     * Check if first login or fresh login
     */
    if (localStorage.getItem(NOT_FIRST_LOGIN) !== 'true') {
      this.openUseCacheConfirmDialog();
    }
  }
}
