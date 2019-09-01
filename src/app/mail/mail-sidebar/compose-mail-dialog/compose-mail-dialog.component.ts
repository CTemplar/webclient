import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Mail } from '../../../store/models';
import { ComposeMailComponent } from '../compose-mail/compose-mail.component';
import { KeyboardShortcutsComponent, ShortcutInput } from 'ng-keyboard-shortcuts';
import { getComposeMailDialogShortcuts } from '../../../store/services';

@Component({
  selector: 'app-compose-mail-dialog',
  templateUrl: './compose-mail-dialog.component.html',
  styleUrls: ['./compose-mail-dialog.component.scss', './../mail-sidebar.component.scss']
})
export class ComposeMailDialogComponent implements AfterViewInit {
  @Input() public isComposeVisible: boolean;
  @Input() public receivers: string[];
  @Input() public draft: Mail;

  @Output() public hide = new EventEmitter<boolean>();
  @Output() public minimize = new EventEmitter<boolean>();
  @Output() public fullScreen = new EventEmitter<boolean>();

  @ViewChild(ComposeMailComponent, { static: false }) composeMail: ComposeMailComponent;
  @ViewChild('confirmDiscardModal', { static: false }) confirmDiscardModal;
   shortcuts: ShortcutInput[] = [];
  @ViewChild('input', { static: false }) input: ElementRef;
  @ViewChild(KeyboardShortcutsComponent, { static: false }) private keyboard: KeyboardShortcutsComponent;


  isMinimized: boolean;
  isFullScreen: boolean;
  private confirmModalRef: NgbModalRef;

  constructor(private modalService: NgbModal,
              private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    this.shortcuts = getComposeMailDialogShortcuts(this);
    // this.keyboard.select('escape').subscribe(e => {
    //   this.onClose();
    //   console.log(e + 'pressed ');
    // });

    this.cdr.detectChanges();
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
