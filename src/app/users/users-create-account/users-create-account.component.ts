// Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
// Rxjs
import { Observable } from 'rxjs/Observable';
// Bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Store
import { Store } from '@ngrx/store';
import { AppState, AuthState, UserState } from '../../store/datatypes';
import { FinalLoading, SignUp, SignUpFailure, UpdateSignupData } from '../../store/actions';
// Service
import { OpenPgpService, SharedService } from '../../store/services';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { NotificationService } from '../../store/services/notification.service';

declare var openpgp;

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value; // to get value in input tag
    const confirmPassword = AC.get('confirmPwd').value; // to get value in input tag
    if (password !== confirmPassword) {
      AC.get('confirmPwd').setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }
}

@TakeUntilDestroy()
@Component({
  selector: 'app-users-create-account',
  templateUrl: './users-create-account.component.html',
  styleUrls: ['./users-create-account.component.scss']
})
export class UsersCreateAccountComponent implements OnInit, OnDestroy {

  readonly destroyed$: Observable<boolean>;

  isTextToggled: boolean = false;
  signupForm: FormGroup;
  isRecoveryEmail: boolean = null;
  isConfirmedPrivacy: boolean = null;
  isLoading: boolean = false;
  isFormCompleted: boolean = false;
  errorMessage: string = '';
  userNameTaken: boolean = null;
  selectedPlan: any;
  pgpProgress: number = 0;
  data: any = null;
  isCaptchaCompleted: boolean = false;
  signupInProgress: boolean = false;
  constructor(private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private router: Router,
              private store: Store<AppState>,
              private openPgpService: OpenPgpService,
              private sharedService: SharedService,
              private notificationService: NotificationService) {}

  ngOnInit() {
    this.handleUserState();
    this.sharedService.hideFooter.emit(true);

    this.signupForm = this.formBuilder.group({
      'username': ['', [Validators.required]],
      'password': ['', [Validators.required]],
      'confirmPwd': ['', [Validators.required]],
      'recoveryEmail': ['', [Validators.pattern('[a-z0-9!#$%&*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&*+/=?^_`{|}~-]+)' +
        '*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]]
    }, {
      validator: PasswordValidation.MatchPassword
    });

    this.store.select(state => state.auth)
      .takeUntil(this.destroyed$)
      .subscribe((state: AuthState) => {
        this.isLoading = false;
        this.errorMessage = state.errorMessage;
      });

    this.store.select(state => state.user)
      .takeUntil(this.destroyed$)
      .subscribe((state: UserState) => {
        this.selectedPlan = state.membership.id;
      });
    setTimeout(() => this.store.dispatch(new FinalLoading({ loadingState: false })));
  }

  // == Toggle password visibility
  togglePassword(input: any): any {
    if (!input.value) {
      return;
    }
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  // == Is text toggled
  toggleText(): void {
    const bool = this.isTextToggled;
    this.isTextToggled = bool === false ? true : false;
  }

  signup() {
    if (this.isConfirmedPrivacy == null) {
      this.isConfirmedPrivacy = false;
    }

    if (this.isRecoveryEmail == null) {
      this.isRecoveryEmail = false;
    }

    if (this.signupForm.valid && this.isConfirmedPrivacy) {
      this.isFormCompleted = true;
      if (this.selectedPlan === 1) {
        this.navigateToBillingPage();
      }
    }
  }

  private navigateToBillingPage() {
    this.store.dispatch(new UpdateSignupData({
      recovery_email: this.signupForm.get('recoveryEmail').value,
      username: this.signupForm.get('username').value,
      password: this.signupForm.get('password').value
    }));
    this.router.navigateByUrl('/billing-info');
  }

  recaptchaResolved(captchaResponse: string) {
    this.signupForm.value.captchaResponse = captchaResponse;
    this.isCaptchaCompleted = true;
  }
  signupFormCompleted () {
    this.data = {
      recovery_email: this.signupForm.get('recoveryEmail').value,
      username: this.signupForm.get('username').value,
      password: this.signupForm.get('password').value,
      recaptcha: this.signupForm.value.captchaResponse
    };
    this.signupInProgress = true;
    this.store.dispatch(new SignUp(this.data));
  }

  private handleUserState(): void {
    this.store.select(state => state.auth).
    takeUntil(this.destroyed$).subscribe((state: AuthState) => {
      if (this.signupInProgress && !state.inProgress  ) {
      if ( !state.errorMessage) {
          this.notificationService.showSnackBar(`Account created successfully.`);
      } else {
        this.notificationService.showSnackBar(`Failed to create account.` + state.errorMessage);
      }
        this.signupInProgress = false;
      }
    });
  }

  checkUsernameTaken(event: any) {
    // TODO: Check if username is duplicated
    if (event.target.value.length > 0) {
      this.userNameTaken = false;
    } else {
      this.userNameTaken = true;
    }
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
  }
}
