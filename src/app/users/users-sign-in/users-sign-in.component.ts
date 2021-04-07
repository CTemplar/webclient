import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import Keyboard from 'simple-keyboard';
import { filter } from 'rxjs/operators';

import { AppState, AuthState } from '../../store/datatypes';
import { ClearAuthErrorMessage, FinalLoading, LogIn, RecoverPassword, ResetPassword } from '../../store/actions';
import { LOADING_IMAGE, OpenPgpService, SharedService, UsersService } from '../../store/services';
import { ESCAPE_KEYCODE } from '../../shared/config';
import { PasswordValidation } from '../users-create-account/users-create-account.component';

@UntilDestroy()
@Component({
  selector: 'app-users-sign-in',
  templateUrl: './users-sign-in.component.html',
  styleUrls: ['./users-sign-in.component.scss'],
})
export class UsersSignInComponent implements OnDestroy, OnInit, AfterViewInit {
  loginForm: FormGroup;

  recoverPasswordForm: FormGroup;

  resetPasswordForm: FormGroup;

  showFormErrors = false;

  showResetPasswordFormErrors = false;

  errorMessage = '';

  resetPasswordErrorMessage = '';

  isLoading = false;

  isConfirmedPrivacy: boolean = null;

  // == NgBootstrap Modal stuffs
  resetModalRef: any;

  username = '';

  password = 'password';

  layout = 'alphanumeric';

  isKeyboardOpened: boolean;

  isRecoverFormSubmitted: boolean;

  isGeneratingKeys: boolean;

  isRecoveryCodeSent: boolean;

  authState: AuthState;

  otp: string;

  loadingImage = LOADING_IMAGE;

  isRecoveryKeyMode: boolean;

  @ViewChild('usernameVC') usernameVC: ElementRef;

  @ViewChild('passwordVC') passwordVC: ElementRef;

  @ViewChild('resetPasswordModal') resetPasswordModal: any;

  @ViewChild('otpInput') otpInput: ElementRef;

  keyboard: Keyboard;

  currentInput: InputFields;

