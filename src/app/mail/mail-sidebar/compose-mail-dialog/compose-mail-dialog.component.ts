import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ComposeMailComponent } from '../compose-mail/compose-mail.component';

@Component({
  selector: 'app-compose-mail-dialog',
  templateUrl: './compose-mail-dialog.component.html',
  styleUrls: ['./compose-mail-dialog.component.scss', './../mail-sidebar.component.scss']
})
export class ComposeMailDialogComponent {
  @Input() public isComposeVisible: boolean;

  @Output() public onHide = new EventEmitter<boolean>();

  @ViewChild(ComposeMailComponent) composeMail: ComposeMailComponent;
  @ViewChild('confirmDiscardModal') confirmDiscardModal;

  private confirmModalRef: NgbModalRef;

  constructor(private modalService: NgbModal) {
  }

  onClose() {
    if (this.composeMail.hasData()) {
      this.confirmModalRef = this.modalService.open(this.confirmDiscardModal, {
        centered: true,
        windowClass: 'modal-sm users-action-modal'
      });
    }
    else if (this.composeMail.draftMail && this.composeMail.draftMail.id) {
      this.discardEmail();
    }
    else {
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

  onDiscard() {
    this.hideMailComposeDialog();
  }

  private hideMailComposeDialog() {
    if (this.confirmModalRef) {
      this.confirmModalRef.dismiss();
    }
    this.onHide.emit(true);
  }

}
