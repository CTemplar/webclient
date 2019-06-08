import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ContactAdd } from '../../../store';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, Contact, UserState } from '../../../store/datatypes';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-save-contact',
  templateUrl: './save-contact.component.html',
  styleUrls: ['./save-contact.component.scss', './../mail-contact.component.scss']
})
export class SaveContactComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selectedContact: Contact;
  @Output() userSaved = new EventEmitter<boolean>();

  @ViewChild('newContactForm', { static: false }) newContactForm: NgForm;
  newContactModel: Contact = {
    name: '',
    email: '',
    address: '',
    note: '',
    phone: ''
  };
  public inProgress: boolean;


  constructor(private store: Store<AppState>) {
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
      .pipe(untilDestroyed(this)).subscribe((state: UserState) => {
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
