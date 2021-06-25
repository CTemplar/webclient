import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { Folder } from '../../../store/models';
import { AppState, Contact, ContactsState, UserState } from '../../../store/datatypes';
import { EmailFormatPipe } from '../../pipes/email-formatting.pipe';

@UntilDestroy()
@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit {
  startDate = '';

  endDate = '';

  SEARCH_SIZE = {
    GTE: 'Greater than',
    LTE: 'Less than',
    EQUALS: 'Equal',
  };

  size = 'GTE';

  SEARCH_SIZE_UNIT = {
    MB: 'MB',
    KB: 'KB',
    BYTES: 'Bytes',
  };

  sizeUnit = 'MB';

  MailFolderTypeName = {
    ALL_EMAILS: 'All emails',
    UNREAD: 'All unread emails',
    INBOX: 'Inbox',
    SENT: 'Sent',
    DRAFT: 'Draft',
    STARRED: 'Starred',
    ARCHIVE: 'Archive',
    SPAM: 'Spam',
    TRASH: 'Trash',
    OUTBOX: 'Outbox',
  };

  folder = 'ALL_EMAILS';

  customFolders: Folder[] = [];

  fromSearch: string[] = [];

  toSearch: string[] = [];

  contacts: Contact[] = [];

  hasAttachment = false;

  sameExactly = false;

  get getValueFromFolderName(): string {
    // @ts-ignore
    const predefinedFolderName = this.MailFolderTypeName[this.folder];
    if (predefinedFolderName) {
      return predefinedFolderName;
    }
    const selectedCustomFolder = this.customFolders.find(folder => this.folder === folder.name);
    return selectedCustomFolder ? selectedCustomFolder.name : '';
  }

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    /**
     * Set state variables from user's settings.
     */
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.customFolders = user.customFolders;
      });

    /**
     * Get user's contacts from store.
     */
    this.store
      .select((state: AppState) => state.contacts)
      .pipe(untilDestroyed(this))
      .subscribe((contactsState: ContactsState) => {
        this.contacts = [];
        if (contactsState.emailContacts === undefined) {
          for (const x of contactsState.contacts) {
            this.contacts.push({
              name: x.name,
              email: x.email,
              display: EmailFormatPipe.transformToFormattedEmail(x.email, x.name),
            });
          }
        } else {
          for (const x of contactsState.emailContacts) {
            this.contacts.push({
              name: x.name,
              email: x.email,
              display: EmailFormatPipe.transformToFormattedEmail(x.email, x.name),
            });
          }
        }
      });
  }

  onChangeSize($event: any, size: string) {
    $event.preventDefault();
    this.size = size;
  }

  onChangeSizeUnit($event: any, sizeUnit: string) {
    $event.preventDefault();
    this.sizeUnit = sizeUnit;
  }

  onChangeFolder($event: any, folder: string) {
    $event.preventDefault();
    this.folder = folder;
  }

  onAddFromTo($event: any, isFrom: boolean) {
    console.log('on add from', $event);
  }

  onRemoveFromTo(isFrom: boolean) {
    console.log('on remove from');
  }

  handlePasteFromTo($event: any, isFrom: boolean) {
    console.log('handle paste from to', $event);
  }
}
