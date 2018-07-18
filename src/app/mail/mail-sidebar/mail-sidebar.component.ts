import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppState, MailBoxesState, Settings, UserState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-sidebar',
  templateUrl: './mail-sidebar.component.html',
  styleUrls: ['./mail-sidebar.component.scss']
})
export class MailSidebarComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  // Public property of boolean type set false by default
  public isComposeVisible: boolean = false;
  public settings: Settings;

  customFolders: string[];

  constructor(private modalService: NgbModal,
              private store: Store<AppState>,
              config: NgbDropdownConfig) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = 'outside';
  }

  ngOnInit() {
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.settings = user.settings;
      });

    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe( (mailboxes: MailBoxesState) => {
        this.customFolders = mailboxes.customFolders;
      });
  }

  // == Open NgbModal
  open(content) {
    this.modalService.open(content, { centered: true, windowClass: 'modal-sm' });
  }

  // == Show mail compose modal
  // == Setup click event to toggle mobile menu
  showMailComposeModal() { // click handler
    this.isComposeVisible = true;
  }

  ngOnDestroy(): void {
  }

}
