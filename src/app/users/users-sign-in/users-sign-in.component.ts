import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-users-sign-in',
  templateUrl: './users-sign-in.component.html',
  styleUrls: ['./users-sign-in.component.scss']
})
export class UsersSignInComponent implements OnInit {
  lgoinForm: FormGroup;
  resetForm: FormGroup;
  showFormErrors = false;
  // == NgBootstrap Modal stuffs
  resetModalRef: any;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.lgoinForm = this.formBuilder.group({
      'email': ['', [
        Validators.required,
        Validators.pattern('[^ @]*@[^ @]*')
      ]],
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
    console.log(user);
    this.showFormErrors = true;
    if (this.lgoinForm.valid) {
    }
  }

  resetPassword(data) {
    console.log(data);
    this.resetModalRef.close();
  }

}
