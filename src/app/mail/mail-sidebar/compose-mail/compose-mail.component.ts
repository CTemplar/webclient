import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as QuillNamespace from 'quill';
import { Subscription } from 'rxjs/Subscription';
import { timer } from 'rxjs/observable/timer';
import { colors } from '../../../shared/config';

const Quill: any = QuillNamespace;

const FontAttributor = Quill.import('attributors/class/font');
FontAttributor.whitelist = [
  'hiragino-sans', 'lato', 'roboto', 'abril-fatface', 'andale-mono', 'arial', 'times-new-roman'
];
Quill.register(FontAttributor, true);

@Component({
  selector: 'app-compose-mail',
  templateUrl: './compose-mail.component.html',
  styleUrls: ['./compose-mail.component.scss', './../mail-sidebar.component.scss']
})
export class ComposeMailComponent implements OnChanges, AfterViewInit {
  @Input() public isComposeVisible: boolean;

  @Output() public onHide = new EventEmitter<boolean>();

  @ViewChild('editor') editor;
  @ViewChild('toolbar') toolbar;

  colors = colors;

  private quill: any;
  private emailId: number;
  private autoSaveSubscription: Subscription;
  private AUTO_SAVE_DURATION: number = 10000; // duration in milliseconds
  private confirmModalRef: NgbModalRef;

  constructor(private modalService: NgbModal) {
  }

  ngAfterViewInit() {
    this.initializeQuillEditor();
  }

  ngOnChanges(changes: any) {
    if (changes.isComposeVisible) {
      if (changes.isComposeVisible.currentValue === true) {
        this.initializeAutoSave();
      }
      else {
        this.unSubscribeAutoSave();
      }
    }
  }

  initializeQuillEditor() {
    this.quill = new Quill(this.editor.nativeElement, {
      modules: {
        toolbar: this.toolbar.nativeElement
      }
    });
  }

  initializeAutoSave() {
    this.autoSaveSubscription = timer(this.AUTO_SAVE_DURATION, this.AUTO_SAVE_DURATION)
      .subscribe(t => {
        this.updateEmail();
      });
  }

  onClose(modalRef: any) {
    // TODO: Add check to see if user entered any content
    this.confirmModalRef = this.modalService.open(modalRef, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
  }

  cancelDiscard() {
    this.confirmModalRef.close();
  }

  saveInDrafts() {
    this.confirmModalRef.close();
    this.hideMailComposeModal();
  }

  discardEmail() {
    this.confirmModalRef.close();
    // TODO: Add API call to delete email
    this.hideMailComposeModal();
  }

  private updateEmail() {
    if (this.emailId) {
      // TODO: Add API call for updating email
    }
    else {
      this.createEmail();
    }
  }

  private createEmail() {
    // TODO: Add API call for creating email. Store returned id to this.emailId
    this.emailId = 10;
  }

  private hideMailComposeModal() {
    this.onHide.emit(true);
    this.emailId = null;
    this.unSubscribeAutoSave();
  }

  private unSubscribeAutoSave() {
    if (this.autoSaveSubscription) {
      this.autoSaveSubscription.unsubscribe();
    }
  }
}
