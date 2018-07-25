import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppState, MailBoxesState, Settings, UserState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { CreateFolderComponent } from '../dialogs/create-folder/create-folder.component';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-sidebar',
  templateUrl: './mail-sidebar.component.html',
  styleUrls: ['./mail-sidebar.component.scss']
})
export class MailSidebarComponent implements OnInit, OnDestroy {

  LIMIT = 2;

  readonly destroyed$: Observable<boolean>;

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;
  public settings: Settings;

  mailBoxesState: MailBoxesState;

  constructor(private store: Store<AppState>,
              private modalService: NgbModal,
              config: NgbDropdownConfig
  ) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = 'outside';
  }

  ngOnInit() {
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.settings = user.settings;
      });

    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailboxes: MailBoxesState) => {
        this.mailBoxesState = mailboxes;
      });
  }

  // == Open NgbModal
  open() {
    this.modalService.open(CreateFolderComponent, { centered: true, windowClass: 'modal-sm mailbox-modal' });
  }


  // == Show mail compose modal
  // == Setup click event to toggle mobile menu
  showMailComposeModal() { // click handler
    this.isComposeVisible = true;
  }

  toggleDisplayLimit(totalItems) {
    if (this.LIMIT === totalItems) {
      this.LIMIT = 2;
    } else {
      this.LIMIT = totalItems;
    }
  }

  ngOnDestroy(): void {
  }

}
