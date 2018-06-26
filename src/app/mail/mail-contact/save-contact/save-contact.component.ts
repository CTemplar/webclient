import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ContactAdd, ContactGet, selectUsersState } from '../../../store';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Contact, UserState } from '../../../store/datatypes';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { NotificationService } from '../../../store/services/notification.service';

@TakeUntilDestroy()
@Component({
    selector: 'app-save-contact',
    templateUrl: './save-contact.component.html',
    styleUrls: ['./save-contact.component.scss', './../mail-contact.component.scss']
})
export class SaveContactComponent implements OnInit, OnDestroy, OnChanges {
    @Input() selectedContact: Contact;
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
    public inProgress: boolean;

    readonly destroyed$: Observable<boolean>;


    constructor(private store: Store<UserState>,
                private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.getUsersState$ = this.store.select(selectUsersState);
        this.handleUserState();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['selectedContact'] && changes['selectedContact'].currentValue) {
            this.newContactModel = {...this.selectedContact};
        }
    }

    ngOnDestroy(): void {
    }

    private handleUserState(): void {
        this.getUsersState$.takeUntil(this.destroyed$).subscribe((state: UserState) => {
            if (this.inProgress && !state.inProgress) {
                this.inProgress = false;
                if (!state.isError) {
                    this.notificationService.showSuccess(`Contact ${this.newContactModel.id ? 'updated' : 'saved'} successfully.`);
                    this.userSaved.emit(true);
                } else {
                    this.notificationService.showError(`Failed to ${this.newContactModel.id ? 'update' : 'save'} contact.`);
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
