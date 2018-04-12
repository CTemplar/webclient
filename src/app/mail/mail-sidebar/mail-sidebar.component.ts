import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mail-sidebar',
  templateUrl: './mail-sidebar.component.html',
  styleUrls: ['./mail-sidebar.component.scss']
})
export class MailSidebarComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  // == Open NgbModal
  open(content) {
    this.modalService.open(content, {size: 'sm'});
  }

}
