import { Component, OnInit } from '@angular/core';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { AppState, MailBoxesState } from '../../../store/datatypes';
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateFolder } from '../../../store/actions';
import { FOLDER_COLRORS } from '../../../shared/config';

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
  folderColors: string[] = FOLDER_COLRORS;
  selectedColorIndex: number = 0;

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
      });
  }

  onSubmit() {
    if (!this.mailBoxesState.mailboxes[0].customFolders) {
      this.mailBoxesState.mailboxes[0].customFolders = [];
    }
    this.mailBoxesState.mailboxes[0].folders.push(this.customFolderForm.value.folderName);
    this.store.dispatch(new CreateFolder(this.mailBoxesState.mailboxes[0]));
  }

  onHide() {
    this.activeModal.close();
  }

  ngOnDestroy(): void {
  }

}
