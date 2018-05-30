// Angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators, PatternValidator, AbstractControl } from '@angular/forms';

// Rxjs
import { Observable } from 'rxjs/Observable';

// Bootstrap
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

// Store
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/datatypes';
import { selectAuthState } from '../../store/selectors';
import { SignUp, FinalLoading } from '../../store/actions';

// Service
import { OpenPgpService } from '../../store/services';
import { SharedService } from '../../store/services';

declare var openpgp;

export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
       const password = AC.get('password').value; // to get value in input tag
       const confirmPassword = AC.get('confirmPwd').value; // to get value in input tag
        if (password !== confirmPassword) {
            AC.get('confirmPwd').setErrors( {MatchPassword: true} );
        } else {
            return null;
        }
    }
}



@Component({
  selector: 'app-users-create-account',
  templateUrl: './users-create-account.component.html',
  styleUrls: ['./users-create-account.component.scss']
})
export class UsersCreateAccountComponent implements OnDestroy, OnInit {

  public isTextToggled: boolean = false;
  signupForm: FormGroup;
  isRecoveryEmail: boolean = false;
  isConfirmedPrivacy: boolean = false;
  isLoading: boolean = false;
  isFormCompleted: boolean = false;
  errorMessage: string = '';
  getState: Observable<any>;

  constructor(private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private router: Router,
              private store: Store<AuthState>,
              private openPgpService: OpenPgpService,
              private sharedService: SharedService
                 ) {
    this.getState = this.store.select(selectAuthState);
  }

  ngOnInit() {

    this.sharedService.hideFooter.emit(true);

    this.signupForm = this.formBuilder.group({
      'username': ['', [ Validators.required ]],
      'password': ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9]{10,50}$')]
      ],
      'confirmPwd': ['', [Validators.required]],
      'recoveryEmail': ['', [Validators.pattern('[a-z0-9!#$%&*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&*+/=?^_`{|}~-]+)' +
              '*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]]
    }, {
      validator: PasswordValidation.MatchPassword
    });

    this.getState.subscribe((state) => {
      this.isLoading = false;
      this.errorMessage = state.errorMessage;
    });
    setTimeout(() => this.store.dispatch(new FinalLoading({ loadingState: false })));
  }

  // == Open NgbModal
  openGenerateKeyModal(generateKeyContent) {
    this.modalService.open(generateKeyContent, {
      centered: true,
      windowClass: 'modal-md'
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPwd').value
       ? null : {'mismatch': true};
  }

  // == Toggle password visibility
  togglePassword(input: any): any {
    if (!input.value) {
      return;
    }
    input.type = input.type === 'password' ?  'text' : 'password';
  }

  // == Is text toggled
  toggleText(): void {
    const bool = this.isTextToggled;
    this.isTextToggled = bool === false ? true : false;
  }
  formCompleted() {
    if (this.signupForm.valid && this.isConfirmedPrivacy) {
      this.isFormCompleted = true;
    }
  }
  signup() {
    if (this.signupForm.valid && this.isConfirmedPrivacy) {
      this.isFormCompleted = true;
    }
  }

  private navigateToBillingPage() {
    this.router.navigateByUrl('/billing-info');
  }

  recaptchaResolved(captchaResponse: string) {
    this.openPgpService.generateKey(this.signupForm.value).then(() => {
      this.signupForm.value.captchaResponse = captchaResponse;
      this.store.dispatch(new SignUp(this.signupForm.value));
    });
  }

  ngOnDestroy() {
    this.store.dispatch(new FinalLoading({ loadingState: true }));
    this.sharedService.hideFooter.emit(false);
  }
}
