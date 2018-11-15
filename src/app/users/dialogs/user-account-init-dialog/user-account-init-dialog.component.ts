import { Component, OnInit, HostBinding, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
  animateChild,
} from '@angular/animations';
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
          style({opacity: 0, transform: 'translateY(-100%)'}),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ]),
      ])
    ]),
    trigger('pageAnimation2', [
      transition(':enter', [
        query('h3, li', [
          style({opacity: 0, transform: 'translateY(-100%)'}),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ]),
      ])
    ]),
    trigger('pageAnimation3', [
      transition(':enter', [
        query('li', [
          style({opacity: 0, transform: 'translateY(-100%)'}),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ]),
      ])
    ]),
    trigger('pageAnimation4', [
      transition(':enter', [
        query('h3, li', [
          style({opacity: 0, transform: 'translateY(-100%)'}),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ]),
      ])
    ])
  ]
})
export class UserAccountInitDialogComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  private signupState: SignupState;

  private step = 0;

  constructor(public activeModal: NgbActiveModal,
              private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select(state => state.auth).takeUntil(this .destroyed$)
      .subscribe((authState: AuthState) => {
        if (this.signupState && this.signupState.inProgress && !authState.signupState.inProgress) {
          this.activeModal.dismiss();
        }
        this.signupState = authState.signupState;
    });
  }

  ngOnDestroy() {
  }

  onAnimationStart (evt) {
  }

  onAnimationDone (evt) {
    this.step++;
  }
}
