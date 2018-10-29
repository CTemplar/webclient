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
import { AppState, AuthState, SignupState, UserState } from '../../store/datatypes';
import { CheckUsernameAvailability, FinalLoading, SignUp, UpdateSignupData } from '../../store/actions';
// Service
import { OpenPgpService, SharedService } from '../../store/services';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { NotificationService } from '../../store/services/notification.service';
import { debounceTime, tap } from 'rxjs/operators';
import { UserAccountInitDialogComponent } from '../dialogs/user-account-init-dialog/user-account-init-dialog.component';

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
  isFormCompleted: boolean = false;
  errorMessage: string = '';
  selectedPlan: any;
  data: any = null;
  isCaptchaCompleted: boolean = false;
  signupInProgress: boolean = false;
  signupState: SignupState;
  submitted = false;
  userKeys: any;
  generatingKeys: boolean;

  constructor(private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private router: Router,
              private store: Store<AppState>,
              private openPgpService: OpenPgpService,
              private sharedService: SharedService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.handleUserState();
    this.sharedService.hideFooter.emit(true);

    this.signupForm = this.formBuilder.group({
      'username': ['', [
        Validators.required,
        Validators.pattern(/^[a-z]+[a-z0-9._-]+$/i),
        Validators.minLength(4),
        Validators.maxLength(64),
      ]],
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
        this.errorMessage = state.errorMessage;
      });

    this.store.select(state => state.user)
      .takeUntil(this.destroyed$)
      .subscribe((state: UserState) => {
        this.selectedPlan = state.membership.id;
      });
    setTimeout(() => this.store.dispatch(new FinalLoading({ loadingState: false })));
    this.handleUsernameAvailability();
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
    this.submitted = true;
    if (this.isConfirmedPrivacy === null) {
      this.isConfirmedPrivacy = false;
    }

    if (this.isRecoveryEmail === null) {
      this.isRecoveryEmail = false;
    }

    if (this.signupState.usernameExists || this.signupForm.invalid || !this.isConfirmedPrivacy ||
      (!this.isRecoveryEmail && (!this.signupForm.get('recoveryEmail').value || this.signupForm.get('recoveryEmail').invalid))) {
      return false;
    }

    this.isFormCompleted = true;

    const signupFormValue = this.signupForm.value;
    this.openPgpService.generateUserKeys(signupFormValue.username, signupFormValue.password);
    if (this.selectedPlan === 1) {
      this.navigateToBillingPage();
    }
    this.modalService.open(UserAccountInitDialogComponent, { centered: true, windowClass: 'modal-sm' });
  }

  openAccountInitModal() {
    this.modalService.open(UserAccountInitDialogComponent, { centered: true, windowClass: 'modal-sm' });
  }

  private navigateToBillingPage() {
    this.userKeys = this.openPgpService.getUserKeys();
    if (!this.userKeys) {
      this.generatingKeys = true;
      this.waitForPGPKeys('navigateToBillingPage');
      return;
    }
    this.generatingKeys = false;
    this.store.dispatch(new UpdateSignupData({
      ...this.userKeys,
      recovery_email: this.signupForm.get('recoveryEmail').value,
      username: this.signupForm.get('username').value,
      password: this.signupForm.get('password').value,
      recaptcha: this.signupForm.value.captchaResponse
    }));
    this.router.navigateByUrl('/billing-info');
  }

  waitForPGPKeys(callback) {
    setTimeout(() => {
      if (this.openPgpService.getUserKeys()) {
        this[callback]();
        return;
      }
      this.waitForPGPKeys(callback);
    }, 1000);
  }

  recaptchaResolved(captchaResponse: string) {
    this.signupForm.value.captchaResponse = captchaResponse;
    this.isCaptchaCompleted = true;
  }

  signupFormCompleted() {
    if (this.selectedPlan === 1 && this.signupForm.value.captchaResponse) {
      this.navigateToBillingPage();
      return;
    }
    this.signupInProgress = true;
    this.userKeys = this.openPgpService.getUserKeys();
    if (!this.userKeys) {
      this.waitForPGPKeys('signupFormCompleted');
      return;
    }
    this.data = {
      ...this.userKeys,
      recovery_email: this.signupForm.get('recoveryEmail').value,
      username: this.signupForm.get('username').value,
      password: this.signupForm.get('password').value,
      recaptcha: this.signupForm.value.captchaResponse
    };
    this.store.dispatch(new SignUp(this.data));
  }

  private handleUserState(): void {
    this.store.select(state => state.auth).takeUntil(this.destroyed$).subscribe((authState: AuthState) => {
      if (this.signupInProgress && !authState.inProgress) {
        if (!authState.errorMessage) {
          this.notificationService.showSnackBar(`Account created successfully.`);
        } else {
          this.notificationService.showSnackBar(`Failed to create account.` + authState.errorMessage);
        }
        this.signupInProgress = false;
      }
      this.signupState = authState.signupState;
    });
  }

  handleUsernameAvailability() {
    this.signupForm.get('username').valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe((username) => {
        if (!this.signupForm.controls['username'].errors) {
          this.store.dispatch(new CheckUsernameAvailability(username));
        }
      });
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
  }
}
