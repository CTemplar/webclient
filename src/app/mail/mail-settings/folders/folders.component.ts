import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Folder } from '../../../store/models';
import { AppState, UserState, MailState } from '../../../store/datatypes';
import { DeleteFolder, UpdateFolderOrder, GetCustomFolderMessageCount } from '../../../store/actions';
import { CreateFolderComponent } from '../../dialogs/create-folder/create-folder.component';
import { NotificationService } from '../../../store/services/notification.service';

@UntilDestroy()
@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['../mail-settings.component.scss', './folders.component.scss'],
})
export class FoldersComponent implements OnInit {
  folders: Array<Folder> = [];

  userState: UserState;

  @ViewChild('confirmationModal') confirmationModal: any;

  confirmModalRef: NgbModalRef;

  selectedFolder: Folder;

  reorder: boolean;

  sortedWithAlphabetic = false;

  reorderInProgress = false;

  private unmodifiedFolders: Array<Folder>;

  private mailState: MailState;

  @Output() onAnchored = new EventEmitter<any>();

  constructor(
    private store: Store<AppState>,
    private modalService: NgbModal,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    /**
     * Get list of customFolders for current user
     */
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.userState = user;
        this.store.dispatch(new GetCustomFolderMessageCount());
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
    /**
     * Add message count on each custom folder
     */
    this.store
      .select(state => state.mail)
      .pipe(untilDestroyed(this))
      .subscribe((mailState: MailState) => {
        this.mailState = mailState;
        this.folders = this.mergeById(this.folders, this.mailState.customFolderMessageCount);
      });
  }

  mergeById = (a1: any[], a2: any[]) =>
    a1.map(itm => ({
      ...itm,
      ...a2.find(item => item.folder === itm.name && item),
    }));

  showConfirmationModal(folder: Folder) {
    this.confirmModalRef = this.modalService.open(this.confirmationModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal',
    });
    this.selectedFolder = folder;
  }

  /**
   * @description
   * Prime Users - Can create as many folders as they want
   * Free Users - Only allow a maximum of 5 folders per account
   */
  // == Open NgbModal
  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  addFolder(folder: Folder = { id: null, name: '', color: '' }, edit?: boolean) {
    const options: any = {
      centered: true,
      windowClass: 'modal-sm mailbox-modal create-folder-modal',
    };
    const component = this.modalService.open(CreateFolderComponent, options).componentInstance;
    component.folder = folder;
    component.edit = edit;
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
    this.unmodifiedFolders = this.folders.map(x => ({ ...x }));
  }

  saveOrder() {
    this.reorderInProgress = true;
    const payload: any = {
      folders: this.folders,
      data: {
        folder_list: this.folders.map(item => {
          return { folder_id: item.id, sort_order: item.sort_order };
        }),
      },
    };
    this.store.dispatch(new UpdateFolderOrder(payload));
  }

  cancelOrder() {
    this.reorder = false;
    this.folders = this.unmodifiedFolders;
  }

  sortWithAlphabetic() {
    this.sortedWithAlphabetic = !this.sortedWithAlphabetic;
    if (this.sortedWithAlphabetic) {
      for (const [index, folder] of this.folders.sort((f, s) => f.name.localeCompare(s.name)).entries()) {
        folder.sort_order = index + 1;
        this.folders[index] = folder;
      }
    } else {
      for (const [index, folder] of this.folders.sort((f, s) => -f.name.localeCompare(s.name)).entries()) {
        folder.sort_order = index + 1;
        this.folders[index] = folder;
      }
    }
    this.saveOrder();
  }

  onFolderDrop(event: CdkDragDrop<Folder[]>) {
    moveItemInArray(this.folders, event.previousIndex, event.currentIndex);
    this.folders.forEach((folder: Folder, index) => {
      folder.sort_order = index + 1;
    });
  }

  onAnchoredLink(id: string) {
    // this.onAnchored.emit(id);
    const elmnt = document.getElementById(id);
    elmnt.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}
