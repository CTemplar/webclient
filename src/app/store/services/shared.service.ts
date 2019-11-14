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
import { MailSidebarComponent } from '../../mail/mail-sidebar/mail-sidebar.component';
import { ComposeMailComponent } from '../../mail/mail-sidebar/compose-mail/compose-mail.component';
import { ComposeMailDialogComponent } from '../../mail/mail-sidebar/compose-mail-dialog/compose-mail-dialog.component';
import { PricingPlan } from '../datatypes';

@Injectable()
export class SharedService {
  static PRICING_PLANS: any;
  static PRICING_PLANS_ARRAY: Array<PricingPlan> = [];
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

  loadPricingPlans() {
    if (SharedService.PRICING_PLANS) {
      return;
    }
    this.http.get('./assets/static/pricing-plans.json')
      .subscribe((data: any) => {
        SharedService.PRICING_PLANS = data;
        SharedService.PRICING_PLANS_ARRAY = [];
        Object.keys(data).forEach(key => {
          data[key].name = key;
          SharedService.PRICING_PLANS_ARRAY.push(data[key]);
        });
      });
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
  const data = [
    getShortcutKeyObj('g i', 'Mail', 'Go to Inbox', () => {
      if (!isComposeEditorOpen()) {
        mailComponent.navigateToPage('/mail/inbox/page/1');
      }
    }, []),
    getShortcutKeyObj('g d', 'Mail', 'Go to Draft', () => {
      if (!isComposeEditorOpen()) {
        mailComponent.navigateToPage('/mail/draft/page/1');
      }
    }, []),
    getShortcutKeyObj('g s', 'Mail', 'Go to Sent', () => {
      if (!isComposeEditorOpen()) {
        mailComponent.navigateToPage('/mail/sent/page/1');
      }
    }, []),
    getShortcutKeyObj('g .', 'Mail', 'Go to Starred', () => {
      if (!isComposeEditorOpen()) {
        mailComponent.navigateToPage('/mail/starred/page/1');
      }
    }, []),
    getShortcutKeyObj('g a', 'Mail', 'Go to Archive', () => {
      if (!isComposeEditorOpen()) {
        mailComponent.navigateToPage('/mail/archive/page/1');
      }
    }, []),
    getShortcutKeyObj('g x', 'Mail', 'Go to Spam', () => {
      if (!isComposeEditorOpen()) {
        mailComponent.navigateToPage('/mail/spam/page/1');
      }
    }, []),
    getShortcutKeyObj('g t', 'Mail', 'Go to trash', () => {
      if (!isComposeEditorOpen()) {
        mailComponent.navigateToPage('/mail/trash/page/1');
      }
    }, [])
  ];
  return [];
}

export function isComposeEditorOpen(): boolean {
  return (document.getElementsByTagName('app-compose-mail-dialog').length > 0);
}

function getShortcutKeyObj(key: string, label, description: string, command, allowIn = [AllowIn.Select, AllowIn.Input],
                           preventDefault: boolean = false) {
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
  const data = [
    getShortcutKeyObj('* a', 'Conversation', 'Select all conversations', () => {
      if (!isComposeEditorOpen()) {
        component.markAllMails(true);
      }
    }),
    getShortcutKeyObj('* n', 'Conversation', 'Unselect all conversations', () => {
      if (!isComposeEditorOpen()) {
        component.markAllMails(false);
      }
    }),
    getShortcutKeyObj('r', 'Conversation', 'Mark as read', () => {
      if (!isComposeEditorOpen()) {
        component.markAsRead();
      }
    }),
    getShortcutKeyObj('u', 'Conversation', 'Mark as unread', () => {
      if (!isComposeEditorOpen()) {
        component.markAsRead(false);
      }
    }),
    getShortcutKeyObj('s', 'Conversation', 'Mark as starred', () => {
      component.markAsStarred();
    }),
    getShortcutKeyObj('t', 'Conversation', 'Move to trash', () => {
      if (!isComposeEditorOpen()) {
        component.moveToFolder(MailFolderType.TRASH);
      }

    }),
    getShortcutKeyObj('i', 'Conversation', 'Move to inbox', () => {
      if (!isComposeEditorOpen()) {
        component.moveToFolder(MailFolderType.INBOX);
      }

    }),
    getShortcutKeyObj('a', 'Conversation', 'Move to archive', () => {
      if (!isComposeEditorOpen()) {
        component.moveToFolder(MailFolderType.ARCHIVE);
      }

    })
  ];
  return [];
}

export function getMailSidebarShortcuts(component: MailSidebarComponent) {
  const data = [
    getShortcutKeyObj('shift + c', 'Composer', 'Open new composer', () => {
      if (!isComposeEditorOpen()) {
        component.openComposeMailDialog();
      }
    }),

  ];
  return [];
}
export function getComposeMailShortcuts(component: ComposeMailComponent) {
  const data = [
    getShortcutKeyObj('ctrl + enter', 'Composer', 'Send e-mail', () => {
        component.sendEmail();
    })
  ];
  return [];
}
export function getComposeMailDialogShortcuts(component: ComposeMailDialogComponent) {
  const data = [
    getShortcutKeyObj('cmd + shift + x', 'Composer Dialog', 'Close composer', () => {
      component.onClose();
    })
  ];
  return [];
}

export const LOADING_IMAGE: string = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBpZD0ibWFzdGVyLWFydGJvYXJkIiB2aWV3Qm94PSIwIDAgMTA2MS40MzE1MTg1NTQ2ODc1IDkxNi42MjI2ODA2NjQwNjI1IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeD0iMHB4IiB5PSIwcHgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE0MDAgOTgwOyIgd2lkdGg9IjEwNjEuNDMxNTE4NTU0Njg3NXB4IiBoZWlnaHQ9IjkxNi42MjI2ODA2NjQwNjI1cHgiPjxyZWN0IGlkPSJlZS1iYWNrZ3JvdW5kIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTA2MS40MzE1MTg1NTQ2ODc1IiBoZWlnaHQ9IjkxNi42MjI2ODA2NjQwNjI1IiBzdHlsZT0iZmlsbDogd2hpdGU7IGZpbGwtb3BhY2l0eTogMDsgcG9pbnRlci1ldmVudHM6IG5vbmU7Ii8+PGRlZnM+PHN0eWxlIGlkPSJlZS1nb29nbGUtZm9udHMiPkBpbXBvcnQgdXJsKGh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1BbnRvbjo0MDB8Um9ib3RvK1NsYWI6MTAwLDMwMCw0MDAsNzAwKTs8L3N0eWxlPjxwYXRoIGlkPSJ0ZXh0LXBhdGgtMCIgZD0iTSA3NzguODQ2NDk2NTgyMDMxMiAyMTMuNDYxMjI3NDE2OTkyMiBBIDEwMCAxOCAwIDAgMSA5ODguMzUzMzkzNTU0Njg3NSAyMTMuNDYxMjI3NDE2OTkyMiBBIDEwMCAxOCAwIDAgMSA3NzguODQ2NDk2NTgyMDMxMiAyMTMuNDYxMjI3NDE2OTkyMiBaIiBzdHlsZT0iZmlsbDogbm9uZTsgc3Ryb2tlOiByZWQ7IHN0cm9rZS13aWR0aDogMjsiLz48cGF0aCBpZD0idGV4dC1wYXRoLTEiIGQ9Ik0gNjY0LjU0NjQ0Nzc1MzkwNjIgMzcuOTYxMjI3NDE2OTkyMTkgQSAxMDAgMTkgMCAwIDEgODc2LjU4MTIzNzc5Mjk2ODggMzcuOTYxMjI3NDE2OTkyMTkgQSAxMDAgMTkgMCAwIDEgNjY0LjU0NjQ0Nzc1MzkwNjIgMzcuOTYxMjI3NDE2OTkyMTkiIHN0eWxlPSJmaWxsOiBub25lOyBzdHJva2U6IHJlZDsgc3Ryb2tlLXdpZHRoOiAyOyIvPjxwYXRoIGlkPSJ0ZXh0LXBhdGgtMiIgZD0iTSA3NjUuMzY1MDUxMjY5NTMxMiAyMTEuNzA4NTExMzUyNTM5MDYgQSAxMDAgMTcgMCAwIDEgOTkxLjUwMTc3MDAxOTUzMTIgMjExLjcwODUxMTM1MjUzOTA2IEEgMTAwIDE3IDAgMCAxIDc2NS4zNjUwNTEyNjk1MzEyIDIxMS43MDg1MTEzNTI1MzkwNiIgc3R5bGU9ImZpbGw6IG5vbmU7IHN0cm9rZTogcmVkOyBzdHJva2Utd2lkdGg6IDI7Ii8+PHBhdGggaWQ9InBhdGgtMSIgZD0iTSA3NjUuMzY1MDUxMjY5NTMxMiAyMTEuNzA4NTExMzUyNTM5MDYgQSAxMDAgMTcgMCAwIDEgOTkxLjUwMTc3MDAxOTUzMTIgMjExLjcwODUxMTM1MjUzOTA2IEEgMTAwIDE3IDAgMCAxIDc2NS4zNjUwNTEyNjk1MzEyIDIxMS43MDg1MTEzNTI1MzkwNiIgc3R5bGU9ImZpbGw6IG5vbmU7IHN0cm9rZTogcmVkOyBzdHJva2Utd2lkdGg6IDI7Ii8+PC9kZWZzPgoKCjxwYXRoIGQ9Ik0gODgwLjM4NzAyMzkyNTc4MTIgMjM5LjkwNjA2Njg5NDUzMTI1IiBzdHlsZT0iZmlsbDogcmdiKDYzLCA2MSwgNjEpOyBmaWxsLW9wYWNpdHk6IDE7IHN0cm9rZTogcmdiKDAsIDAsIDApOyBzdHJva2Utb3BhY2l0eTogMTsgc3Ryb2tlLXdpZHRoOiAwOyBwYWludC1vcmRlcjogZmlsbDsiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIDMuMzM1NjQ5MjUxOTM3ODY2LCAtMjYuNjg1MTk1OTIyODUxNTYyKSIvPjxwYXRoIGQ9Ik0gODY0LjE0NDc3NTM5MDYyNSAyMjkuNDg2NTExMjMwNDY4NzUiIHN0eWxlPSJmaWxsOiByZ2IoNjMsIDYxLCA2MSk7IGZpbGwtb3BhY2l0eTogMTsgc3Ryb2tlOiByZ2IoMCwgMCwgMCk7IHN0cm9rZS1vcGFjaXR5OiAxOyBzdHJva2Utd2lkdGg6IDA7IHBhaW50LW9yZGVyOiBmaWxsOyIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgMy4zMzU2NDkyNTE5Mzc4NjYsIC0yNi42ODUxOTU5MjI4NTE1NjIpIi8+PGcgdHJhbnNmb3JtPSJtYXRyaXgoMjUuNzg5NDc0NDg3MzA0Njg4LCAwLCAwLCAyNS43ODk0NzQ0ODczMDQ2ODgsIDQwLjMzNTYyMjU0OTA1NzAxLCAtMjYuNjg1MTk1OTIyODUxNTYyKSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjE3MTAzODY0MjUyNTY3MjksIDAsIDAsIDAuMTcxMDM4NjQyNTI1NjcyOSwgMTUuMTMyOTUzMjA1MjkzNjYsIDE2LjI5NzAyMTkzMTY1NDg1KSI+CiAgICAgICAgPHBhdGggZmlsbD0iI0ZGRiIgZD0iTTUwLjU4OSA5LjA1N2wuMDg0LjA1Mi4wODQuMDU0LjA2OS4wNy4wNjMuMDg0LjA0OC4wODQuMDM2LjEuMDIxLjA5LjAwNi4xMDYtLjAwNi4xLS4xODMgMS4yNDktLjE2Ljk5OC0uMDI2LjEzOS0uMTUzLjg1LS4xOTkuOTkzLS4yMS45OS0uMjI4Ljk3Ny0uMjQ1Ljk4NC0uMjY4Ljk3Ny0uMjcuOTY5LS4zLjk2Mi0uMzA2Ljk2My0uMzI3Ljk1Ni0uMzM2Ljk0OC0uMzY2Ljk0LS4zNy45MzYtLjM5LjkzNS0uMzk5LjkyNy0uNDE3LjkxNC0uNDQuOTE0LS40NDguODk2LS40NjIuOTAyLS40OC44ODQtNy44MzgtNi42MTZMMzQgMjIuNTQ5IDQ5Ljg1NyA5LjE2M2wuMTUyLS4wOTcuMDktLjAzNi4wOTYtLjAyLjEtLjAxaC4wOTlsLjA5Ni4wMjR6TTQxIDM0LjM2M2wtMS4wOSAxLjU3Ny0uNTc0Ljc4Ny0uNTg4Ljc3NS0uNi43NzItLjYwOC43NDktLjYyOC43NTUtLjYzNC43My0uNjQ4LjcyNi0uNjYuNzEtLjY2NS43MDUtLjY4OC42OS0uNjk1LjY3OC0uNzAyLjY3LS43MTIuNjU1LS43MjkuNjQzLS43MzEuNjMtLjc1Mi42MTUtLjc1NC42MDEtLjc2Ni41OTZMMjcgNDloLS4wMDVsLTEuNTE1LTEuMTQ4LS43NTQtLjU5OS0uNzUtLjYxNy0uNzMtLjYzLS43My0uNjQ0LS43MTQtLjY1NS0uNzA4LS42NjMtLjY5NC0uNjg0LS42OC0uNjktLjY3NC0uNy0uNjYzLS43MS0uNjQ1LS43MjUtLjYzNC0uNzM3LS42MjgtLjc0Ni0uNjA4LS43Ni0uNi0uNzYzLS41ODgtLjc4Mi0uNTc0LS43ODYtLjU2LS43OTMtLjU0Ny0uODA1IDguODA3LTcuNTc4TDIzLjg4MyAyNWwxLjM5NyAxLjIwNC4xNjEuMTIzLjE2Ni4xMTUuMTcyLjEwNS4xODEuMDgzLjE4Ny4wNzMuMTk1LjA1Ni4xOTIuMDQuMi4wMzYuMjY3LjAxMi4xOTYtLjAxMi4yLS4wMjMuMTk4LS4wMzMuMTktLjA1NS4xOTItLjA2OC4xOC0uMDgyLjE3Mi0uMDk3LjE3NS0uMTA5LjIxMy0uMTY0TDMwLjExNCAyNWwyLjA3NyAxLjc4NXoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjRkZGIiBkPSJNNi4zNDIgOS4xOTNMMjUgMjUuMDEzbC0yLjU1NyAyLjE2OEwxMy4yMTggMzVsLS43MDYtMS4zMTItLjU0NC0xLjA2My0uNTE2LTEuMDctLjUxMS0xLjA4LS40ODUtMS4wOUw5Ljk4IDI4LjNsLS40NTItMS4xMDUtLjQzNS0xLjExMi0uNDEtMS4xMTMtLjM5NS0xLjEzLS4zODUtMS4xMy0uMzUzLTEuMTM0LS4zNDYtMS4xMzgtLjMyMi0xLjE0OC0uMzAzLTEuMTUxLS4yOC0xLjE2Ni0uMjcxLTEuMTYzLS4yMzctMS4xNjItLjIzLTEuMTctLjEyMy0uNzE2LS4wODEtLjQ2NC0uMTkxLTEuMThMNSA5Ljk0di0uMjE3bC4wMjgtLjExOC4wMzItLjExNC4wNTctLjEuMDYzLS4xLjA4NS0uMDgyLjA5OS0uMDc1LjA5OS0uMDU3LjEwNi0uMDQyLjExMy0uMDI1TDUuNzk4IDloLjEyNGwuMTE3LjAyOS4xMDUuMDM5LjEwNi4wNnpNNDUgOC4yMzdMMjcuNTAzIDIzIDEwIDguMjM3bC45NjItLjM1Ny44NDItLjI5Ljg0LS4yNzkuODUzLS4yNjEuODU2LS4yNDQuODUyLS4yMzUuODYyLS4yMTIuODY3LS4yLjg2Ny0uMTg2Ljg3Mi0uMTY5Ljg3Ni0uMTU0Ljg3My0uMTM2Ljg4MS0uMTIyLjg4Mi0uMTAyLjg4MS0uMDg3Ljg4OC0uMDc1Ljg4Ny0uMDU1Ljg4Ny0uMDM4Ljg4Mi0uMDMuODkzLS4wMDUgMS4wMjMuMDE1Ljg4Ny4wMjYuODg4LjA0Ljg4Ny4wNjEuODgxLjA3Ni44ODIuMDg3Ljg4MS4xMDcuODgyLjEyMi44NzguMTQyLjg3My4xNTcuODcuMTY2Ljg2Ny4xODYuODY3LjIuODYyLjIyNi44NTIuMjMuODU2LjI1Ljg0Ny4yNi44NC4yOC44NDIuMjk1eiIvPgogICAgICAgIDxwYXRoIGZpbGw9IiNFNzRDM0MiIGQ9Ik0xOC41OTYgMjQuNjg0bDEuOTgtMS42NzJMNi4xMzQgMTAuODFsLS4wNzEtLjA1LS4wODItLjA0Ni0uMDgyLS4wMy0uMDktLjAyMmgtLjA5NmwtLjA5LjAwOC0uMDg3LjAyLS4wODMuMDMyLS4wNzYuMDQ0LS4wNzcuMDU4LS4wNjUuMDYzLS4wNS4wNzctLjA0My4wNzctLjAyNS4wODgtLjAyMi4wOTF2LjE2OGwuMTI5LjkwNy4xNDcuOTEuMDYzLjM1OC4wOTYuNTUzLjE3OC45MDIuMTgzLjg5Ni4yMS44OTcuMjE2Ljg5OS4yMzUuODg4LjI1Ljg4Ni4yNjcuODc3LjI3My44NzQuMjk4Ljg3Mi4zMDYuODcyLjMxNy44NTguMzM3Ljg1OC4zNS44NTIuMzY5LjgzNy4zNzQuODQxLjM5Ni44MzMuNC44MjUuNDIuODIuNTQ3IDEuMDEyIDcuMTQtNi4wMzF6TTM5LjgwNCAzNi42bDEuMDM5LTEuNDc3LTguMzk1LTcuMDk4LTEuOTgtMS42NzItMS4zMyAxLjEyOC0uMjAzLjE1NC0uMTY3LjEwMS0uMTY0LjA5MS0uMTcyLjA3Ny0uMTgzLjA2NC0uMTguMDUyLS4xOS4wMy0uMTkuMDIyLS4xODYuMDExLS4yNTUtLjAxMS0uMTkxLS4wMzMtLjE4My0uMDM5LS4xODYtLjA1Mi0uMTc4LS4wNjktLjE3Mi0uMDc3LS4xNjQtLjA5OS0uMTU4LS4xMDctLjE1NC0uMTE1LTEuMzMtMS4xMjgtMS45OCAxLjY3Mi04LjM5MiA3LjA5OC41MjIuNzU0LjUzMy43NDIuNTQ3LjczNy41Ni43MzEuNTcyLjcxNS41OC43MTMuNTk4LjY5OC42MDQuNjkuNjE1LjY4LjYzMi42NjUuNjQyLjY1NS42NDguNjQ2LjY2MS42NC42NzUuNjIyLjY4MS42MTQuNjk0LjYwMi42OTcuNTkxLjcxNC41NzguNzE5LjU2IDEuNDQzIDEuMDc2aC4wMDZsLjczOC0uNTM3LjczLS41NTguNzE4LS41NjQuNzE3LS41NzQuNjk3LS41OTEuNjk0LS42MDMuNjc4LS42MTMuNjctLjYyNy42NjItLjYzNS42NTUtLjY0Ny42MzUtLjY2LjYyOC0uNjY1LjYxOC0uNjguNjA0LS42ODQuNTk5LS43MDcuNTgtLjcwMS41Ny0uNzIzLjU2MS0uNzI2LjU0Ny0uNzM3ek0yNy41MDMgMjIuMTczTDQ0LjA1MiA4LjE5bC0uNzg3LS4yOTUtLjc5Ni0uMjgtLjc5NS0uMjY0LS44MDEtLjI0OC0uODEtLjIzNi0uODA2LS4yMTgtLjgxNC0uMjE0LS44Mi0uMTktLjgyLS4xNzYtLjgyMy0uMTU3LS44MjYtLjE0OC0uODMxLS4xMzUtLjgzNC0uMTE1LS44MzMtLjEwMi0uODM0LS4wODItLjgzNC0uMDcyLS44MzktLjA1OC0uODQtLjAzOC0uODM5LS4wMjUtLjk2Ny0uMDE0LS44NDUuMDA2LS44MzQuMDI3LS44NC4wMzYtLjgzOC4wNTItLjg0LjA3Mi0uODMzLjA4Mi0uODM0LjA5Ny0uODM0LjExNS0uODI1LjEzLS44MjkuMTQ1LS44MjUuMTYtLjgyLjE3Ni0uODIuMTktLjgxNS4yLS44MDYuMjIzLS44MS4yMy0uODA2LjI0OC0uNzk1LjI2NC0uNzk2LjI3NS0uOTEuMzM5IDE2LjU1NSAxMy45ODN6TTQ5LjkxIDExLjI5N2wtLjAwNS0uMDk2LS4wMi0uMDgzLS4wMzItLjA5LS4wNDQtLjA3OC0uMDU3LS4wNzYtLjA2My0uMDY0LS4wNzctLjA1LS4wNzYtLjA0Ni0uMDktLjAzLS4wODgtLjAyMmgtLjA5bC0uMDkuMDA4LS4wODguMDItLjA4Mi4wMzItLjE0LjA4OC0xNC40NDQgMTIuMjAyIDEuOTggMS42NzIgNy4xNCA2LjAzLjQzNy0uODA1LjQyLS44MjIuNDA4LS44MTcuNDAyLS44MzMuMzgtLjgzNC4zNjMtLjg0NC4zNTYtLjg1Mi4zMzYtLjg1My4zMzQtLjg1OC4zMDYtLjg2My4yOTgtLjg3Mi4yNzktLjg3Ny4yNzMtLjg3OC4yNDYtLjg4Mi4yNDMtLjg5MS4yMjQtLjg5Ny4yMDgtLjg5LjE5MS0uOTAzLjE4LS45MDUuMTQtLjc3NS4wMjUtLjEyNy4xNDUtLjkxLjE2Ny0xLjEzOC4wMDUtLjA5MXptNS4wOS0uMTAydi4yOTRsLS4wMjIuMjk1LS4wMy4yODgtLjIzIDEuNTY4LS4xNjQuOTUxLS4xNzIuOTQ3LS4xOTEuOTQ1LS4yMS45NDQtLjIxNy45NC0uMjM1LjkzNS0uMjU0LjkzLS4yNjguOTI3LS4yNzkuOTI0LS4yOTIuOTE1LS4zMTIuOTE2LS4zMTcuOTEtLjM0NC45MDItLjM1Ljg5Ny0uMzY5Ljg5LS4zODMuODgzLS4zOTMuODgzLS40MDguODcyLS40MjYuODY0LS40MzIuODYtLjQ1MS44NS0uNDY1Ljg0Ny0uNDc2LjgzOS0uNDkyLjgyNS0uNTAzLjgyMi0uNTEzLjgxMS0uNTI4LjgwOS0uNTQ3Ljc5Mi0uNTU1Ljc4Ni0uNTY2Ljc3Ni0uNTguNzctLjU5Ljc2MS0uNjA0Ljc0OC0uNjE1LjczNy0uNjI2LjczMi0uNjQyLjcyMy0uNjQ4LjcwNC0uNjYyLjY5OS0uNjcyLjY5My0uNjguNjctLjY5NS42NjYtLjcwNS42Ni0uNzE0LjY0MS0uNzI0LjYzNS0uNzM4LjYxMy0uNzQ2LjYwOC0uNzUuNTk3LS43NjIuNTgzLS43NzcuNTctLjc4MS41NTgtLjc4OC41NS0uODAzLjUzMy0uODAxLjUxNy0xLjMyLS44NjYtLjc5Ni0uNTM3LS43OS0uNTUtLjc3Ny0uNTY5LS43NjUtLjU3Ny0uNzU0LS41OTctLjc1Mi0uNi0uNzM2LS42MTUtLjcyNy0uNjI3LS43MTktLjYzNi0uNzEtLjY1NC0uNjk0LS42Ni0uNjg3LS42NzEtLjY4LS42ODUtLjY2Mi0uNjk4LS42NTYtLjcwNC0uNjQyLS43MTMtLjYzLS43MjgtLjYyMi0uNzM4LS42MDQtLjc0Mi0uNi0uNzU2LS41ODItLjc2Ny0uNTczLS43NzYtLjU1My0uNzgxLS41NDktLjc5NS0uNTMzLS44LS41MjItLjgwNi0uNTA5LS44MjItLjQ5NS0uODI1LS40ODMtLjgzMy0uNDY1LS44NDQtLjQ2LS44NDctLjQzNy0uODU4LS40MjYtLjg2NC0uNDIxLS44NzItLjM5NC0uODc3LS4zODgtLjg4My0uMzc1LS44ODUtLjM1Ny0uODk3LS4zNDItLjkwMi0uMzMtLjkwMi0uMzEzLS45MTUtLjMtLjkxNi0uMjg1LS45MjItLjI3My0uOTI0LS4yNTQtLjkyNi0uMjQ0LS45MzgtLjIyMS0uOTM1LS4yMTYtLjk0LS4xOTEtLjk1LS4xODQtLjk0NS0uMTY2LS45NDktLjE1My0uOTU0LS4xMzQtLjk1NC0uMDQ0LS41NS0uMDA4LS4yOS4wMTQtLjI5Ni4wMjQtLjI4Ni4wMzgtLjI4OS4wNi0uMjg2LjA2My0uMjkyLjA4LS4yNjYuMDAyLS4wMDkuMTAxLS4yNzQuMTEtLjI3LjEyNi0uMjcuMTM0LS4yNTUuMTUzLS4yNS4xNTgtLjIzNC4xNzgtLjI0LjE4Ni0uMjIyLjE5Ni0uMjEyLjIxMS0uMjA2LjIxNi0uMTkzLjIzLS4xODQuMjM1LS4xNjUuMjQtLjE2Mi4yNTctLjE0NiAxLjU0LS44MDMuNzkyLS4zOS43OTYtLjM3Mi44MDYtLjM1Ny44MDktLjM1NS44Mi0uMzI1LjgyLS4zMjEuODI4LS4zMDUuODMxLS4yOS44NDItLjI3NC44MzctLjI2Mi44NDctLjI0NC44NTMtLjIzMS44NTMtLjIxOC44NTgtLjIwNi44NTktLjE4NC44NjQtLjE3My44NjYtLjE2My44Ny0uMTM3Ljg3MS0uMTMuODczLS4xMTUuODc3LS4wOTYuODc3LS4wODMuODc4LS4wNzEuODgtLjA1Mi44ODMtLjAzNi44NzgtLjAyOC44ODMtLjAwNSAxLjczNi4wMzMuODc3LjAzNi44OC4wNTIuODc4LjA2My44NzcuMDg2Ljg3OC4wOTYuODcyLjExNS44NzIuMTI3Ljg3LjE0My44NjYuMTU2Ljg2My4xNzYuODY3LjE4NS44NS4yMDYuODU5LjIxNy44NDcuMjMxLjg0NC4yNDIuODQ4LjI2NC44My4yNzUuODM1LjI4Ni44MjguMzA4LjgyNi4zMTQuODE0LjMzNS44MTUuMzQ3LjguMzU0LjgwMi4zOC43ODcuMzg1Ljc5LjQwMi43NzYuNDEyLjQ3LjI4Ni4yMzYuMTY4LjIzLjE3OS4yMTUuMTkyLjIxLjIwNi4xOTcuMjEuMTkyLjIyNS4xNzIuMjI4LjE2NC4yNDUuMTUzLjI1LjE0LjI1Ni4xMjUuMjY0LjExLjI2Ni4xMDQuMjc4LjAxMy4wNDR2LjAwM2wuMDY2LjIyOC4wNzQuMjg2LjA1NC4yODQuMDQ3LjI4OC4wMjQuMjk0LjAxNC4yOXoiLz4KICAgICAgICA8cGF0aCBmaWxsPSIjMDAwIiBkPSJNNTMuODU1IDkuNjg1bC0uMTU3LS4xMjMtLjE2NS0uMTE3LS4xNzItLjEwMy0uMTc2LS4wOTFMNTMgOS4xNzNsLS4xOS0uMDYzLS4xOS0uMDQ2LS4xOTYtLjAzOS0uMTk0LS4wMThMNTIuMDI3IDlsLS4xOTYuMDA3LS4xOTUuMDI1LS4xOTYuMDMyLS4xOTcuMDUyLS4xOS4wNjQtLjE3Ni4wNzgtLjE4NC4wOTgtLjE2NS4xMDMtLjI3Ny4yMDgtMS41IDEuMjg4LTE0LjM2NSAxMi4zMy0zLjkzNSAzLjM3OC0xLjMyMiAxLjE0LS4yMDIuMTU1LS4xNjUuMTAzLS4xNjUuMDkxLS4xNy4wNzgtLjE4My4wNjMtLjE3OS4wNTMtLjE4OC4wMzItLjE5LjAyLS4xODUuMDEyLS4yNTItLjAxMS0uMTktLjAzMi0uMTgzLS4wNC0uMTg0LS4wNTItLjE3Ni0uMDctLjE3Mi0uMDc4LS4xNjMtLjA5OC0uMTU5LS4xMS0uMTUyLS4xMTYtMS4zMjItMS4xNC0zLjkzNS0zLjM3OEw2LjI1IDEwLjk1NSA0Ljc1MSA5LjY2N2wtLjE1OC0uMTI0LS4xNjYtLjExNi0uMTctLjEwNS0uMTc2LS4wODItLjE5LS4wNzgtLjE5LS4wNi0uMTktLjA0NS0uMTk2LS4wMzktLjE5Ny0uMDExTDIuOTE3IDlsLS4xOTcuMDExLS4xOTYuMDItLjE5Ny4wNDctLjE5NC4wNS0uMTg2LjA2Ni0uMTgzLjA4NC0uMTc2LjA5LS4xNy4xMS0uMTU5LjExNkwxIDkuODI3bDQuNTQ3IDMuOTAzLjAwNi4wMDUgMTMuMDkzIDExLjI0IDMuOTM0IDMuMzc4IDEuNjY1IDEuNDMuMjEuMTY5LjIxNC4xNjIuMjIxLjE0Mi4yMzUuMTM3LjIzNC4xMi4yNDYuMTA2LjI0OC4wOTYuMjUzLjA4NC4yNi4wNjQuMjU4LjA1My4yNi4wNDUuMjY1LjAyNi4zNTMuMDEzLjI2Mi0uMDEzLjI2My0uMDE5LjI2Ni0uMDMyLjI2LS4wNTIuMjYtLjA2NC4yNTMtLjA3OC4yNDYtLjA5MS4yNDgtLjEwMy4yNC0uMTE2LjIyNy0uMTMuMjI4LS4xMzguMjIxLS4xNTUuMjgtLjIyNiAxLjY2NC0xLjQzIDMuOTM0LTMuMzc4IDEzLjA5NS0xMS4yNC4wMDQtLjAwNUw1NCA5LjgyN3oiIG9wYWNpdHk9Ii4xMiIvPgogICAgPC9nPjxwYXRoIGZpbGw9IiNjZmQwZDIiIGQ9Ik0yMCwzNWMtOC4yNzEsMC0xNS02LjcyOS0xNS0xNVMxMS43MjksNSwyMCw1czE1LDYuNzI5LDE1LDE1UzI4LjI3MSwzNSwyMCwzNXogTTIwLDUuMjAzJiMxMDsgICAgQzExLjg0MSw1LjIwMyw1LjIwMywxMS44NDEsNS4yMDMsMjBjMCw4LjE1OSw2LjYzOCwxNC43OTcsMTQuNzk3LDE0Ljc5N1MzNC43OTcsMjguMTU5LDM0Ljc5NywyMCYjMTA7ICAgIEMzNC43OTcsMTEuODQxLDI4LjE1OSw1LjIwMywyMCw1LjIwM3oiPgogIDwvcGF0aD48cGF0aCBmaWxsPSIjY2ZkMGQyIiBkPSJNMjAsMzMuMTI1Yy03LjIzNywwLTEzLjEyNS01Ljg4OC0xMy4xMjUtMTMuMTI1UzEyLjc2Myw2Ljg3NSwyMCw2Ljg3NVMzMy4xMjUsMTIuNzYzLDMzLjEyNSwyMCYjMTA7ICAgIFMyNy4yMzcsMzMuMTI1LDIwLDMzLjEyNXogTTIwLDcuMDc4QzEyLjg3NSw3LjA3OCw3LjA3OCwxMi44NzUsNy4wNzgsMjBjMCw3LjEyNSw1Ljc5NywxMi45MjIsMTIuOTIyLDEyLjkyMiYjMTA7ICAgIFMzMi45MjIsMjcuMTI1LDMyLjkyMiwyMEMzMi45MjIsMTIuODc1LDI3LjEyNSw3LjA3OCwyMCw3LjA3OHoiPgogIDwvcGF0aD48cGF0aCBmaWxsPSIjM2E0ZTYzIiBzdHJva2U9IiMzYTRlNjMiIHN0cm9rZS13aWR0aD0iMC42MDI3IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik01LjIwMywyMCYjMTA7JiM5OyYjOTsmIzk7YzAtOC4xNTksNi42MzgtMTQuNzk3LDE0Ljc5Ny0xNC43OTdWNUMxMS43MjksNSw1LDExLjcyOSw1LDIwczYuNzI5LDE1LDE1LDE1di0wLjIwM0MxMS44NDEsMzQuNzk3LDUuMjAzLDI4LjE1OSw1LjIwMywyMHoiIHRyYW5zZm9ybT0icm90YXRlKDApIj4KICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgZnJvbT0iMCAyMCAyMCIgdG89IjM2MCAyMCAyMCIgY2FsY01vZGU9InNwbGluZSIga2V5U3BsaW5lcz0iMC40LCAwLCAwLjIsIDEiIGtleVRpbWVzPSIwOzEiIGR1cj0iMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+ICAgICAgCiAgIDwvcGF0aD48cGF0aCBmaWxsPSIjZTc0YzNjIiBzdHJva2U9IiNlNzRjM2MiIHN0cm9rZS13aWR0aD0iMC4yMDI3IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIGQ9Ik03LjA3OCwyMCYjMTA7ICBjMC03LjEyNSw1Ljc5Ny0xMi45MjIsMTIuOTIyLTEyLjkyMlY2Ljg3NUMxMi43NjMsNi44NzUsNi44NzUsMTIuNzYzLDYuODc1LDIwUzEyLjc2MywzMy4xMjUsMjAsMzMuMTI1di0wLjIwMyYjMTA7ICBDMTIuODc1LDMyLjkyMiw3LjA3OCwyNy4xMjUsNy4wNzgsMjB6IiB0cmFuc2Zvcm09InJvdGF0ZSgwKSI+CiAgIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBmcm9tPSIwIDIwIDIwIiB0bz0iMzYwIDIwIDIwIiBkdXI9IjEuOHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgICA8L3BhdGg+PC9nPjwvc3ZnPg==';
