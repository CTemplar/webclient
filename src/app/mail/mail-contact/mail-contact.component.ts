import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserState } from '../../store/datatypes';
import { selectUsersState } from '../../store/selectors';
import { Contact } from '../../store';
// Store
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Action
import {ContactAdd} from '../../store/actions';
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
  public addContactForm: FormGroup;
  constructor(private store: Store<UserState>, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.getUsersState$ = this.store.select(selectUsersState);
    this.addContactForm = this.formBuilder.group({
      contactName: ['', [Validators.required]],
      contactEmail: ['', [Validators.email]],
      contactPhone1: [''],
      contactPhone2: [''],
      contactAddress: [''],
      contactNote: ['']
    });
    this.store.dispatch(new Contact({}));
    this.updateUsersStatus();
  }

  initSplitContactLayout(): any {
    this.isLayoutSplitted = true;
  }

  destroySplitContactLayout(): any {
    this.isLayoutSplitted = false;
  }

  private updateUsersStatus(): void {
    this.getUsersState$.subscribe((state: UserState) => {
      this.userState = state;
    });
  }

  addContact(contact) {
    console.log(contact);
    this.store.dispatch(new ContactAdd({contact}));
  }
}
