import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mail-contact',
  templateUrl: './mail-contact.component.html',
  styleUrls: ['./mail-contact.component.scss']
})
export class MailContactComponent implements OnInit {

	isLayoutSplitted: boolean = false;

	constructor() { }

	ngOnInit() {
	}

	initSplitContactLayout():any {
    	this.isLayoutSplitted = true;
	}

	destroySplitContactLayout():any {
    	this.isLayoutSplitted = false;
	}

}
