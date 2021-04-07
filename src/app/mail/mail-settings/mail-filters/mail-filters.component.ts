import { Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { CreateFilter, DeleteFilter, UpdateFilter, UpdateFilterOrder } from '../../../store/actions';
import { AppState, UserState } from '../../../store/datatypes';
import { Folder, MailFolderType } from '../../../store/models';
import { Filter, FilterCondition, FilterParameter } from '../../../store/models/filter.model';

@UntilDestroy()
@Component({
  selector: 'app-mail-filters',
  templateUrl: './mail-filters.component.html',
  styleUrls: ['../mail-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MailFiltersComponent implements OnInit {
  readonly folderIcons: any = {
    [MailFolderType.INBOX]: 'icon-inbox',
    [MailFolderType.ARCHIVE]: 'icon-archive',
    [MailFolderType.TRASH]: 'icon-garbage',
    [MailFolderType.SPAM]: 'icon-warning',
  };

  @ViewChild('customFilterModal') customFilterModal: any;

  @ViewChild('deleteFilterModal') deleteFilterModal: any;

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

  hasDuplicateFilterName: boolean;

  private customFilterModalRef: NgbModalRef;

  private deleteFilterModalRef: NgbModalRef;

  inSetPriority = false;

  private unmodifiedFilters: Array<Filter>;

  inProgress = false;

  constructor(private store: Store<AppState>, private formBuilder: FormBuilder, private modalService: NgbModal) {}

  ngOnInit() {
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((userState: UserState) => {
        this.filters = userState.filters;
        this.customFolders = userState.customFolders;
        if (
          this.userState &&
          this.userState.inProgress &&
          this.customFilterModalRef &&
          !userState.inProgress &&
          !userState.filtersError
        ) {
          this.customFilterModalRef.dismiss();
        }
        this.errorMessage = userState.filtersError;
        this.userState = userState;
        this.inProgress = this.userState.inProgress;
      });

    this.createFilterForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(64)]],
      filterText: [''],
      moveTo: [false],
      markAsRead: [false],
      markAsStarred: [false],
    });

    this.createFilterForm
      .get('name')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value: string) => {
        this.checkFilterExist(value);
      });

    this.createFilterForm
      .get('moveTo')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe(value => {
        if (!value && this.createFilterData) {
          this.createFilterData.folder = null;
        }
      });
  }

  openCustomFilterModal(selectedFilter?: Filter) {
    this.errorMessage = null;
    this.hasDuplicateFilterName = false;
    this.createFilterForm.reset();
    if (selectedFilter) {
      this.createFilterData = { ...selectedFilter };
      this.selectedFilter = selectedFilter;
      this.createFilterForm.get('name').setValue(selectedFilter.name);
      this.createFilterForm.get('filterText').setValue(selectedFilter.filter_text);
      this.createFilterForm.get('moveTo').setValue(selectedFilter.move_to);
      this.createFilterForm.get('markAsRead').setValue(selectedFilter.mark_as_read);
      this.createFilterForm.get('markAsStarred').setValue(selectedFilter.mark_as_starred);
    } else {
      this.createFilterData = {};
      this.selectedFilter = null;
    }
    this.customFilterModalRef = this.modalService.open(this.customFilterModal, {
      centered: true,
      windowClass: 'modal-sm',
    });
  }

  /**
   * Save custom filter's form content
   */
  onSubmit() {
    this.errorMessage = null;
    if (this.createFilterForm.valid && !this.hasDuplicateFilterName) {
      const data = {
        ...this.createFilterData,
        name: this.createFilterForm.get('name').value,
        filter_text: this.createFilterForm.get('filterText').value,
        move_to: this.createFilterForm.get('moveTo').value || false,
        mark_as_read: this.createFilterForm.get('markAsRead').value || false,
        mark_as_starred: this.createFilterForm.get('markAsStarred').value || false,
      };
      if (!data.condition || !data.parameter) {
        this.errorMessage = 'Please select a condition.';
      } else if (!data.filter_text) {
        this.errorMessage = 'Please enter some text or pattern.';
      } else if (data.move_to && !data.folder) {
        this.errorMessage = 'Please select a folder.';
      } else if (data.id) {
        this.store.dispatch(new UpdateFilter(data));
      } else {
        this.store.dispatch(new CreateFilter(data));
      }
    }
  }

  confirmDeleteFilter(filter: Filter) {
    this.selectedFilter = filter;
    this.deleteFilterModalRef = this.modalService.open(this.deleteFilterModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal',
    });
  }

  deleteFilter() {
    if (this.selectedFilter) {
      this.store.dispatch(new DeleteFilter(this.selectedFilter));
      this.deleteFilterModalRef.dismiss();
    }
  }

  private checkFilterExist(value: string) {
    if (value) {
      if (this.selectedFilter && this.selectedFilter.name.toLowerCase() === value.toLowerCase()) {
        this.hasDuplicateFilterName = false;
      } else if (this.filters.find(filter => value && filter.name.toLowerCase() === value.toLowerCase())) {
        this.hasDuplicateFilterName = true;
        return true;
      }
    }
    this.hasDuplicateFilterName = false;
    return false;
  }

  priorityDown(index: number) {
    const priorityOrder = this.filters[index].priority_order;
    this.filters[index].priority_order = this.filters[index + 1].priority_order;
    this.filters[index + 1].priority_order = priorityOrder;
    this.filters.sort((a, b) => {
      return a.priority_order - b.priority_order;
    });
  }

  priorityUp(index: number) {
    const sortOrder = this.filters[index].priority_order;
    this.filters[index].priority_order = this.filters[index - 1].priority_order;
    this.filters[index - 1].priority_order = sortOrder;
    this.filters.sort((a, b) => {
      return a.priority_order - b.priority_order;
    });
  }

  startSetPriority() {
    this.inSetPriority = true;
    this.unmodifiedFilters = this.filters.map(x => ({ ...x }));
  }

  savePriority() {
    this.inProgress = true;
    const payload: any = {
      filter_list: this.filters.map(item => {
        return { filter_id: item.id, priority_order: item.priority_order };
      }),
    };
    this.store.dispatch(new UpdateFilterOrder(payload));
  }

  cancelSetPriority() {
    this.inSetPriority = false;
    this.filters = this.unmodifiedFilters;
  }

  onFilterDrop(event: CdkDragDrop<Filter[]>) {
    moveItemInArray(this.filters, event.previousIndex, event.currentIndex);
    this.filters.forEach((filter: Filter, index: number) => {
      filter.priority_order = index + 1;
    });
  }
}
