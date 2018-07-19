import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AppState, MailBoxesState, Settings, UserState } from '../../store/datatypes';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateFolder } from '../../store/actions';

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

  mailBoxesState: MailBoxesState;
  customFolderForm: FormGroup;

  constructor(private modalService: NgbModal,
              private store: Store<AppState>,
              private fb: FormBuilder,
              config: NgbDropdownConfig
  ) {
    // customize default values of dropdowns used by this component tree
    config.autoClose = 'outside';
  }

  ngOnInit() {
    this.customFolderForm = this.fb.group({
      folderName: ['', Validators.required ],
      color: ''
    });

    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.settings = user.settings;
      });

    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe( (mailboxes: MailBoxesState) => {
        this.mailBoxesState = mailboxes;
      });
  }

  // == Open NgbModal
  open(content) {
    this.modalService.open(content, { centered: true, windowClass: 'modal-sm' });
  }

  onSubmit() {
    this.mailBoxesState.mailboxes[0].folders.push(this.customFolderForm.value.folderName);
    this.store.dispatch(new CreateFolder(this.mailBoxesState.mailboxes[0]));
  }
  // == Show mail compose modal
  // == Setup click event to toggle mobile menu
  showMailComposeModal() { // click handler
    this.isComposeVisible = true;
  }

  ngOnDestroy(): void {
  }

}
