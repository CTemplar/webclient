import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PRIMARY_DOMAIN } from '../../../shared/config';
import { Mailbox } from '../../../store/models';
import { CreateMailbox, DeleteMailbox, SetDefaultMailbox, SnackErrorPush, UpdateMailboxOrder } from '../../../store/actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState, MailBoxesState, Settings, UserState } from '../../../store/datatypes';
import { Store } from '@ngrx/store';
import { OpenPgpService, SharedService, UsersService } from '../../../store/services';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MailboxSettingsUpdate } from '../../../store/actions/mail.actions';
import { MailSettingsService } from '../../../store/services/mail-settings.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-addresses-signature',
  templateUrl: './addresses-signature.component.html',
  styleUrls: ['./../mail-settings.component.scss', './addresses-signature.component.scss']
})
export class AddressesSignatureComponent implements OnInit, OnDestroy {
  @ViewChild('deleteAliasModal', { static: false }) deleteAliasModal;
  public mailBoxesState: MailBoxesState;
  public mailboxes: Mailbox[];
  public unmodifiedMailboxes: Mailbox[];
  public currentMailBox: Mailbox;
  public userState: UserState;
  public selectedMailboxPublicKey: string;
  newAddressForm: FormGroup;
  newAddressOptions: any = {};
  selectedMailboxForSignature: Mailbox;
  selectedMailboxForKey: Mailbox;
  settings: Settings;
  customDomains: string[];
  reorder: boolean;
  reorderInProgress: boolean = false;
  mailboxToDelete: Mailbox;
  signatureChanged: Subject<string> = new Subject<string>();

  constructor(private formBuilder: FormBuilder,
              private openPgpService: OpenPgpService,
              private usersService: UsersService,
              private settingsService: MailSettingsService,
              private modalService: NgbModal,
              private store: Store<AppState>) { }

  ngOnInit() {

    this.store.select(state => state.mailboxes).pipe(untilDestroyed(this))
      .subscribe((mailboxesState: MailBoxesState) => {
        if (mailboxesState.isUpdatingOrder) {
          this.reorderInProgress = true;
          return;
        }
        if (this.reorderInProgress) {
          this.reorderInProgress = false;
          this.reorder = false;
        }

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

    this.store.select(state => state.user).pipe(untilDestroyed(this))
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

    this.signatureChanged.pipe(debounceTime(3000), distinctUntilChanged())
      .subscribe(value => {
        this.updateMailboxSettings(this.selectedMailboxForSignature, 'signature', value);
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
    if (this.newAddressForm.valid && this.newAddressOptions.usernameExists === false && this.newAddressForm.controls['username'].value) {
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

  onSignatureChange(value) {
    this.signatureChanged.next(value);
  }

  signatureFocused(value) {
    SharedService.isQuillEditorOpen = value;
  }

  updateMailboxSettings(selectedMailbox: Mailbox, key: string, value: any) {
    if (selectedMailbox[key] !== value) {
      selectedMailbox.inProgress = true;
      this.store.dispatch(new MailboxSettingsUpdate({ ...selectedMailbox, [key]: value }));
    }
  }

  showConfirmDeleteMailboxModal(mailbox: Mailbox) {
    this.mailboxToDelete = mailbox;
    this.modalService.open(this.deleteAliasModal, { centered: true, windowClass: 'modal-sm users-action-modal', backdrop: 'static' });
  }

  deleteMailboxConfirmed() {
    this.store.dispatch(new DeleteMailbox(this.mailboxToDelete));
    this.mailboxes = this.mailboxes.filter(mailbox => mailbox.id !== this.mailboxToDelete.id);
  }

  sortDown(index: number) {
    const sortOrder = this.mailboxes[index].sort_order;
    this.mailboxes[index].sort_order = this.mailboxes[index + 1].sort_order;
    this.mailboxes[index + 1].sort_order = sortOrder;
    this.mailboxes.sort((a, b) => {
      return a.sort_order - b.sort_order;
    });
  }

  sortUp(index: number) {
    const sortOrder = this.mailboxes[index].sort_order;
    this.mailboxes[index].sort_order = this.mailboxes[index - 1].sort_order;
    this.mailboxes[index - 1].sort_order = sortOrder;
    this.mailboxes.sort((a, b) => {
      return a.sort_order - b.sort_order;
    });
  }

  startReorder() {
    this.reorder = true;
    this.unmodifiedMailboxes = this.mailboxes.map(x => Object.assign({}, x));
    this.mailboxes = this.mailboxes.sort((a, b) => {
      return a.sort_order - b.sort_order;
    }).map((item, index) => {
      item.sort_order = index + 1;
      return item;
    });
  }

  saveOrder() {
    this.reorderInProgress = true;
    const payload: any = {
      mailboxes: this.mailboxes,
      data: {
        mailbox_list: this.mailboxes.map(item => {
          return { mailbox_id: item.id, sort_order: item.sort_order };
        }),
      }
    };
    this.store.dispatch(new UpdateMailboxOrder(payload));
  }

  cancelOrder() {
    this.reorder = false;
    this.mailboxes = this.unmodifiedMailboxes;
  }

  private getEmail() {
    return this.newAddressForm.controls['username'].value +
      (this.newAddressForm.controls['domain'].value === PRIMARY_DOMAIN ? '' : '@' + this.newAddressForm.controls['domain'].value);
  }


  private handleUsernameAvailability() {
    this.newAddressForm.get('username').valueChanges
      .pipe(
        debounceTime(500),
        untilDestroyed(this)
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
                this.store.dispatch(new SnackErrorPush({ message: `Failed to check username availability. ${error.error}` }));
                this.newAddressOptions.isBusy = false;
                this.newAddressOptions.usernameExists = null;
              });
        }
      });
  }

  updateSettings(key?: string, value?: any) {
    this.settingsService.updateSettings(this.settings, key, value);
  }

  ngOnDestroy(): void {
    SharedService.isQuillEditorOpen = false;
  }

}
