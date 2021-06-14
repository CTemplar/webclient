import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { CreateFilter, DeleteFilter, UpdateFilter, UpdateFilterOrder } from '../../../store/actions';
import { AppState, UserState } from '../../../store/datatypes';
import { Folder, MailFolderType } from '../../../store/models';
import {
  Filter,
  FilterCondition,
  FilterConditionChoices,
  FilterConditionObject,
  FilterParameter,
} from '../../../store/models/filter.model';

@UntilDestroy()
@Component({
  selector: 'app-mail-filters',
  templateUrl: './mail-filters.component.html',
  styleUrls: ['../mail-settings.component.scss'],
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

  filterConditionChoices = FilterConditionChoices;

  filterParameter = FilterParameter;

  filters: Filter[];

  userState: UserState;

  customFolders: Folder[];

  createFilterForm: FormGroup;

  createFilterData: Filter;

  filterConditionText: string;

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
          this.createFilterData.folder = undefined;
        }
      });
  }

  openCustomFilterModal(selectedFilter?: Filter) {
    this.errorMessage = undefined;
    this.hasDuplicateFilterName = false;
    this.createFilterForm.reset();
    if (selectedFilter) {
      this.createFilterData = { ...selectedFilter };
      this.selectedFilter = selectedFilter;
      this.createFilterForm.get('name').setValue(selectedFilter.name);
      this.createFilterForm.get('moveTo').setValue(selectedFilter.move_to);
      this.createFilterForm.get('markAsRead').setValue(selectedFilter.mark_as_read);
      this.createFilterForm.get('markAsStarred').setValue(selectedFilter.mark_as_starred);

      for (const [index, condition] of this.createFilterData.conditions.entries()) {
        const filterTextName = `filterText-${index.toString()}`;
        this.createFilterForm.addControl(filterTextName, new FormControl());
        this.createFilterForm.get(filterTextName).setValue(condition.filter_text);
      }
    } else {
      this.createFilterData = {
        name: '',
        conditions: [
          {
            parameter: undefined,
            condition: undefined,
            filter_text: '',
          },
        ],
        folder: '',
        mark_as_read: false,
        mark_as_starred: false,
        move_to: false,
      };
      this.createFilterForm.addControl('filterText-0', new FormControl());
      this.selectedFilter = undefined;
      this.filterConditionText = '';
    }
    this.customFilterModalRef = this.modalService.open(this.customFilterModal, {
      centered: true,
      windowClass: 'modal-sm',
    });
  }

  onAddCondition() {
    this.createFilterData.conditions = [
      ...this.createFilterData.conditions,
      {
        parameter: undefined,
        condition: undefined,
        filter_text: '',
      },
    ];
    this.createFilterForm.addControl(
      `filterText-${(this.createFilterData.conditions.length - 1).toString()}`,
      new FormControl(),
    );
  }

  onRemoveCondition(index: number) {
    this.createFilterData.conditions.splice(index, 1);
  }

  /**
   * Save custom filter's form content
   */
  onSubmit() {
    this.errorMessage = undefined;
    if (this.createFilterForm.valid && !this.hasDuplicateFilterName) {
      let conditions: FilterConditionObject[] = [];
      this.createFilterData.conditions.map((c, index) => {
        const filterTextName = `filterText-${index.toString()}`;
        const filterText = this.createFilterForm.get(filterTextName).value;
        if (!c.parameter || c.parameter.length === 0) {
          this.errorMessage = 'Please select a condition.';
          return;
        }
        if (!c.condition || c.condition.length === 0) {
          this.errorMessage = 'Please select a condition.';
          return;
        }
        if (!filterText || filterText.length === 0) {
          this.errorMessage = 'Please enter some text or pattern.';
          return;
        }
        conditions = [
          ...conditions,
          {
            parameter: c.parameter,
            condition: c.condition,
            filter_text: filterText,
          },
        ];
      });

      if (this.errorMessage) return;

      const data: Filter = {
        conditions,
        name: this.createFilterForm.get('name').value,
        move_to: this.createFilterForm.get('moveTo').value || false,
        mark_as_read: this.createFilterForm.get('markAsRead').value || false,
        mark_as_starred: this.createFilterForm.get('markAsStarred').value || false,
      };
      if (this.createFilterData.id) {
        data.id = this.createFilterData.id;
      }
      if (this.createFilterData.folder) {
        data.folder = this.createFilterData.folder;
      }

      if (data.move_to && !data.folder) {
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
