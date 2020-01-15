import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ContactAdd } from '../../../store';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState, Contact, ContactsState, UserState } from '../../../store/datatypes';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { getSaveContactShortcuts, OpenPgpService } from '../../../store/services';
import { ShortcutInput } from 'ng-keyboard-shortcuts';

@Component({
  selector: 'app-save-contact',
  templateUrl: './save-contact.component.html',
  styleUrls: ['./save-contact.component.scss', './../mail-contact.component.scss']
})
export class SaveContactComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() selectedContact: Contact;
  @Output() userSaved = new EventEmitter<boolean>();
  shortcuts: ShortcutInput[] = [];

  @ViewChild('newContactForm', { static: false }) newContactForm: NgForm;
  newContactModel: Contact = {
    name: '',
    email: '',
    address: '',
    note: '',
    phone: ''
  };
  public inProgress: boolean;
  private isContactsEncrypted: boolean;


  constructor(private store: Store<AppState>,
              private openpgp: OpenPgpService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.handleUserState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedContact'] && changes['selectedContact'].currentValue) {
      this.newContactModel = { ...this.selectedContact };
    }
  }

  ngAfterViewInit(): void {
    this.shortcuts = getSaveContactShortcuts(this);
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
  }

  private handleUserState(): void {
    this.store.select(state => state.user)
      .pipe(untilDestroyed(this)).subscribe((userState: UserState) => {
      this.isContactsEncrypted = userState.settings.is_contacts_encrypted;
    });

    this.store.select(state => state.contacts)
      .pipe(untilDestroyed(this)).subscribe((contactsState: ContactsState) => {
      if (this.inProgress && !contactsState.inProgress) {
        this.inProgress = false;
        if (!contactsState.isError) {
          this.userSaved.emit(true);
        }
      }
    });
  }

  createNewContact() {
    if (this.newContactForm.invalid) {
      return false;
    }
    if (this.isContactsEncrypted) {
      this.openpgp.encryptContact(this.newContactModel);
    } else {
      this.store.dispatch(new ContactAdd(this.newContactModel));
    }
    this.inProgress = true;
  }
}
