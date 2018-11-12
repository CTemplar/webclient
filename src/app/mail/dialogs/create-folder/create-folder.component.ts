import { Component, OnInit } from '@angular/core';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { AppState, MailBoxesState, UserState } from '../../../store/datatypes';
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateFolder } from '../../../store/actions';
import { FOLDER_COLORS } from '../../../shared/config';
import { Folder, Mailbox } from '../../../store/models';

@TakeUntilDestroy()
@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.scss']
})
export class CreateFolderComponent implements OnInit, OnDestroy {

  readonly destroyed$: Observable<boolean>;

  customFolderForm: FormGroup;
  folderColors: string[] = FOLDER_COLORS;
  selectedColorIndex: number = 0;
  currentMailbox: Mailbox;
  userState: UserState;
  submitted: boolean;
  duplicateFoldername: boolean;

  constructor(private store: Store<AppState>,
              private fb: FormBuilder,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.customFolderForm = this.fb.group({
      folderName: ['',
        [
          Validators.required,
          Validators.pattern(/^[a-z]+[a-z0-9. _-]+$/i),
          Validators.minLength(4),
          Validators.maxLength(30),
        ]
      ],
      color: ''
    });

    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailboxes: MailBoxesState) => {
        this.currentMailbox = mailboxes.currentMailbox;
      });
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        if (this.userState && this.userState.inProgress && !user.inProgress) {
          this.activeModal.close();
        }
        this.userState = user;
      });
    this.customFolderForm.get('folderName').valueChanges.takeUntil(this.destroyed$)
      .subscribe((value) => {
        this.checkFolderExist(value);
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.customFolderForm.invalid) {
      return;
    }
    const customFolder: Folder = {
      name: this.customFolderForm.value.folderName,
      color: this.folderColors[this.selectedColorIndex],
      mailbox: this.currentMailbox.id
    };
    if (this.checkFolderExist(customFolder.name)) {
      return;
    }

    this.store.dispatch(new CreateFolder(customFolder));
  }

  checkFolderExist(folderName: string) {
    if (this.userState.customFolders
      .filter(folder => folder.name.toLowerCase() === folderName.toLowerCase()).length > 0) {
      this.duplicateFoldername = true;
      return true;
    }
    this.duplicateFoldername = false;
    return false;
  }

  onHide() {
    this.activeModal.close();
  }

  ngOnDestroy(): void {
  }

}
