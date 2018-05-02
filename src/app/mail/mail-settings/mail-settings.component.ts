import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mail-settings',
  templateUrl: './mail-settings.component.html',
  styleUrls: ['./mail-settings.component.scss']
})
export class MailSettingsComponent implements OnInit {

  // == Defining public property as boolean
  public selectedIndex = -1; // Assuming no element are selected initially

  constructor(private modalService: NgbModal, config: NgbDropdownConfig) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = "outside";
  }

  ngOnInit() {
  }

  // == Toggle active state of the slide in price page
  toggleSlides(index) {
    this.selectedIndex = index;
    document.querySelector('.package-xs-tab > li').classList.remove('active');
    document.querySelector('.package-prime-col').classList.remove('active-slide');
  }

  // == Open change password NgbModal
  changePasswordOpen(content) {
    this.modalService.open(content, {windowClass: 'modal-md'});
  }

}
