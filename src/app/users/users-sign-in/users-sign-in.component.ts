// Angular
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

// Bootstrap
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

// Store
import { AuthState } from '../../store/datatypes';
import { selectAuthState } from '../../store/selectors';
import { LogIn } from '../../store/actions/auth.action';

@Component({
  selector: 'app-users-sign-in',
  templateUrl: './users-sign-in.component.html',
  styleUrls: ['./users-sign-in.component.scss']
})
export class UsersSignInComponent implements OnInit {
  lgoinForm: FormGroup;
  resetForm: FormGroup;
  showFormErrors = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  // == NgBootstrap Modal stuffs
  resetModalRef: any;
  getState: Observable<any>;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private router: Router, private store: Store<AuthState>) {
      this.getState = this.store.select(selectAuthState);
    }

  ngOnInit() {
    this.lgoinForm = this.formBuilder.group({
      'username': ['', [ Validators.required ]],
      'password': ['', [Validators.required]]
    });

    this.resetForm = this.formBuilder.group({
      'name': ['', [Validators.required]],
      'email': ['', [Validators.required]]
    });

    this.getState.subscribe((state) => {
      this.isLoading = false;
      this.errorMessage = state.errorMessage;
    });
  }

  // == Open NgbModal
  open(content) {
    this.resetModalRef = this.modalService.open(content, {windowClass: 'modal-md'});
  }

  // == Toggle password visibility
  togglePassword(input: any): any {
    if (!input.value) {
      return;
    }
    input.type = input.type === 'password' ?  'text' : 'password';
  }

  login(user) {
    this.showFormErrors = true;
    if (this.lgoinForm.valid) {
      this.isLoading = true;
      this.store.dispatch(new LogIn(user));
    }
  }

  resetPassword(data) {
    this.resetModalRef.close();
  }

}
