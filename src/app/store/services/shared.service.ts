// Angular
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Helpers
import { CreateFolderComponent } from '../../mail/dialogs/create-folder/create-folder.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PaymentFailureNoticeComponent } from '../../mail/dialogs/payment-failure-notice/payment-failure-notice.component';
import { NotificationService } from './notification.service';
import { Folder, MailFolderType } from '../models';
import { AllowIn } from 'ng-keyboard-shortcuts';
import { GenericFolderComponent } from '../../mail/mail-list/mail-folder/generic-folder/generic-folder.component';
import { MailComponent } from '../../mail/mail.component';
import { MailDetailComponent } from '../../mail/mail-detail/mail-detail.component';

@Injectable()
export class SharedService {
  isReady: EventEmitter<boolean> = new EventEmitter();
  hideFooter: EventEmitter<boolean> = new EventEmitter();
  hideHeader: EventEmitter<boolean> = new EventEmitter();
  hideEntireFooter: EventEmitter<boolean> = new EventEmitter();
  keyPressed: EventEmitter<any> = new EventEmitter();
  isMail: EventEmitter<boolean> = new EventEmitter();
  isExternalPage: EventEmitter<boolean> = new EventEmitter();

  private paymentFailureModalRef: NgbModalRef;

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
   * Free Users - Only allow a maximum of 5 folders per account
   */
  openCreateFolderDialog(isPrime, customFolders: Folder[], callback: { self: any, method: string } = null) {
    if (isPrime) {
      this.openModal(callback);
    } else if (customFolders === null || customFolders.length < 5) {
      this.openModal(callback);
    } else {
      this.notificationService.showSnackBar('Free users can only create a maximum of 5 folders.');
    }
  }

  private openModal(callback: { self: any, method: string } = null) {
    const modal: NgbModalRef = this.modalService.open(CreateFolderComponent, { centered: true, windowClass: 'modal-sm mailbox-modal' });
    (<CreateFolderComponent>modal.componentInstance).callback = callback;
  }

  showPaymentFailureDialog() {
    if (!this.paymentFailureModalRef) {
      this.paymentFailureModalRef = this.modalService.open(PaymentFailureNoticeComponent, {
        centered: true,
        windowClass: 'modal-sm',
        backdrop: 'static',
        keyboard: false
      });
      this.paymentFailureModalRef.result.then(() => this.paymentFailureModalRef = null);
    }
  }

  copyToClipboard(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.notificationService.showSnackBar('Copied to clipboard successfully.');
  }

}

export function sortByString(data: any[], field: string) {
  return data.sort((a, b) => {
    if (a[field] < b[field]) {
      return -1;
    }
    if (a[field] > b[field]) {
      return 1;
    }
    return 0;
  });
}

export function getMailComponentShortcuts(mailComponent: MailComponent) {
  return [
    getShortcutKeyObj('cmd + i', 'Mail', 'Go to Inbox', () => {
      mailComponent.navigateToPage('/mail/inbox/page/1');
    }, [], true),
    getShortcutKeyObj('cmd + d', 'Mail', 'Go to Draft', () => {
      mailComponent.navigateToPage('/mail/draft/page/1');
    }, [], true),
    getShortcutKeyObj('cmd + s', 'Mail', 'Go to Sent', () => {
      mailComponent.navigateToPage('/mail/sent/page/1');
    }, [], true),
    getShortcutKeyObj('cmd + .', 'Mail', 'Go to Starred', () => {
      mailComponent.navigateToPage('/mail/starred/page/1');
    }, [], true),
    getShortcutKeyObj('cmd + a', 'Mail', 'Go to Archive', () => {
      mailComponent.navigateToPage('/mail/archive/page/1');
    }, [], true),
    getShortcutKeyObj('cmd + x', 'Mail', 'Go to Spam', () => {
      mailComponent.navigateToPage('/mail/spam/page/1');
    }, [], true),
    getShortcutKeyObj('shift + t', 'Mail', 'Go to trash', () => {
      mailComponent.navigateToPage('/mail/trash/page/1');
    }, [], false)
  ];
}

function getShortcutKeyObj(key: string, label, description: string, command, allowIn = [AllowIn.Select, AllowIn.Input],
                           preventDefault?: boolean) {
  return {
    command,
    label,
    description,
    allowIn,
    key: [key],
    preventDefault,
    throttleTime: 250
  };
}

export function getGenericFolderShortcuts(component: GenericFolderComponent) {
  return [
    getShortcutKeyObj('* a', 'Conversation', 'Select all conversations', () => {
      component.markAllMails(true);
    }),
    getShortcutKeyObj('* n', 'Conversation', 'Unselect all conversations', () => {
      component.markAllMails(false);
    }),
    getShortcutKeyObj('r', 'Conversation', 'Mark as read', () => {
      component.markAsRead();
    }),
    getShortcutKeyObj('u', 'Conversation', 'Mark as unread', () => {
      component.markAsRead(false);
    }),
    getShortcutKeyObj('.', 'Conversation', 'Mark as starred', () => {
      component.markAsStarred();
    }),
    getShortcutKeyObj('cmd + *', 'Conversation', 'Mark as starred', () => {
      component.markAsStarred();
    }),
    getShortcutKeyObj('cmd + shift + *', 'Conversation', 'Mark as unstarred', () => {
      component.markAsStarred(false);
    }),
    getShortcutKeyObj('t', 'Conversation', 'Move to trash', () => {
      component.moveToFolder(MailFolderType.TRASH);

    }),
    getShortcutKeyObj('i', 'Conversation', 'Move to inbox', () => {
      component.moveToFolder(MailFolderType.INBOX);

    }),
    getShortcutKeyObj('a', 'Conversation', 'Move to archive', () => {
      component.moveToFolder(MailFolderType.ARCHIVE);

    }),
    getShortcutKeyObj('s', 'Conversation', 'Move to starred', () => {
      component.moveToFolder(MailFolderType.STARRED);

    })
  ];
}
