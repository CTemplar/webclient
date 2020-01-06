import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { MatKeyboardComponent, MatKeyboardRef, MatKeyboardService } from 'ngx7-material-keyboard';
import { AppState, AuthState } from '../../store/datatypes';
import { ClearAuthErrorMessage, FinalLoading, LogIn, RecoverPassword, ResetPassword } from '../../store/actions';
import { LOADING_IMAGE, OpenPgpService, SharedService, UsersService } from '../../store/services';
import { ESCAPE_KEYCODE } from '../../shared/config';
import { PasswordValidation } from '../users-create-account/users-create-account.component';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-sign-in',
  templateUrl: './users-sign-in.component.html',
  styleUrls: ['./users-sign-in.component.scss']
})
export class UsersSignInComponent implements OnDestroy, OnInit {

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

  @ViewChild('usernameVC', { static: false }) usernameVC: ElementRef;
  @ViewChild('passwordVC', { static: false }) passwordVC: ElementRef;
  @ViewChild('resetPasswordModal', { static: false }) resetPasswordModal;

  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;
  private defaultLocale: string = 'US International';

  constructor(private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private store: Store<AppState>,
              private sharedService: SharedService,
              private _keyboardService: MatKeyboardService,
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
        this.authState = authState;
      });
  }

  ngOnDestroy() {
    this.store.dispatch(new ClearAuthErrorMessage());
    this.sharedService.hideFooter.emit(false);
    this.closeKeyboard();
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

  openUsernameOSK() {
    if (this.isKeyboardOpened) {
      this.isKeyboardOpened = false;
      this.closeKeyboard();
      return;
    }
    if (!this._keyboardService.isOpened) {
      this._keyboardRef = this._keyboardService.open(this.defaultLocale, {});
    }
    this._keyboardRef.instance.setInputInstance(this.usernameVC);
    this._keyboardRef.instance.attachControl(this.loginForm.controls['username']);
    this.usernameVC.nativeElement.focus();
    this.isKeyboardOpened = true;
    this.prependCloseButtonToMatKeyboard();
  }

  openPasswordOSK() {
    if (this.isKeyboardOpened) {
      this.isKeyboardOpened = false;
      this.closeKeyboard();
      return;
    }
    if (!this._keyboardService.isOpened) {
      this._keyboardRef = this._keyboardService.open(this.defaultLocale, {});
    }
    this._keyboardRef.instance.setInputInstance(this.passwordVC);
    this._keyboardRef.instance.attachControl(this.loginForm.controls['password']);
    this.passwordVC.nativeElement.focus();
    this.isKeyboardOpened = true;
    this.prependCloseButtonToMatKeyboard();
  }

  closeKeyboard() {
    if (this._keyboardRef) {
      this._keyboardRef.dismiss();
    }
  }

  onInputFocusChange(input) {
    if (this.isKeyboardOpened) {
      this.isKeyboardOpened = false;
      if (input === 'username') {
        this.openUsernameOSK();
      } else if (input === 'password') {
        this.openPasswordOSK();
      }
    }
  }

  private prependCloseButtonToMatKeyboard() {
    const matKeyboardWrapper = document.getElementsByClassName('mat-keyboard-wrapper');
    if (matKeyboardWrapper && this.checkIfCloseButtonExist()) {
      const elChild = document.createElement('a');
      elChild.setAttribute('id', 'close-mat-keyboard');
      elChild.setAttribute('class', 'close-mat-keyboard');
      elChild.innerHTML = '<i class="fa fa-times" id="close-mat-keyboard-icon"></i>';
      // Prepend it to the parent element
      matKeyboardWrapper[0].insertBefore(elChild, matKeyboardWrapper[0].firstChild);
    }
  }

  private checkIfCloseButtonExist() {
    return !document.getElementById('close-mat-keyboard');
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEYCODE) {
      this.isKeyboardOpened = false;
      this.closeKeyboard();
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (event.target.id === 'close-mat-keyboard' || event.target.id === 'close-mat-keyboard-icon') {
      this.isKeyboardOpened = false;
      this.closeKeyboard();
    }
  }

}
