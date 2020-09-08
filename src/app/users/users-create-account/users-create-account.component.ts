// Angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
// Rxjs
// Bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// Store
import { Store } from '@ngrx/store';
import { AppState, AuthState, PaymentType, PlanType, SignupState } from '../../store/datatypes';
import { CheckUsernameAvailability, FinalLoading, SignUp, UpdateSignupData } from '../../store/actions';
// Service
import { OpenPgpService, SharedService, UsersService } from '../../store/services';
import { NotificationService } from '../../store/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { PRIMARY_WEBSITE, VALID_EMAIL_REGEX, LANGUAGES } from '../../shared/config';
import { UserAccountInitDialogComponent } from '../dialogs/user-account-init-dialog/user-account-init-dialog.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

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

@UntilDestroy()
@Component({
  selector: 'app-users-create-account',
  templateUrl: './users-create-account.component.html',
  styleUrls: ['./users-create-account.component.scss']
})
export class UsersCreateAccountComponent implements OnInit, OnDestroy {
  isTextToggled = false;
  signupForm: FormGroup;
  isRecoveryEmail: boolean = null;
  isConfirmedPrivacy: boolean = null;
  errorMessage = '';
  selectedPlan: PlanType;
  planType = PlanType;
  data: any = null;
  signupInProgress = false;
  signupState: SignupState;
  submitted = false;
  userKeys: any;
  generatingKeys: boolean;
  modalRef: NgbModalRef;
  inviteCode: string;
  primaryWebsite = PRIMARY_WEBSITE;
  private paymentType: PaymentType;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<AppState>,
    private openPgpService: OpenPgpService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private authService: UsersService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.handleUserState();
    this.sharedService.hideFooter.emit(true);

    this.signupForm = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-z]+([a-z0-9]*[._-]?[a-z0-9]+)+$/i),
            Validators.minLength(4),
            Validators.maxLength(64)
          ]
        ],
        password: ['', [Validators.required, Validators.maxLength(128)]],
        confirmPwd: ['', [Validators.required, Validators.maxLength(128)]],
        recoveryEmail: ['', [Validators.pattern(VALID_EMAIL_REGEX)]]
      },
      {
        validator: PasswordValidation.MatchPassword
      }
    );

    this.store
      .select(state => state.auth)
      .pipe(untilDestroyed(this))
      .subscribe((state: AuthState) => {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        this.selectedPlan = state.signupState.plan_type || queryParams.plan || PlanType.PRIME;
        this.paymentType = state.signupState.payment_type || queryParams.billing || PaymentType.ANNUALLY;
        this.errorMessage = state.errorMessage;
      });

    setTimeout(() => this.store.dispatch(new FinalLoading({ loadingState: false })));
    this.handleUsernameAvailability();
    this.sharedService.loadPricingPlans();
    window.addEventListener('beforeunload', this.authService.onBeforeLoader, true);
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

    if (
      this.signupState.usernameExists !== false ||
      this.signupForm.invalid ||
      !this.isConfirmedPrivacy ||
      (!this.isRecoveryEmail &&
        (!this.signupForm.get('recoveryEmail').value || this.signupForm.get('recoveryEmail').invalid))
    ) {
      return false;
    }

    if (this.selectedPlan !== PlanType.FREE) {
      this.navigateToBillingPage();
    } else {
      this.signupFormCompleted();
    }
  }

  openAccountInitModal() {
    this.modalRef = this.modalService.open(UserAccountInitDialogComponent, {
      centered: true,
      windowClass: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    });
  }

  private navigateToBillingPage() {
    this.store.dispatch(
      new UpdateSignupData({
        recovery_email: this.signupForm.get('recoveryEmail').value,
        username: this.signupForm.get('username').value,
        password: this.signupForm.get('password').value,
        recaptcha: this.signupForm.value.captchaResponse
      })
    );
    this.router.navigateByUrl(`/billing-info?plan=${this.selectedPlan}&billing=${this.paymentType}`);
  }

  signupFormCompleted() {
    if (this.selectedPlan !== PlanType.FREE) {
      this.navigateToBillingPage();
    } else {
      this.signupInProgress = true;
      this.openAccountInitModal();
      this.openPgpService.generateUserKeys(
        this.signupForm.get('username').value,
        this.signupForm.get('password').value
      );
      this.waitForPGPKeys();
    }
  }

  waitForPGPKeys() {
    setTimeout(() => {
      this.userKeys = this.openPgpService.getUserKeys();
      if (this.userKeys) {
        this.pgpKeyGenerationCompleted();
        return;
      }
      this.waitForPGPKeys();
    }, 1000);
  }

  pgpKeyGenerationCompleted() {
    if (this.modalRef) {
      this.modalRef.componentInstance.pgpGenerationCompleted();
    }
    const currentLocale = this.translate.currentLang ? this.translate.currentLang : 'en';
    const currentLang = LANGUAGES.find(lang => {
      if (lang.locale === currentLocale) {
        return true;
      }
    });
    this.data = {
      ...this.userKeys,
      recovery_email: this.signupForm.get('recoveryEmail').value,
      username: this.signupForm.get('username').value,
      password: this.signupForm.get('password').value,
      invite_code: this.inviteCode,
      language: currentLang.name
    };
    this.store.dispatch(new SignUp(this.data));
  }

  private handleUserState(): void {
    this.store
      .select(state => state.auth)
      .pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        if (this.signupInProgress && !authState.inProgress) {
          if (authState.errorMessage) {
            this.notificationService.showSnackBar(`Failed to create account.` + authState.errorMessage);
          }
          this.signupInProgress = false;
        }
        this.signupState = authState.signupState;
      });
  }

  handleUsernameAvailability() {
    this.signupForm
      .get('username')
      .valueChanges.pipe(debounceTime(500))
      .subscribe(username => {
        if (!this.signupForm.controls['username'].errors) {
          this.store.dispatch(new CheckUsernameAvailability(username));
        }
      });
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
  }
}
