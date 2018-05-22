import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mail-contact',
  templateUrl: './mail-contact.component.html',
  styleUrls: ['./mail-contact.component.scss']
})
export class MailContactComponent implements OnInit {

	isLayoutSplitted: boolean = false;

	constructor(private modalService: NgbModal, config: NgbDropdownConfig) {
		// customize default values of dropdowns used by this component tree
		config.autoClose = "outside";
	}

	ngOnInit() {
	}

	initSplitContactLayout():any {
    	this.isLayoutSplitted = true;

    	if (this.isLayoutSplitted === true) {
    		window.document.documentElement.classList.add('no-scroll');
    	}
	}

	destroySplitContactLayout():any {
    	this.isLayoutSplitted = false;

    	if (this.isLayoutSplitted === false) {
    		window.document.documentElement.classList.remove('no-scroll');
    	}
	}

	// == Open change password NgbModal
	addUserContactModalOpen(addUserContent) {
		this.modalService.open(addUserContent, {centered: true, windowClass: 'modal-sm users-action-modal'});
	}
}
