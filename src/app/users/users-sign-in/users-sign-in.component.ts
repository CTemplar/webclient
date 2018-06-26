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
  focusedInput: string = '';
  username: string = '';
  password: string = 'password';
  layout: any = 'alphanumeric';
  @ViewChild('usernameVC') usernameVC: ElementRef;
  @ViewChild('passwordVC') passwordVC: ElementRef;

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

  toggleFocus(event, input: string, el): any {
    event.stopPropagation();
    if (input.includes('username')) {
      if (
        this.usernameVC.nativeElement.attributes.id.nodeValue.includes('noSpan')
      ) {
        this.usernameVC.nativeElement.attributes.id.nodeValue = this.usernameVC.nativeElement.attributes.id.nodeValue.replace(
          'noSpan',
          ''
        );
      } else {
        this.usernameVC.nativeElement.attributes.id.nodeValue += 'noSpan';
      }
    } else {
      if (
        this.passwordVC.nativeElement.attributes.id.nodeValue.includes('noSpan')
      ) {
        this.passwordVC.nativeElement.attributes.id.nodeValue = this.passwordVC.nativeElement.attributes.id.nodeValue.replace('noSpan', '');
      } else {
        this.passwordVC.nativeElement.attributes.id.nodeValue += 'noSpan';
      }
    }
    setTimeout(() => el.focus());
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
}
