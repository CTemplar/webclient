import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mail-sidebar',
  templateUrl: './mail-sidebar.component.html',
  styleUrls: ['./mail-sidebar.component.scss']
})
export class MailSidebarComponent implements OnInit {

  constructor(private modalService: NgbModal, config: NgbDropdownConfig) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = "outside";
  }

  ngOnInit() {
  }

  // == Open NgbModal
  open(content) {
    this.modalService.open(content, {centered: true, windowClass: 'modal-sm'});
  }

}
