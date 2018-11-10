// Angular
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Helpers
import { CreateFolderComponent } from '../../mail/dialogs/create-folder/create-folder.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from './notification.service';
import { Folder } from '../models';

@Injectable()
export class SharedService {
  isReady: EventEmitter<boolean> = new EventEmitter();
  hideFooter: EventEmitter<boolean> = new EventEmitter();
  hideHeader: EventEmitter<boolean> = new EventEmitter();
  hideEntireFooter: EventEmitter<boolean> = new EventEmitter();
  keyPressed: EventEmitter<any> = new EventEmitter();
  isMail: EventEmitter<boolean> = new EventEmitter();
  isExternalPage: EventEmitter<boolean> = new EventEmitter();

  //
  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private notificationService: NotificationService,
  ) {}

  sortByDate(data: any[], sortField: string): any[] {
    return data.sort((a: any, b: any) =>
      new Date(b[sortField]).getTime() - new Date(a[sortField]).getTime()
    );
  }

  /**
   * @description
   * Prime Users - Can create as many folders as they want
   * Free Users - Only allow a maximum of 3 folders per account
   */
  openCreateFolderDialog(isPrime, customFolders: Folder[]) {
    if (isPrime) {
      this.modalService.open(CreateFolderComponent, { centered: true, windowClass: 'modal-sm mailbox-modal' });
    } else if (customFolders === null || customFolders.length < 3) {
      this.modalService.open(CreateFolderComponent, { centered: true, windowClass: 'modal-sm mailbox-modal' });
    } else {
      this.notificationService.showSnackBar('Free users can only create a maximum of 3 folders.');
    }
  }

}
