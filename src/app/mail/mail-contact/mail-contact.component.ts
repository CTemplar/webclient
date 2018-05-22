import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserState } from '../../store/datatypes';
import { selectUsersState } from '../../store/selectors';
import { Contact } from '../../store';
// Store
import { Store } from '@ngrx/store';
import {NgbModal, ModalDismissReasons, NgbDropdownConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-mail-contact',
  templateUrl: './mail-contact.component.html',
  styleUrls: ['./mail-contact.component.scss']
})
export class MailContactComponent implements OnInit {
  // tslint:disable-next-line:indent
  isLayoutSplitted: boolean = false;
  public getUsersState$: Observable<any>;
  public userState: UserState;

  constructor(private store: Store<UserState>, private modalService: NgbModal, config: NgbDropdownConfig) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = "outside";
  }
  
  ngOnInit() {
    this.getUsersState$ = this.store.select(selectUsersState);
    this.store.dispatch(new Contact({}));
    this.updateUsersStatus();
  }

  private updateUsersStatus(): void {
    this.getUsersState$.subscribe((state: UserState) => {
      this.userState = state;
    });
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
