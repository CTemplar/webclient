// Angular
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Store } from '@ngrx/store';
import { MatKeyboardComponent, MatKeyboardRef, MatKeyboardService } from '@ngx-material-keyboard/core';
import { Observable } from 'rxjs/Observable';

// Store
import { AuthState } from '../../store/datatypes';
import { selectAuthState } from '../../store/selectors';
import { LogIn } from '../../store/actions';
import { FinalLoading } from '../../store/actions';

// Service
import { SharedService } from '../../store/services';

@Component({
  selector: 'app-users-sign-in',
  templateUrl: './users-sign-in.component.html',
  styleUrls: ['./users-sign-in.component.scss']
})
export class UsersSignInComponent implements OnDestroy, OnInit {
  loginForm: FormGroup;
  resetForm: FormGroup;
  showFormErrors = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  // == NgBootstrap Modal stuffs
  resetModalRef: any;
  getState: Observable<any>;
  focusedInput: string = '';
  username: string = '';
  password: string = 'password';
  layout: any = 'alphanumeric';
  isKeyboardOpened: boolean;
  @ViewChild('usernameVC') usernameVC: ElementRef;
  @ViewChild('passwordVC') passwordVC: ElementRef;

  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;
  private defaultLocale: string = 'US International';

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private store: Store<AuthState>,
    private sharedService: SharedService,
    private _keyboardService: MatKeyboardService
  ) {
    this.getState = this.store.select(selectAuthState);
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(new FinalLoading({ loadingState: false }));
    });

    this.sharedService.hideFooter.emit(true);

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.resetForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]]
    });

    this.getState.subscribe(state => {
      this.isLoading = false;
      this.errorMessage = state.errorMessage;
    });
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
    this.closeKeyboard();
  }

  // == Open NgbModal
  open(content) {
    this.resetModalRef = this.modalService.open(content, {
      centered: true,
      windowClass: 'modal-md'
    });
  }

  // == Toggle password visibility
  togglePassword(input: any): any {
    if (!input.value) {
      return;
    }
    this.password = this.password === 'password' ? 'text' : 'password';
  }

  login(user) {
    this.showFormErrors = true;
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.store.dispatch(new LogIn(user));
    }
  }

  resetPassword(data) {
    this.resetModalRef.close();
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
}
