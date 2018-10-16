import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';
import { CreateFilter, DeleteFilter, UpdateFilter } from '../../../store/actions';
import { AppState, UserState } from '../../../store/datatypes';
import { Folder, MailFolderType } from '../../../store/models';
import { Filter, FilterCondition, FilterParameter } from '../../../store/models/filter.model';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-filters',
  templateUrl: './mail-filters.component.html',
  styleUrls: ['../mail-settings.component.scss']
})
export class MailFiltersComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  readonly folderIcons: any = {
    [MailFolderType.INBOX]: 'icon-inbox',
    [MailFolderType.ARCHIVE]: 'icon-archive',
    [MailFolderType.TRASH]: 'icon-garbage',
    [MailFolderType.SPAM]: 'icon-warning'
  };

  @ViewChild('customFilterModal') customFilterModal;
  @ViewChild('deleteFilterModal') deleteFilterModal;

  mailFolderType = MailFolderType;
  filterCondition = FilterCondition;
  filterParameter = FilterParameter;
  filters: Filter[];
  userState: UserState;
  customFolders: Folder[];
  createFilterForm: FormGroup;
  createFilterData: any;
  errorMessage: string;
  selectedFilter: Filter;

  private customFilterModalRef: NgbModalRef;
  private deleteFilterModalRef: NgbModalRef;

  constructor(private store: Store<AppState>,
              private formBuilder: FormBuilder,
              private modalService: NgbModal) {
  }

  ngOnInit() {
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((userState: UserState) => {
        this.filters = userState.filters;
        this.customFolders = userState.customFolders;
        this.userState = userState;
      });
    this.createFilterForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      filterText: [''],
      moveTo: [false],
      markAsRead: [false],
      markAsStarred: [false]
    });
  }

  ngOnDestroy(): void {
  }

  openCustomFilterModal(selectedFilter?: Filter) {
    this.errorMessage = null;
    this.createFilterForm.reset();
    if (selectedFilter) {
      this.createFilterData = { ...selectedFilter };
      this.createFilterForm.get('name').setValue(selectedFilter.name);
      this.createFilterForm.get('filterText').setValue(selectedFilter.filter_text);
      this.createFilterForm.get('moveTo').setValue(selectedFilter.move_to);
      this.createFilterForm.get('markAsRead').setValue(selectedFilter.mark_as_read);
      this.createFilterForm.get('markAsStarred').setValue(selectedFilter.mark_as_starred);
    } else {
      this.createFilterData = {};
    }
    this.customFilterModalRef = this.modalService.open(this.customFilterModal, {
      centered: true,
      windowClass: 'modal-sm'
    });
  }

  onSubmit() {
    if (this.createFilterForm.valid) {
      const data = {
        ...this.createFilterData,
        name: this.createFilterForm.get('name').value,
        filter_text: this.createFilterForm.get('filterText').value,
        move_to: this.createFilterForm.get('moveTo').value || false,
        mark_as_read: this.createFilterForm.get('markAsRead').value || false,
        mark_as_starred: this.createFilterForm.get('markAsStarred').value || false
      };
      if (data.id) {
        this.store.dispatch(new UpdateFilter(data));
      } else {
        this.store.dispatch(new CreateFilter(data));
      }
      this.customFilterModalRef.dismiss();
    }
  }

  confirmDeleteFilter(filter: Filter) {
    this.selectedFilter = filter;
    this.deleteFilterModalRef = this.modalService.open(this.deleteFilterModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
  }

  deleteFilter() {
    if (this.selectedFilter) {
      this.store.dispatch(new DeleteFilter(this.selectedFilter));
      this.deleteFilterModalRef.dismiss();
    }
  }

}
