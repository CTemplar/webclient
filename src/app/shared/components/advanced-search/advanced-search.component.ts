import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { Folder, MailFolderType } from '../../../store/models';
import { AppState, Contact, ContactsState, UserState } from '../../../store/datatypes';
import { EmailFormatPipe } from '../../pipes/email-formatting.pipe';

@UntilDestroy()
@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent implements OnInit, OnChanges {
  @Input() searchInput = '';

  @Output() close = new EventEmitter<string>();

  query = '';

  size = '';

  startDate = '';

  endDate = '';

  SEARCH_SIZE = {
    GTE: 'Greater than',
    LTE: 'Less than',
    EQUALS: 'Equal',
  };

  sizeOperator = 'GTE';

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

  fromSearch: any[] = [];

  toSearch: any[] = [];

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

  constructor(private store: Store<AppState>, private router: Router) {}

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

  ngOnChanges(): void {
    this.query = this.searchInput;
  }

  onChangeSize($event: any, size: string) {
    $event.preventDefault();
    this.sizeOperator = size;
  }

  onChangeSizeUnit($event: any, sizeUnit: string) {
    $event.preventDefault();
    this.sizeUnit = sizeUnit;
  }

  onChangeFolder($event: any, folder: string) {
    $event.preventDefault();
    this.folder = folder;
  }

  search() {
    let queryParameters = {};
    if (this.query) {
      queryParameters = { q: this.query };
      if (this.sameExactly) {
        queryParameters = {
          ...queryParameters,
          exact: true,
        };
      }
    }
    if (this.fromSearch?.length > 0) {
      queryParameters = {
        ...queryParameters,
        sender: this.fromSearch.map(from => from.value).join(','),
      };
    }
    if (this.toSearch?.length > 0) {
      queryParameters = {
        ...queryParameters,
        receiver: this.toSearch.map(to => to.value).join(','),
      };
    }
    if (this.size && Number.parseFloat(this.size)) {
      let sizeByByte: number;
      if (this.sizeUnit === this.SEARCH_SIZE_UNIT.MB) {
        sizeByByte = Number.parseFloat(this.size) * 1_000_000;
      } else if (this.sizeUnit === this.SEARCH_SIZE_UNIT.KB) {
        sizeByByte = Number.parseFloat(this.size) * 1000;
      } else {
        sizeByByte = Number.parseFloat(this.size);
      }
      queryParameters = {
        ...queryParameters,
        size: sizeByByte,
        size_operator: this.sizeOperator,
      };
    }
    if (this.hasAttachment) {
      queryParameters = {
        ...queryParameters,
        have_attachment: this.hasAttachment,
      };
    }
    if (this.folder) {
      const folderName = (<any>MailFolderType)[this.folder];
      queryParameters = {
        ...queryParameters,
        folder: folderName,
      };
    }
    if (queryParameters && queryParameters !== {}) {
      this.router.navigate(['/mail/search/page', 1], { queryParams: { search: true, ...queryParameters } });
      this.close.emit(this.query);
    }
    // if (this.searchInput.value) {
    //   if (this.isContactsPage) {
    //     this.router.navigate(['/mail/contacts'], { queryParams: { search: this.searchInput.value } });
    //   } else {
    //     this.router.navigate(['/mail/search/page', 1], { queryParams: { search: this.searchInput.value } });
    //   }
    // }
  }
}
