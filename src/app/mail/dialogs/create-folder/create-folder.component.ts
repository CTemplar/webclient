import { Component, OnInit } from '@angular/core';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { AppState, MailBoxesState } from '../../../store/datatypes';
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
  mailBoxesState: MailBoxesState;
  folderColors: string[] = FOLDER_COLORS;
  selectedColorIndex: number = 0;
  currentMailbox: Mailbox;

  constructor(private store: Store<AppState>,
              private fb: FormBuilder,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.customFolderForm = this.fb.group({
      folderName: ['', Validators.required],
      color: ''
    });

    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailboxes: MailBoxesState) => {
        if (this.mailBoxesState && this.mailBoxesState.inProgress && !mailboxes.inProgress) {
          this.activeModal.close();
        }
        this.mailBoxesState = mailboxes;
        this.currentMailbox = mailboxes.currentMailbox;
      });
  }

  onSubmit() {
    const customFolder: Folder = {
      name: this.customFolderForm.value.folderName,
      color: this.folderColors[this.selectedColorIndex],
      mailbox: this.currentMailbox.id
    };
    if (this.currentMailbox.customFolders
      .filter(folder => folder.name.toLowerCase() === customFolder.name.toLowerCase()).length > 0) {
      this.onHide();
      return;
    }
    this.store.dispatch(new CreateFolder(customFolder));
  }

  onHide() {
    this.activeModal.close();
  }

  ngOnDestroy(): void {
  }

}
