import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { AppState, AuthState, SignupState } from '../../../store/datatypes';

@TakeUntilDestroy()
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
        query('h3, li', [
          style({ opacity: 0, transform: 'translateY(-100%)' }),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ]),
    trigger('pageAnimation3', [
      transition(':enter', [
        query('li', [
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
export class UserAccountInitDialogComponent implements OnInit, OnChanges, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  @Input() isPgpGenerationComplete: boolean;

  step = 0;

  private signupState: SignupState;
  private isAccountCreationComplete: boolean;

  constructor(public activeModal: NgbActiveModal,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.store.select(state => state.auth).takeUntil(this.destroyed$)
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
  }

  ngOnChanges(changes: any) {
    if (changes.isPgpGenerationComplete && changes.isPgpGenerationComplete.currentValue === true) {
      if (this.step === 1) {
        // move animation to page 3
        this.step++;
      }
    }
  }

  ngOnDestroy() {
  }

  onAnimationStart(evt) {
  }

  onAnimationDone(evt) {
    if (this.step === 1 && !this.isPgpGenerationComplete) {
      // pause animation because pgp key generation is not complete
    } else if (this.step === 3) {
      setTimeout(() => {
        this.step++;
        if (this.isAccountCreationComplete) {
          this.close();
        }
      }, 3000);
    } else {
      setTimeout(() => {
        this.step++;
      }, 3000);
    }
  }

  close() {
    this.activeModal.close();
  }
}