  inputFields = InputFields;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private sharedService: SharedService,
    private userService: UsersService,
    private router: Router,
    private openPgpService: OpenPgpService,
  ) {
    document.querySelector('#main').classList.add('visible-signin');
    document.querySelector('#app-outer-id').classList.add('visible-signin');
  }

  ngOnInit() {
    this.store.dispatch(new ClearAuthErrorMessage());
    setTimeout(() => {
      this.store.dispatch(new FinalLoading({ loadingState: false }));
    });

    this.sharedService.hideFooter.emit(true);

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });

    this.recoverPasswordForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      recovery_email: ['', [Validators.required, Validators.email]],
    });
    this.resetPasswordForm = this.formBuilder.group(
      {
        code: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPwd: ['', [Validators.required]],
        username: ['', [Validators.required]],
      },
      {
        validator: PasswordValidation.MatchPassword,
      },
    );

    this.store
      .select(state => state.auth)
      .pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        if (!authState.isAuthenticated) {
          this.isLoading = authState.inProgress;
        } else {
          this.isLoading = false;
        }
        this.errorMessage = authState.errorMessage;
        this.isRecoveryCodeSent = authState.isRecoveryCodeSent;
        this.resetPasswordErrorMessage = authState.resetPasswordErrorMessage;
        if (authState.errorMessage) {
        }
        if (
          this.isRecoverFormSubmitted &&
          this.authState.inProgress &&
          !authState.inProgress &&
          !authState.resetPasswordErrorMessage
        ) {
          this.resetModalRef.dismiss();
        }
        if (authState.auth2FA.show2FALogin) {
          setTimeout(() => {
            this.otpInput.nativeElement.focus();
          }, 200);
        }
        this.authState = authState;
      });
  }

  ngOnDestroy() {
    document.querySelector('#main').classList.remove('visible-signin');
    document.querySelector('#app-outer-id').classList.remove('visible-signin');
    this.store.dispatch(new ClearAuthErrorMessage());
    this.sharedService.hideFooter.emit(false);
  }

  openResetPasswordModal() {
    this.isRecoverFormSubmitted = false;
    this.isRecoveryCodeSent = false;
    this.isRecoveryKeyMode = false;
    this.showResetPasswordFormErrors = false;
    this.resetPasswordErrorMessage = '';
    this.recoverPasswordForm.reset();
    this.resetPasswordForm.reset();
    this.resetModalRef = this.modalService.open(this.resetPasswordModal, {
      centered: true,
      windowClass: 'modal-md',
      backdrop: 'static',
    });
  }

  // == Toggle password visibility
  togglePassword(input: any): any {
    if (!input.value) {
      return;
    }
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  login(user: any, otp?: string, isOtp?: boolean) {
    this.showFormErrors = true;
    if (isOtp && !otp) {
      return;
    }
    if (this.loginForm.valid) {
      this.store.dispatch(new LogIn({ ...user, otp }));
    }
  }

  toggleRememberMe() {
    this.loginForm.controls.rememberMe.setValue(!this.loginForm.controls.rememberMe.value);
  }

  continueLogin() {
    this.authState.anti_phishing_phrase = '';
    this.router.navigateByUrl('/mail');
  }

  recoverPassword(data: any) {
    this.showResetPasswordFormErrors = true;
    if (this.isConfirmedPrivacy === null) {
      this.isConfirmedPrivacy = false;
    }
    if (this.recoverPasswordForm.valid && this.isConfirmedPrivacy) {
      data.username = this.userService.trimUsername(data.username);
      this.store.dispatch(new RecoverPassword(data));
      this.resetPasswordForm.get('username').setValue(data.username);
      this.showResetPasswordFormErrors = false;
    }
  }

  resetPassword(data: any) {
    this.showResetPasswordFormErrors = true;
    if (this.resetPasswordForm.valid) {
      data.username = this.userService.trimUsername(data.username);
      this.isGeneratingKeys = true;
      this.openPgpService.generateUserKeys(data.username, data.password);
      if (this.openPgpService.getUserKeys()) {
        this.resetPasswordConfirmed(data);
      } else {
        this.waitForPGPKeys(data);
      }
    }
  }

  waitForPGPKeys(data: any) {
    setTimeout(() => {
      if (this.openPgpService.getUserKeys()) {
        this.resetPasswordConfirmed(data);
        return;
      }
      this.waitForPGPKeys(data);
    }, 1000);
  }

  resetPasswordConfirmed(data: any) {
    this.isGeneratingKeys = false;
    const requestData = {
      code: data.code,
      username: data.username,
      password: data.password,
      ...this.openPgpService.getUserKeys(),
    };
    this.isRecoverFormSubmitted = true;
    this.store.dispatch(new ResetPassword(requestData));
  }

  // On screen keyboard handling
  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
    });
    this.loginForm
      .get(InputFields.USERNAME)
      .valueChanges.pipe(
        untilDestroyed(this),
        filter(value => this.isKeyboardOpened && value !== this.keyboard.getInput()),
      )
      .subscribe(value => {
        this.onInputChange(value);
      });
    this.loginForm
      .get(InputFields.PASSWORD)
      .valueChanges.pipe(
        untilDestroyed(this),
        filter(value => this.isKeyboardOpened && value !== this.keyboard.getInput()),
      )
      .subscribe(value => {
        this.onInputChange(value);
      });
  }

  onChange(input: string) {
    this.loginForm.get(this.currentInput).setValue(input);
  }

  onKeyPress(button: string) {
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === '{shift}' || button === '{lock}') {
      this.handleShift();
    }
  }

  onInputChange(value: string) {
    this.keyboard.setInput(value);
  }

  handleShift() {
    const currentLayout = this.keyboard.options.layoutName;
    const shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

    this.keyboard.setOptions({
      layoutName: shiftToggle,
    });
  }

  openOSK(input: any) {
    if (!(this.isKeyboardOpened && this.currentInput !== input)) {
      this.isKeyboardOpened = !this.isKeyboardOpened;
    }
    this.currentInput = input;
    if (this.isKeyboardOpened) {
      if (this.currentInput === InputFields.PASSWORD) {
        this.passwordVC.nativeElement.focus();
      } else {
        this.usernameVC.nativeElement.focus();
      }
      this.onInputChange(this.loginForm.get(this.currentInput).value);
    }
  }

  onInputFocusChange(input: any) {
    if (this.isKeyboardOpened) {
      this.isKeyboardOpened = false;
      this.openOSK(input);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEYCODE) {
      this.isKeyboardOpened = false;
    }
  }
}

enum InputFields {
  USERNAME = 'username',
  PASSWORD = 'password',
}
