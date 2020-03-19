import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { AppState, AuthState } from '../../store/datatypes';
import { ClearAuthErrorMessage, FinalLoading, LogIn, RecoverPassword, ResetPassword } from '../../store/actions';
import { LOADING_IMAGE, OpenPgpService, SharedService, UsersService } from '../../store/services';
import { ESCAPE_KEYCODE } from '../../shared/config';
import { PasswordValidation } from '../users-create-account/users-create-account.component';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Router } from '@angular/router';
import Keyboard from 'simple-keyboard';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-users-sign-in',
  templateUrl: './users-sign-in.component.html',
  styleUrls: ['./users-sign-in.component.scss']
})
export class UsersSignInComponent implements OnDestroy, OnInit, AfterViewInit {

  loginForm: FormGroup;
  recoverPasswordForm: FormGroup;
  resetPasswordForm: FormGroup;
  showFormErrors = false;
  showResetPasswordFormErrors = false;
  errorMessage: string = '';
  resetPasswordErrorMessage: string = '';
  isLoading: boolean = false;
  // == NgBootstrap Modal stuffs
  resetModalRef: any;
  username: string = '';
  password: string = 'password';
  layout: any = 'alphanumeric';
  isKeyboardOpened: boolean;
  isRecoverFormSubmitted: boolean;
  isGeneratingKeys: boolean;
  isRecoveryCodeSent: boolean;
  authState: AuthState;
  otp: string;
  loadingImage = LOADING_IMAGE;

  @ViewChild('usernameVC') usernameVC: ElementRef;
  @ViewChild('passwordVC') passwordVC: ElementRef;
  @ViewChild('resetPasswordModal') resetPasswordModal;
  @ViewChild('otpInput') otpInput: ElementRef;

  keyboard: Keyboard;
  currentInput: InputFields;
  inputFields = InputFields;

  constructor(private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private store: Store<AppState>,
              private sharedService: SharedService,
              private userService: UsersService,
              private router: Router,
              private openPgpService: OpenPgpService) {}

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
    this.resetPasswordForm = this.formBuilder.group({
        code: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPwd: ['', [Validators.required]],
        username: ['', [Validators.required]],
      },
      {
        validator: PasswordValidation.MatchPassword
      });

    this.store.select(state => state.auth).pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        if (!authState.isAuthenticated) {
          this.isLoading = authState.inProgress;
        }
        this.errorMessage = authState.errorMessage;
        this.isRecoveryCodeSent = authState.isRecoveryCodeSent;
        this.resetPasswordErrorMessage = authState.resetPasswordErrorMessage;
        if (authState.errorMessage) {
        }
        if (this.isRecoverFormSubmitted && this.authState.inProgress && !authState.inProgress && !authState.resetPasswordErrorMessage) {
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
    this.store.dispatch(new ClearAuthErrorMessage());
    this.sharedService.hideFooter.emit(false);
  }

  openResetPasswordModal() {
    this.isRecoverFormSubmitted = false;
    this.isRecoveryCodeSent = false;
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

  login(user, otp?: string, isOtp?: boolean) {
    this.showFormErrors = true;
    if (isOtp && !otp) {
      return;
    }
    if (this.loginForm.valid) {
      this.store.dispatch(new LogIn({ ...user, otp }));
    }
  }

  toggleRememberMe() {
    this.loginForm.controls['rememberMe'].setValue(!this.loginForm.controls['rememberMe'].value);
  }

  continueLogin() {
    this.authState.anti_phishing_phrase = '';
    this.router.navigateByUrl('/mail');
  }

  recoverPassword(data) {
    this.showResetPasswordFormErrors = true;
    if (this.recoverPasswordForm.valid) {
      data.username = this.userService.trimUsername(data.username);
      this.store.dispatch(new RecoverPassword(data));
      this.resetPasswordForm.get('username').setValue(data.username);
      this.showResetPasswordFormErrors = false;
    }
  }

  resetPassword(data) {
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

  waitForPGPKeys(data) {
    setTimeout(() => {
      if (this.openPgpService.getUserKeys()) {
        this.resetPasswordConfirmed(data);
        return;
      }
      this.waitForPGPKeys(data);
    }, 1000);
  }

  resetPasswordConfirmed(data) {
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
      onKeyPress: button => this.onKeyPress(button)
    });
    this.loginForm.get(InputFields.USERNAME).valueChanges
      .pipe(untilDestroyed(this),
        filter(value => this.isKeyboardOpened && value !== this.keyboard.getInput()))
      .subscribe((value) => {
        this.onInputChange(value);
      });
    this.loginForm.get(InputFields.PASSWORD).valueChanges
      .pipe(untilDestroyed(this),
        filter(value => this.isKeyboardOpened && value !== this.keyboard.getInput()))
      .subscribe((value) => {
        this.onInputChange(value);
      });
  }

  onChange(input: string) {
    this.loginForm.get(this.currentInput).setValue(input);
  }

  onKeyPress(button: string) {
    console.log('Button pressed', button);

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
      layoutName: shiftToggle
    });
  }

  openOSK(input) {
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

  onInputFocusChange(input) {
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
  PASSWORD = 'password'
}
