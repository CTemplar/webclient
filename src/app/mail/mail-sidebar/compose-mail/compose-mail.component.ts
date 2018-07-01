import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as QuillNamespace from 'quill';
import { Subscription } from 'rxjs/Subscription';
import { timer } from 'rxjs/observable/timer';
import { colors } from '../../../shared/config';
import { CreateMail, DeleteMail } from '../../../store/actions';
import { Store } from '@ngrx/store';
import { AppState, MailState } from '../../../store/datatypes';
import { Mail } from '../../../store/models';

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
export class ComposeMailComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() public isComposeVisible: boolean;

  @Output() public onHide = new EventEmitter<boolean>();

  @ViewChild('editor') editor;
  @ViewChild('toolbar') toolbar;
  @ViewChild('attachImagesModal') attachImagesModal;
  @ViewChild('selfDestructModal') selfDestructModal;
  @ViewChild('encryptionModal') encryptionModal;

  colors = colors;
  options: any = {};
  selfDestructDateTime: any = {};

  private quill: any;
  private autoSaveSubscription: Subscription;
  private AUTO_SAVE_DURATION: number = 10000; // duration in milliseconds
  private confirmModalRef: NgbModalRef;
  private attachImagesModalRef: NgbModalRef;
  private selfDestructModalRef: NgbModalRef;
  private encryptionModalRef: NgbModalRef;
  private draftMail: Mail;
  private attachments: Array<any> = [];
  private signature: string;

  constructor(private modalService: NgbModal,
              private store: Store<AppState>) {

    this.store.select((state: AppState) => state.mail)
      .subscribe((response: MailState) => {
        if (response.draft) {
          this.draftMail = response.draft;
        }
      });
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

  ngOnInit() {
    const now = new Date();
    this.selfDestructDateTime.minDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDay() + 1
    };
    this.signature = 'Sent from CTempler'; // TODO: add API call to retrieve signature from backend
  }

  initializeQuillEditor() {
    this.quill = new Quill(this.editor.nativeElement, {
      modules: {
        toolbar: this.toolbar.nativeElement
      }
    });
    this.quill.getModule('toolbar').addHandler('image', () => {
      this.quillImageHandler();
    });
  }

  initializeAutoSave() {
    this.autoSaveSubscription = timer(this.AUTO_SAVE_DURATION, this.AUTO_SAVE_DURATION)
      .subscribe(t => {
        this.updateEmail();
      });
  }

  quillImageHandler() {
    this.attachImagesModalRef = this.modalService.open(this.attachImagesModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
  }

  onImagesSelected(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (/^image\//.test(file.type)) {
        const fileReader = new FileReader();
        fileReader.onload = (event: any) => {
          this.embedImageInQuill(event.target.result);
        };
        fileReader.readAsDataURL(file);
      }
      else {
        // TODO: add error notification here
      }
    }
  }

  onFilesSelected(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file: any = files.item(i);
      // TODO: replace this id with value returned from backend
      file.id = performance.now();
      this.attachments.push(file);
      // TODO: add API call for uploading the file
    }
  }

  onAttachImageURL(url: string) {
    this.embedImageInQuill(url);
    this.attachImagesModalRef.dismiss();
  }

  onClose(modalRef: any) {
    if (this.hasContent()) {
      this.confirmModalRef = this.modalService.open(modalRef, {
        centered: true,
        windowClass: 'modal-sm users-action-modal'
      });
    } else {
      this.hideMailComposeModal();
    }
  }

  cancelDiscard() {
    this.confirmModalRef.close();
  }

  saveInDrafts() {
    this.updateEmail();
    this.hideMailComposeModal();
  }

  discardEmail() {
    if (this.draftMail && this.draftMail.id) {
      this.store.dispatch(new DeleteMail(this.draftMail.id));
    }
    this.hideMailComposeModal();
  }

  removeAttachment(file: any) {
    const index = this.attachments.findIndex(attachment => attachment.id === file.id);
    if (index > -1) {
      // TODO: add API call for removing this file
      this.attachments.splice(index, 1);
    }
  }

  addSignature() {
    const index = this.quill.getLength();
    this.quill.clipboard.dangerouslyPasteHTML(index, this.signature);
  }

  openSelfDestructModal() {
    this.selfDestructModalRef = this.modalService.open(this.selfDestructModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
  }

  openEncryptionModal() {
    this.encryptionModalRef = this.modalService.open(this.encryptionModal, {
      centered: true,
      windowClass: 'modal-md users-action-modal'
    });
  }

  hasContent() {
    return this.editor.nativeElement.innerText.trim() ? true : false;
  }

  getFileSize(file: File): string {
    let size = file.size;
    if (size < 1000) {
      return `${size} B`;
    }
    else {
      size = +(size / 1000).toFixed(2);
      if (size < 1000) {
        return `${size} KB`;
      }
      else {
        return `${+(size / 1000).toFixed(2)} MB`;
      }
    }
  }

  private embedImageInQuill(value: string) {
    if (value) {
      const selection = this.quill.getSelection();
      const index = selection ? selection.index : this.quill.getLength();
      this.quill.insertEmbed(index, 'image', value);
      this.quill.setSelection(index + 1);
    }
  }

  private updateEmail() {
    if (!this.draftMail) {
      this.draftMail = { content: null, mailbox: 1, folder: 'draft' };
    }
    if (!this.hasContent() || this.draftMail.content === this.editor.nativeElement.innerHTML) {
      return;
    }
    this.draftMail.content = this.editor.nativeElement.innerHTML;
    this.store.dispatch(new CreateMail({ ...this.draftMail }));
  }

  private hideMailComposeModal() {
    this.onHide.emit(true);
    this.draftMail = null;
    this.unSubscribeAutoSave();
  }

  private unSubscribeAutoSave() {
    if (this.autoSaveSubscription) {
      this.autoSaveSubscription.unsubscribe();
    }
    if (this.confirmModalRef) {
      this.confirmModalRef.close();
    }
  }
}
