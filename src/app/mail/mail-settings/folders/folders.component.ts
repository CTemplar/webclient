import { Component, OnInit, ViewChild } from '@angular/core';
import { Folder } from '../../../store/models';
import { AppState, UserState } from '../../../store/datatypes';
import { Store } from '@ngrx/store';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeleteFolder, UpdateFolderOrder } from '../../../store/actions';
import { CreateFolderComponent } from '../../dialogs/create-folder/create-folder.component';
import { NotificationService } from '../../../store/services/notification.service';
import { takeUntil } from 'rxjs/operators';

@TakeUntilDestroy()
@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['../mail-settings.component.scss', './folders.component.scss']
})
export class FoldersComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;
  folders: Array<Folder> = [];
  userState: UserState;
  @ViewChild('confirmationModal') confirmationModal;
  confirmModalRef: NgbModalRef;
  selectedFolder: Folder;

  reorder: boolean;
  reorderInProgress: boolean = false;

  private unmodifiedFolders: Array<Folder>;

  constructor(private store: Store<AppState>,
              private modalService: NgbModal,
              private notificationService: NotificationService) { }

  ngOnInit() {
    this.store.select(state => state.user).pipe(takeUntil(this.destroyed$))
      .subscribe((user: UserState) => {
        this.userState = user;
        if (user.inProgress) {
          this.reorderInProgress = true;
          return;
        }
        if (this.reorderInProgress) {
          this.reorderInProgress = false;
          this.reorder = false;
        }
        this.folders = [...user.customFolders];
      });
  }

  showConfirmationModal(folder: Folder) {
    this.confirmModalRef = this.modalService.open(this.confirmationModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
    this.selectedFolder = folder;
  }

  /**
   * @description
   * Prime Users - Can create as many folders as they want
   * Free Users - Only allow a maximum of 3 folders per account
   */
  // == Open NgbModal
  addFolder(folder: Folder = { id: null, name: '', color: '' }) {
    const options: any = {
      centered: true,
      windowClass: 'modal-sm mailbox-modal',
    };

    if (this.userState.isPrime || (this.userState.customFolders === null || this.userState.customFolders.length < 3)) {
      const component = this.modalService.open(CreateFolderComponent, options).componentInstance;
      component.folder = folder;
    } else {
      this.notificationService.showSnackBar('Free users can only create a maximum of 3 folders.');
    }
  }


  deleteFolder() {
    this.store.dispatch(new DeleteFolder(this.selectedFolder));
    setTimeout(() => {
      this.confirmModalRef.dismiss();
    }, 1000);
  }

  sortDown(index: number) {
    const sortOrder = this.folders[index].sort_order;
    this.folders[index].sort_order = this.folders[index + 1].sort_order;
    this.folders[index + 1].sort_order = sortOrder;
    this.folders.sort((a, b) => {
      return a.sort_order - b.sort_order;
    });
  }

  sortUp(index: number) {
    const sortOrder = this.folders[index].sort_order;
    this.folders[index].sort_order = this.folders[index - 1].sort_order;
    this.folders[index - 1].sort_order = sortOrder;
    this.folders.sort((a, b) => {
      return a.sort_order - b.sort_order;
    });
  }

  startReorder() {
    this.reorder = true;
    this.unmodifiedFolders = this.folders.map(x => Object.assign({}, x));
  }

  saveOrder() {
    this.reorderInProgress = true;
    const payload: any = {
      folders: this.folders,
      data: {
        folder_list: this.folders.map(item => {
          return { folder_id: item.id, sort_order: item.sort_order };
        }),
      }
    };
    this.store.dispatch(new UpdateFolderOrder(payload));
  }

  cancelOrder() {
    this.reorder = false;
    this.folders = this.unmodifiedFolders;
  }


  ngOnDestroy(): void {
  }

}
