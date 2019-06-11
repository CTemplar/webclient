import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Mail } from '../../../store/models';
import { ComposeMailComponent } from '../compose-mail/compose-mail.component';

@Component({
  selector: 'app-compose-mail-dialog',
  templateUrl: './compose-mail-dialog.component.html',
  styleUrls: ['./compose-mail-dialog.component.scss', './../mail-sidebar.component.scss']
})
export class ComposeMailDialogComponent {
  @Input() public isComposeVisible: boolean;
  @Input() public receivers: string[];
  @Input() public draft: Mail;

  @Output() public hide = new EventEmitter<boolean>();
  @Output() public minimize = new EventEmitter<boolean>();
  @Output() public fullScreen = new EventEmitter<boolean>();

  @ViewChild(ComposeMailComponent, { static: false }) composeMail: ComposeMailComponent;
  @ViewChild('confirmDiscardModal', { static: false }) confirmDiscardModal;

  isMinimized: boolean;
  isFullScreen: boolean;
  private confirmModalRef: NgbModalRef;

  constructor(private modalService: NgbModal) {
  }

  onClose() {
    if (this.composeMail.hasData()) {
      this.confirmModalRef = this.modalService.open(this.confirmDiscardModal, {
        centered: true,
        windowClass: 'modal-sm users-action-modal'
      });
    } else if (this.composeMail.draftMail && this.composeMail.draftMail.id) {
      this.discardEmail();
    } else {
      this.hideMailComposeDialog();
    }
  }

  saveInDrafts() {
    this.composeMail.saveInDrafts();
    this.hideMailComposeDialog();
  }

  discardEmail() {
    this.composeMail.discardEmail();
    this.hideMailComposeDialog();
  }

  onHide() {
    this.hideMailComposeDialog();
  }

  toggleMinimized() {
    this.isMinimized = !this.isMinimized;
    this.minimize.emit(this.isMinimized);
    if (this.isFullScreen) {
      this.isFullScreen = false;
    }
  }

  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
    this.fullScreen.emit(this.isFullScreen);
    if (this.isMinimized) {
      this.isMinimized = false;
    }
  }

  private hideMailComposeDialog() {
    if (this.confirmModalRef) {
      this.confirmModalRef.dismiss();
    }
    this.hide.emit(true);
  }

}
