import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Folder, Mail, Mailbox, MailFolderType } from '../../../store/models';
import {
  AppState,
  Contact,
  ContactsState,
  MailBoxesState,
  NumberBooleanMappedType,
  Settings,
  StringBooleanMappedType,
  UserState,
} from '../../../store/datatypes';

@UntilDestroy()
@Component({
  selector: 'app-mail-detail-header',
  templateUrl: './mail-detail-header.component.html',
  styleUrls: ['./mail-detail-header.component.scss'],
})
export class MailDetailHeaderComponent implements OnInit {
  @Input() mail: Mail;

  @Input() isParentHeader: boolean;

  @Input() decryptedContents: string;

  @Input() isShowTrashRelatedChildren: boolean;

  @Input() mailFolder: MailFolderType;

  @Input() isDecryptingError: boolean;

  /**
   * Represents if mail is expanded or not
   * If mail's folder is Draft, then would represent Composer is opened or not
   */
  @Input() mailExpandedStatus: boolean;

  @Output() onToggleStarred = new EventEmitter();

  @Output() onClick = new EventEmitter();

  settings: Settings;

  currentMailbox: Mailbox;

  mailboxes: Mailbox[] = [];

  userState: UserState;

  contacts: Contact[] = [];

  customFolders: Folder[] = [];

  mailFolderTypes = MailFolderType;

  folderColors: any = {};

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    /**
     * Get user settings
     */
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.customFolders = user.customFolders;
        user.customFolders.forEach(folder => {
          this.folderColors[folder.name] = folder.color;
        });
        this.userState = user;
        this.settings = this.userState.settings;
      });

    this.store
      .select(state => state.mailboxes)
      .pipe(untilDestroyed(this))
      .subscribe((mailBoxesState: MailBoxesState) => {
        this.currentMailbox = mailBoxesState.currentMailbox;
        this.mailboxes = mailBoxesState.mailboxes;
      });

    /**
     * Get user's contacts from store.
     */
    this.store
      .select((state: AppState) => state.contacts)
      .pipe(untilDestroyed(this))
      .subscribe((contactsState: ContactsState) => {
        this.contacts =
          contactsState.emailContacts === undefined ? contactsState.contacts : contactsState.emailContacts;
      });
  }

  onClickHeader() {
    this.onClick.emit();
  }

  onToggleStar($event: any) {
    $event.stopPropagation();
    $event.preventDefault();
    this.onToggleStarred.emit();
  }
}
