// Angular
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

// Bootstrap
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import { Store } from '@ngrx/store';
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
  password: string = '';
  @ViewChild('usernameVC') userNameVC: any;
  @ViewChild('passwordVC') passwordVC;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<AuthState>,
    private sharedService: SharedService
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
    input.type = input.type === 'password' ? 'text' : 'password';
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

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
  }
  setFocusedInput(inputName: string) {
    this.focusedInput = inputName;
  }

  focusOut() {
    console.log('fdsfds');
  }

  getKeyPressed(keyString) {
    if (keyString === 'Down') {
      this.focusedInput = '';
    }
    if (this.focusedInput === 'username') {
      this.userNameVC.nativeElement.focus();
      if (keyString === '⌫') {
        this.username = this.username.slice(0, -1);
      } else {
        this.username += keyString;
      }
      console.log(this.username);
    }
    if (this.focusedInput === 'password') {
      this.password += keyString;
    }
  }
}
