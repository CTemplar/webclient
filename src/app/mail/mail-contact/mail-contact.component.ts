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
    public isNewContact: boolean;


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
        });
    }

    initSplitContactLayout(): any {
        this.isLayoutSplitted = true;

        if (this.isLayoutSplitted === true) {
            window.document.documentElement.classList.add('no-scroll');
        }
        this.isNewContact = true;
    }

    destroySplitContactLayout(): any {
        this.isLayoutSplitted = false;

        if (this.isLayoutSplitted === false) {
            window.document.documentElement.classList.remove('no-scroll');
        }
        this.isNewContact = false;
    }

    // == Open change password NgbModal
    addUserContactModalOpen(addUserContent) {
        this.isNewContact = true;
        this.modalService.open(
            addUserContent,
            {
                centered: true,
                windowClass: 'modal-sm users-action-modal',
                beforeDismiss: () => {
                    this.isNewContact = false;
                    return true;
                },
            });
    }
}
