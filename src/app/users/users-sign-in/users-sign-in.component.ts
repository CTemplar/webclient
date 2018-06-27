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
  useranme_osk: boolean = false;
  password_osk: boolean = false;
  username: string = '';
  password: string = 'password';
  layout: any = 'alphanumeric';

  @ViewChild('passwordVC') passwordElement: ElementRef;
  @ViewChild('usernameVC') usernameElement: ElementRef;

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
    this.password = this.password === 'password' ? 'text' : 'password';
  }

  toggleFocus( input: string): any {
    event.stopPropagation();
    if (input === 'password') {
      this.password_osk = !this.password_osk;
      setTimeout(() => this.passwordElement.nativeElement.focus());
    } else if (input === 'username') {
    this.useranme_osk = !this.useranme_osk;
    setTimeout(() => this.usernameElement.nativeElement.focus());
  }
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

  disableOsk(e) {
    this.useranme_osk = this.password_osk = false;
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
  }
}
