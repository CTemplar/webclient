import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-users-sign-in',
  templateUrl: './users-sign-in.component.html',
  styleUrls: ['./users-sign-in.component.scss']
})
export class UsersSignInComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  // == Open NgbModal
  open(content) {
    this.modalService.open(content);
  }

  // == Toggle password visibility
  togglePassword(input: any): any {
    if (input.value === '') return;
    input.type = input.type === 'password' ?  'text' : 'password';
  }

}
