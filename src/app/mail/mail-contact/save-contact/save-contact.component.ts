import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ContactAdd } from '../../../store';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, Contact, UserState } from '../../../store/datatypes';
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


  constructor(private store: Store<AppState>,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.handleUserState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedContact'] && changes['selectedContact'].currentValue) {
      this.newContactModel = { ...this.selectedContact };
    }
  }

  ngOnDestroy(): void {
  }

  private handleUserState(): void {
    this.store.select(state => state.user)
      .takeUntil(this.destroyed$).subscribe((state: UserState) => {
      if (this.inProgress && !state.inProgress) {
        this.inProgress = false;
        if (!state.isError) {
          this.notificationService.showSnackBar(`Contact ${this.newContactModel.id ? 'updated' : 'saved'} successfully.`);
          this.userSaved.emit(true);
        } else {
          this.notificationService.showSnackBar(`Failed to ${this.newContactModel.id ? 'update' : 'save'} contact.`);
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
