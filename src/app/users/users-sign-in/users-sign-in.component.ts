import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-users-sign-in',
  templateUrl: './users-sign-in.component.html',
  styleUrls: ['./users-sign-in.component.scss']
})
export class UsersSignInComponent implements OnInit {
  lgoinForm: FormGroup;
  resetForm: FormGroup;
  showFormErrors = false;
  isLoginState: boolean = true;
  // == NgBootstrap Modal stuffs
  resetModalRef: any;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder,
    private userService: UsersService, private router: Router) { }

  ngOnInit() {
    this.lgoinForm = this.formBuilder.group({
      'username': ['', [ Validators.required ]],
      'password': ['', [Validators.required]]
    });

    this.resetForm = this.formBuilder.group({
      'name': ['', [Validators.required]],
      'email': ['', [Validators.required]]
    });
  }

  // == Open NgbModal
  open(content) {
    this.resetModalRef = this.modalService.open(content);
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
      this.userService.signIn(user)
      .subscribe((result) => {
        if (result === 'failed') {
          this.isLoginState = false;
        } else {
          this.isLoginState = true;
          this.router.navigate(['/mail']);
        }
      }, (err) => {
        this.isLoginState = false;
      });
    }
  }

  resetPassword(data) {
    console.log(data);
    this.resetModalRef.close();
  }

}
