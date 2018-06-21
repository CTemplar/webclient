import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ContactAdd, ContactGet, selectUsersState } from '../../../store';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Contact, UserState } from '../../../store/datatypes';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';

@TakeUntilDestroy()
@Component({
    selector: 'app-save-contact',
    templateUrl: './save-contact.component.html',
    styleUrls: ['./save-contact.component.scss', './../mail-contact.component.scss']
})
export class SaveContactComponent implements OnInit, OnDestroy {
    @Output() userSaved = new EventEmitter<boolean>();

    public getUsersState$: Observable<any>;
    @ViewChild('newContactForm') newContactForm: NgForm;
    newContactModel: Contact = {
        name: '',
        email: '',
        address: '',
        note: '',
        phone: ''
    };
    private inProgress: boolean;

    readonly destroyed$: Observable<boolean>;


    constructor(private store: Store<UserState>) {
    }

    ngOnInit() {
        this.getUsersState$ = this.store.select(selectUsersState);
        this.store.dispatch(new ContactGet({}));
        this.handleUserState();
    }

    ngOnDestroy(): void {
    }

    private handleUserState(): void {
        this.getUsersState$.takeUntil(this.destroyed$).subscribe((state: UserState) => {
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
