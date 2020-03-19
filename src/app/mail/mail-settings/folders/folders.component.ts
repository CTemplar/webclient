import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Folder } from '../../../store/models';
import { AppState, UserState } from '../../../store/datatypes';
import { Store } from '@ngrx/store';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeleteFolder, UpdateFolderOrder } from '../../../store/actions';
import { CreateFolderComponent } from '../../dialogs/create-folder/create-folder.component';
import { NotificationService } from '../../../store/services/notification.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['../mail-settings.component.scss', './folders.component.scss']
})
export class FoldersComponent implements OnInit, OnDestroy {
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
    this.store.select(state => state.user).pipe(untilDestroyed(this))
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
   * Free Users - Only allow a maximum of 5 folders per account
   */
  // == Open NgbModal
  addFolder(folder: Folder = { id: null, name: '', color: '' }, edit?: boolean) {
    const options: any = {
      centered: true,
      windowClass: 'modal-sm mailbox-modal create-folder-modal',
    };

    if (this.userState.isPrime || (this.userState.customFolders === null || (this.userState.customFolders.length < 5 || edit))) {
      const component = this.modalService.open(CreateFolderComponent, options).componentInstance;
      component.folder = folder;
    } else {
      this.notificationService.showSnackBar('Free users can only create a maximum of 5 folders.');
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
