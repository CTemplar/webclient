import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppState, AuthState, MailBoxesState, Settings, SignupState, UserState } from '../../../store/datatypes';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MailSettingsService } from '../../../store/services/mail-settings.service';
import { MailboxSettingsUpdate, SettingsUpdate } from '../../../store/actions';
import { Mailbox } from '../../../store/models';

@Component({
  selector: 'app-user-account-init-dialog',
  templateUrl: './user-account-init-dialog.component.html',
  styleUrls: ['./user-account-init-dialog.component.scss'],
  providers: [],
  animations: [
    trigger('pageAnimation1', [
      transition(':enter', [
        query('h3, li', [
          style({ opacity: 0, transform: 'translateY(-100%)' }),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ]),
    trigger('pageAnimation2', [
      transition(':enter', [
        query('li', [
          style({ opacity: 0, transform: 'translateY(-100%)' }),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ]),
    trigger('pageAnimation3', [
      transition(':enter', [
        query('h3, li', [
          style({ opacity: 0, transform: 'translateY(-100%)' }),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ]),
    trigger('pageAnimation4', [
      transition(':enter', [
        query('h3, li', [
          style({ opacity: 0, transform: 'translateY(-100%)' }),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ])
  ]
})
export class UserAccountInitDialogComponent implements OnInit, OnDestroy {

  @Input() isPgpGenerationComplete: boolean;
  @ViewChild('changeDisplayNameModal', { static: false }) changeDisplayNameModal;
  @Output() public hide = new EventEmitter<boolean>();

  private changeDisplayNameModalRef: NgbModalRef;
  changeDisplayNameForm: FormGroup;
  displayNameFormSubmitted = false;
  mailboxes: Mailbox[];
  step = 0;

  private signupState: SignupState;
  private isAccountCreationComplete: boolean;
  selectedMailboxForSignature: Mailbox;

  constructor(public activeModal: NgbActiveModal,
              private modalService: NgbModal,
              private store: Store<AppState>,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.store.select(state => state.auth).pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        if (this.signupState && this.signupState.inProgress && !authState.signupState.inProgress) {
          if (authState.errorMessage || this.step === 4) {
            this.close();
          } else {
            this.isAccountCreationComplete = true;
          }
        }
        this.signupState = authState.signupState;
      });
    this.store.select(state => state.mailboxes).pipe(untilDestroyed(this))
      .subscribe((mailboxesState: MailBoxesState) => {
        this.mailboxes = mailboxesState.mailboxes;
        this.selectedMailboxForSignature = mailboxesState.currentMailbox;
      });
    this.changeDisplayNameForm = this.formBuilder.group({
      'username': ['', [Validators.required]]
    });
  }

  pgpGenerationCompleted() {
    this.isPgpGenerationComplete = true;
    if (this.step === 2) {
      // move animation to page 4
      setTimeout(() => {
        this.step++;
      }, 1000);

    }

  }

  ngOnDestroy() {
  }

  onAnimationStart(evt) {
  }

  onAnimationDone(evt) {
    if (this.step === 2 && !this.isPgpGenerationComplete) {
      // pause animation because pgp key generation is not complete
    } else if (this.step === 3) {
      setTimeout(() => {
        this.step++;
        if (this.isAccountCreationComplete) {
          this.close();
          this.changeDisplayNameModel();
        }
      }, 2000);
    } else {
      setTimeout(() => {
        this.step++;
      }, 2000);
    }
  }

  close() {
    this.activeModal.close();
  }

  /*Display name*/
  changeDisplayNameModel() {
    this.changeDisplayNameForm.reset();
    this.changeDisplayNameModalRef = this.modalService.open(this.changeDisplayNameModal, {
      centered: true,
      windowClass: 'modal-sm'
    });
  }

  submitDispalyNameForm() {
    const dispName = this.changeDisplayNameForm.controls['username'].value;
    if (this.changeDisplayNameForm.valid && dispName !== '') {
      this.displayNameFormSubmitted = true;
      this.selectedMailboxForSignature.display_name = dispName;
      this.store.dispatch(new MailboxSettingsUpdate(this.selectedMailboxForSignature));
      this.hideDispalyNameModel();
    }
  }
  private hideDispalyNameModel() {
    if (this.changeDisplayNameModalRef) {
      this.changeDisplayNameModalRef.dismiss();
    }
    this.hide.emit(true);
  }


}
