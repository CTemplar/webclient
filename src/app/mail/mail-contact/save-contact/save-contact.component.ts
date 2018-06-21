import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ContactAdd, ContactGet, selectUsersState } from '../../../store';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Contact, UserState } from '../../../store/datatypes';
import { stat } from 'fs';

@Component({
    selector: 'app-save-contact',
    templateUrl: './save-contact.component.html',
    styleUrls: ['./save-contact.component.scss', './../mail-contact.component.scss']
})
export class SaveContactComponent implements OnInit {
    @Output() userSaved = new EventEmitter<boolean>();

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
    private inProgress: boolean;


    constructor(private store: Store<UserState>) {
    }

    ngOnInit() {
        this.getUsersState$ = this.store.select(selectUsersState);
        this.store.dispatch(new ContactGet({}));
        this.handleUserState();
    }

    private handleUserState(): void {
        this.getUsersState$.subscribe((state: UserState) => {
            // TODO : display a loader or spinner when this.userState.inProgress is true
            // TODO : hide spinner when this.userState.inProgress is false
            // TODO : display an error message when this.userState.isError is true
            if (this.inProgress && !state.inProgress) {
                this.inProgress = false;
                if (!state.isError) {
                    this.userSaved.emit(true);
                }
            }
        });
    }

    createNewContact() {
        if (this.newContactForm.invalid) {
            return false;
        }
        this.store.dispatch(new ContactAdd(this.newContactModel));
        this.inProgress = true;
    }
}
