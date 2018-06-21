import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Contact, UserState } from '../../store/datatypes';
import { selectUsersState } from '../../store/selectors';
import { ContactAdd, ContactGet } from '../../store';

// Store
import { Store } from '@ngrx/store';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-mail-contact',
    templateUrl: './mail-contact.component.html',
    styleUrls: ['./mail-contact.component.scss']
})
export class MailContactComponent implements OnInit {

    isLayoutSplitted: boolean = false;
    public getUsersState$: Observable<any>;
    public userState: UserState;
    @ViewChild('newContactForm') newContactForm: NgForm;
    newContactModel: Contact = {
        name: '',
        email: '',
        address: '',
        note: '',
        phone: ''
    };


    constructor(private store: Store<UserState>,
                private modalService: NgbModal,
                config: NgbDropdownConfig) {
        // customize default values of dropdowns used by this component tree
        config.autoClose = 'outside';
    }

    ngOnInit() {
        this.getUsersState$ = this.store.select(selectUsersState);
        this.store.dispatch(new ContactGet({}));
        this.updateUsersStatus();
    }

    private updateUsersStatus(): void {
        this.getUsersState$.subscribe((state: UserState) => {
            this.userState = state;
            // TODO : display a loader or spinner when this.userState.inProgress is true
            // TODO : hide spinner when this.userState.inProgress is false
            // TODO : display an error message when this.userState.isError is true
        });
    }

    createNewContact() {
        if (this.newContactForm.invalid) {
            return false;
        }
        this.store.dispatch(new ContactAdd(this.newContactModel));
        this.destroySplitContactLayout();
    }

    initSplitContactLayout(): any {
        this.isLayoutSplitted = true;

        if (this.isLayoutSplitted === true) {
            window.document.documentElement.classList.add('no-scroll');
        }
    }

    destroySplitContactLayout(): any {
        this.isLayoutSplitted = false;

        if (this.isLayoutSplitted === false) {
            window.document.documentElement.classList.remove('no-scroll');
        }
        this.newContactForm.resetForm({});
    }

    // == Open change password NgbModal
    addUserContactModalOpen(addUserContent) {
        this.modalService.open(addUserContent, {centered: true, windowClass: 'modal-sm users-action-modal'});
    }
}
