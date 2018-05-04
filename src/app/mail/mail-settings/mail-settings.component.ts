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

  // == Methods related to ngbModal

  // == Open change password NgbModal
  changePasswordModalOpen(passwordContent) {
    this.modalService.open(passwordContent, {centered: true, windowClass: 'modal-md'});
  }

  // == Open add custom filter NgbModal
  addCustomFilterModalOpen(customFilterContent) {
    this.modalService.open(customFilterContent, {centered: true, windowClass: 'modal-sm'});
  }

  // == Open add white list NgbModal
  whitelistModalOpen(whitelistContent) {
    this.modalService.open(whitelistContent, {centered: true, windowClass: 'modal-sm'});
  }

  // == Open add black list NgbModal
  blacklistModalOpen(blacklistContent) {
    this.modalService.open(blacklistContent, {centered: true, windowClass: 'modal-sm'});
  }

  // == Open billing information NgbModal
  billingInfoModalOpen(billingInfoContent) {
    this.modalService.open(billingInfoContent, {centered: true, windowClass: 'modal-lg'});
  }

  // == Open add new payment NgbModal
  newPaymentMethodModalOpen(newPaymentMethodContent) {
    this.modalService.open(newPaymentMethodContent, {centered: true, windowClass: 'modal-sm'});
  }

  // == Open make a donation NgbModal
  makeDonationModalOpen(makeDonationContent) {
    this.modalService.open(makeDonationContent, {centered: true, windowClass: 'modal-sm'});
  }

}
