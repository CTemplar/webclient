import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppState, AuthState, SignupState } from '../../../store/datatypes';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Mailbox } from '../../../store/models';
import { DisplayNameDialogComponent } from '../display-name-dialog/display-name-dialog.component';

@UntilDestroy()
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
          stagger(833, [animate('833ms', style({ opacity: 1, transform: 'none' }))]),
        ]),
      ]),
    ]),
    trigger('pageAnimation2', [
      transition(':enter', [
        query('li', [
          style({ opacity: 0, transform: 'translateY(-100%)' }),
          stagger(833, [animate('833ms', style({ opacity: 1, transform: 'none' }))]),
        ]),
      ]),
    ]),
    trigger('pageAnimation3', [
      transition(':enter', [
        query('h3, li', [
          style({ opacity: 0, transform: 'translateY(-100%)' }),
          stagger(833, [animate('833ms', style({ opacity: 1, transform: 'none' }))]),
        ]),
      ]),
    ]),
    trigger('pageAnimation4', [
      transition(':enter', [
        query('h3, li', [
          style({ opacity: 0, transform: 'translateY(-100%)' }),
          stagger(833, [animate('833ms', style({ opacity: 1, transform: 'none' }))]),
        ]),
      ]),
    ]),
  ],
})
export class UserAccountInitDialogComponent implements OnInit, OnDestroy {
  @Input() isPgpGenerationComplete: boolean;

  mailboxes: Mailbox[];
  step = 0;
  emails: string;

  private signupState: SignupState;
  private isAccountCreationComplete: boolean;
  private isDisplayNameOpened: boolean;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, private store: Store<AppState>) {}

  ngOnInit() {
    this.isDisplayNameOpened = false;
    this.store
      .select(state => state.auth)
      .pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        if (this.signupState && this.signupState.inProgress && !authState.signupState.inProgress) {
          if (authState.errorMessage || this.step === 4) {
            this.isDisplayNameOpened = authState.errorMessage ? true : this.isDisplayNameOpened;
            this.close();
          } else {
            this.isAccountCreationComplete = true;
            setTimeout(() => {
              this.close();
            }, 5000);
          }
        }
        this.signupState = { ...authState.signupState };
      });
    setTimeout(() => {
      this.close();
    }, 120000);
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

  ngOnDestroy() {}

  onAnimationStart(evt) {}

  onAnimationDone(evt) {
    if (this.step === 2 && !this.isPgpGenerationComplete) {
      // pause animation because pgp key generation is not complete
    } else if (this.step === 3) {
      setTimeout(() => {
        this.step++;
        if (this.isAccountCreationComplete) {
          this.close();
        }
      }, 2000);
    } else {
      setTimeout(() => {
        this.step++;
      }, 2000);
    }
  }

  close() {
    if (this.activeModal) {
      this.activeModal.close();
    }
    if (!this.isDisplayNameOpened) {
      this.isDisplayNameOpened = true;
      this.modalService.open(DisplayNameDialogComponent, {
        centered: true,
        windowClass: 'modal-sm',
        backdrop: 'static',
      });
    }
  }
}
