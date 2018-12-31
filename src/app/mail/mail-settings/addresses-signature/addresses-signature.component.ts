import { Component, OnInit } from '@angular/core';
import { PRIMARY_DOMAIN } from '../../../shared/config';
import { Mailbox } from '../../../store/models';
import { CreateMailbox, SetDefaultMailbox, SettingsUpdate, SnackErrorPush } from '../../../store/actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState, MailBoxesState, Settings, UserState } from '../../../store/datatypes';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { OpenPgpService, UsersService } from '../../../store/services';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { MailboxSettingsUpdate } from '../../../store/actions/mail.actions';

@TakeUntilDestroy()
@Component({
  selector: 'app-addresses-signature',
  templateUrl: './addresses-signature.component.html',
  styleUrls: ['./addresses-signature.component.scss', './../mail-settings.component.scss']
})
export class AddressesSignatureComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  public mailBoxesState: MailBoxesState;
  public mailboxes: Mailbox[];
  public currentMailBox: Mailbox;
  public userState: UserState;
  public selectedMailboxPublicKey: string;
  newAddressForm: FormGroup;
  newAddressOptions: any = {};
  selectedMailboxForSignature: Mailbox;
  selectedMailboxForKey: Mailbox;
  settings: Settings;
  customDomains: string[];

  constructor(private formBuilder: FormBuilder,
              private openPgpService: OpenPgpService,
              private usersService: UsersService,
              private store: Store<AppState>) { }

  ngOnInit() {

    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailboxesState: MailBoxesState) => {
        if (this.mailBoxesState && this.mailBoxesState.inProgress && !mailboxesState.inProgress && this.newAddressOptions.isBusy) {
          this.onDiscardNewAddress();
        }
        this.mailBoxesState = mailboxesState;
        this.mailboxes = mailboxesState.mailboxes;
        if (this.mailboxes.length > 0) {
          this.currentMailBox = mailboxesState.currentMailbox;
          if (!this.selectedMailboxForSignature || this.selectedMailboxForSignature.id === this.currentMailBox.id) {
            // update selected mailbox in case `currentMailbox` has been updated
            this.selectedMailboxForSignature = mailboxesState.currentMailbox;
          }
          if (!this.selectedMailboxForKey || this.selectedMailboxForKey.id === this.currentMailBox.id) {
            // update selected mailbox in case `currentMailbox` has been updated
            this.onSelectedMailboxForKeyChanged(mailboxesState.currentMailbox);
          }
        }
      });

    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.userState = user;
        this.settings = user.settings;
        this.customDomains = user.customDomains.filter((item) => item.is_domain_verified && item.is_mx_verified)
          .map((item) => item.domain);
        this.customDomains = [PRIMARY_DOMAIN, ...this.customDomains];
      });

    this.newAddressForm = this.formBuilder.group({
      'username': ['', [
        Validators.required,
        Validators.pattern(/^[a-z]+([a-z0-9]*[._-]?[a-z0-9]+)+$/i),
        Validators.minLength(2),
        Validators.maxLength(64)
      ]],
      'domain': [
        '',
        Validators.required
      ]
    });

    this.handleUsernameAvailability();
  }

  onAddNewAddress() {
    if (!this.newAddressOptions.isAddingNew) {
      this.newAddressForm.reset();
      this.newAddressForm.get('domain').setValue(PRIMARY_DOMAIN);
      this.newAddressOptions = {
        isAddingNew: true
      };
    }
  }

  onDiscardNewAddress() {
    this.newAddressForm.reset();
    this.newAddressOptions = {
      isAddingNew: false
    };
  }

  submitNewAddress() {
    this.newAddressOptions.isSubmitted = true;
    if (this.newAddressForm.valid && !this.newAddressOptions.usernameExists && this.newAddressForm.controls['username'].value) {
      this.newAddressOptions.isBusy = true;
      this.openPgpService.generateUserKeys(this.userState.username, atob(this.usersService.getUserKey()));
      if (this.openPgpService.getUserKeys()) {
        this.addNewAddress();
      } else {
        this.openPgpService.waitForPGPKeys(this, 'addNewAddress');
      }
    }
  }

  addNewAddress() {
    const requestData = {
      email: this.getEmail(),
      ...this.openPgpService.getUserKeys()
    };
    this.store.dispatch(new CreateMailbox(requestData));
  }

  updateDefaultEmailAddress(selectedMailbox: Mailbox) {
    this.store.dispatch(new SetDefaultMailbox(selectedMailbox));
  }

  onSelectedMailboxForKeyChanged(mailbox: Mailbox) {
    this.selectedMailboxForKey = mailbox;
    this.selectedMailboxPublicKey = `data:application/octet-stream;charset=utf-8;base64,${btoa(this.selectedMailboxForKey.public_key)}`;
  }

  updateMailboxSettings(selectedMailbox: Mailbox, key: string, value: any) {
    if (selectedMailbox[key] !== value) {
      selectedMailbox[key] = value;
      this.store.dispatch(new MailboxSettingsUpdate(selectedMailbox));
    }
  }

  private getEmail() {
    return this.newAddressForm.controls['username'].value +
      (this.newAddressForm.controls['domain'].value === PRIMARY_DOMAIN ? '' : '@' + this.newAddressForm.controls['domain'].value);
  }


  private handleUsernameAvailability() {
    this.newAddressForm.get('username').valueChanges
      .pipe(
        debounceTime(500),
        takeUntil(this.destroyed$)
      )
      .subscribe((username) => {
        if (!username) {
          return;
        }
        if (!this.newAddressForm.controls['username'].errors) {
          this.newAddressOptions.isBusy = true;
          this.usersService.checkUsernameAvailability(this.getEmail())
            .subscribe(response => {
                this.newAddressOptions.usernameExists = response.exists;
                this.newAddressOptions.isBusy = false;
              },
              error => {
                this.store.dispatch(new SnackErrorPush({ message: 'Failed to check username availability.' }));
                this.newAddressOptions.isBusy = false;
              });
        }
      });
  }

  updateSettings(key?: string, value?: any) {
    if (key) {
      if (this.settings[key] !== value) {
        this.settings[key] = value;
        this.store.dispatch(new SettingsUpdate(this.settings));
      }
    } else {
      this.store.dispatch(new SettingsUpdate(this.settings));
    }
  }

  ngOnDestroy(): void {
  }

}
