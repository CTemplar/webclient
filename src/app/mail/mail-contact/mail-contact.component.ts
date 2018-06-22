import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserState } from '../../store/datatypes';
import { selectUsersState } from '../../store/selectors';
import { ContactGet } from '../../store';
// Store
import { Store } from '@ngrx/store';
import { NgbDropdownConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import 'rxjs/add/operator/takeUntil';

@TakeUntilDestroy()
@Component({
    selector: 'app-mail-contact',
    templateUrl: './mail-contact.component.html',
    styleUrls: ['./mail-contact.component.scss']
})
export class MailContactComponent implements OnInit, OnDestroy {

    isLayoutSplitted: boolean = false;
    public getUsersState$: Observable<any>;
    public userState: UserState;
    public isNewContact: boolean;
    readonly destroyed$: Observable<boolean>;

    constructor(private store: Store<UserState>,
                private modalService: NgbModal,
                config: NgbDropdownConfig) {
        // customize default values of dropdowns used by this component tree
        config.autoClose = 'outside';
    }

    ngOnInit() {
        this.getUsersState$ = this.store.select(selectUsersState);
        this.updateUsersStatus();
    }

    ngOnDestroy(): void {
    }

    private updateUsersStatus(): void {
        this.getUsersState$.takeUntil(this.destroyed$).subscribe((state: UserState) => {
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
