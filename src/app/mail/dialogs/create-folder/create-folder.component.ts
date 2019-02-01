import { Component, Input, OnInit } from '@angular/core';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { AppState, UserState } from '../../../store/datatypes';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateFolder } from '../../../store/actions';
import { FOLDER_COLORS } from '../../../shared/config';
import { Folder } from '../../../store/models';
import { takeUntil } from 'rxjs/operators';

@TakeUntilDestroy()
@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.scss']
})
export class CreateFolderComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  @Input() folder: Folder = { id: null, name: '', color: '' };

  customFolderForm: FormGroup;
  folderColors: string[] = FOLDER_COLORS;
  selectedColorIndex: number = 0;
  userState: UserState;
  submitted: boolean;
  duplicateFoldername: boolean;

  constructor(private store: Store<AppState>,
              private fb: FormBuilder,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.customFolderForm = this.fb.group({
      folderName: [this.folder.name,
        [
          Validators.required,
          Validators.pattern(/^[a-z]+[a-z0-9. _-]+$/i),
          Validators.minLength(4),
          Validators.maxLength(30),
        ]
      ],
      color: this.folder.color
    });
    if (this.folder.color) {
      this.selectedColorIndex = this.folderColors.indexOf(this.folder.color);
    }
    this.store.select(state => state.user).pipe(takeUntil(this.destroyed$))
      .subscribe((user: UserState) => {
        if (this.userState && this.userState.inProgress && !user.inProgress) {
          this.activeModal.close();
        }
        this.userState = user;
      });
    this.customFolderForm.get('folderName').valueChanges.pipe(takeUntil(this.destroyed$))
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
      id: this.folder.id,
      name: this.customFolderForm.value.folderName,
      color: this.folderColors[this.selectedColorIndex]
    };
    if (this.checkFolderExist(customFolder.name)) {
      return;
    }

    this.store.dispatch(new CreateFolder(customFolder));
  }

  checkFolderExist(folderName: string) {
    if (this.userState.customFolders
      .filter(folder => folder.name.toLowerCase() === folderName.toLowerCase() && folder.id !== this.folder.id).length > 0) {
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
