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
    trigger('pageAnimations', [
      transition(':enter', [
        query('.info-box2', style({opacity: 0})),
        query('.info-box3', style({opacity: 0})),
        query('.info-box4', style({opacity: 0})),
        query('@pageAnimation1', animateChild()),
        query('.info-box2', style({opacity: 1})),
        query('@pageAnimation2', animateChild()),
        query('.info-box3', style({opacity: 1})),
        query('@pageAnimation3', animateChild()),
        query('.info-box4', style({opacity: 1})),
        query('@pageAnimation4', animateChild()),
      ])
    ]),
    trigger('pageAnimation1', [
      transition(':enter', [
        query('.animated1', [
          style({opacity: 0, transform: 'translateY(-100%)'}),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ]),
      ])
    ]),
    trigger('pageAnimation2', [
      transition(':enter', [
        query('.animated2', [
          style({opacity: 0, transform: 'translateY(-100%)'}),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ]),
      ])
    ]),
    trigger('pageAnimation3', [
      transition(':enter', [
        query('.animated3', [
          style({opacity: 0, transform: 'translateY(-100%)'}),
          stagger(833, [
            animate('833ms', style({ opacity: 1, transform: 'none' }))
          ])
        ]),
      ])
    ]),
    trigger('pageAnimation4', [
      transition(':enter', [
        query('.animated4', [
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

  @HostBinding('@pageAnimations')
  public animatePage = true;

  private signupState: SignupState;

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

  @HostListener('@pageAnimation4.done', ['$event']) onClick(evt) {
    console.log('animation finished');
  }
}
