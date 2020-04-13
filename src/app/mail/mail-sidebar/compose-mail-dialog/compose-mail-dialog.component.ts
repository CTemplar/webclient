import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
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
export class ComposeMailDialogComponent implements OnInit, AfterViewInit {
  @Input() public isComposeVisible: boolean;
  @Input() public receivers: string[];
  @Input() public draft: Mail;
  @Input() public isFullScreen: boolean;

  @Output() public hide = new EventEmitter<boolean>();
  @Output() public minimize = new EventEmitter<boolean>();
  @Output() public fullScreen = new EventEmitter<boolean>();

  @ViewChild(ComposeMailComponent) composeMail: ComposeMailComponent;
  @ViewChild('confirmDiscardModal') confirmDiscardModal;
  shortcuts: ShortcutInput[] = [];
  @ViewChild('input') input: ElementRef;
  @ViewChild(KeyboardShortcutsComponent) private keyboard: KeyboardShortcutsComponent;


  isMinimized: boolean;
  private confirmModalRef: NgbModalRef;
  mailSubject = '';

  constructor(private modalService: NgbModal,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (this.draft) {
      this.mailSubject = this.draft.subject;
    }
  }

  ngAfterViewInit(): void {
    this.shortcuts = getComposeMailDialogShortcuts(this);

    this.cdr.detectChanges();
  }

  onClose() {
    if (this.composeMail.hasData()) {
      this.saveInDrafts();
    } else if (this.composeMail.draftMail && this.composeMail.draftMail.id) {
      this.discardEmail();
    }
  }

  subjectChanged($event) {
    this.mailSubject = $event;
  }

  saveInDrafts() {
    this.composeMail.saveInDrafts();
  }

  discardEmail() {
    this.composeMail.discardEmail();
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
