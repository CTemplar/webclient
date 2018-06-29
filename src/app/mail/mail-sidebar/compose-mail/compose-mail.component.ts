import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
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
export class ComposeMailComponent implements OnChanges, AfterViewInit {
  @Input() public isComposeVisible: boolean;

  @Output() public onHide = new EventEmitter<boolean>();

  @ViewChild('editor') editor;
  @ViewChild('toolbar') toolbar;
  @ViewChild('attachImagesModal') attachImagesModal;

  colors = colors;

  private quill: any;
  private autoSaveSubscription: Subscription;
  private AUTO_SAVE_DURATION: number = 10000; // duration in milliseconds
  private confirmModalRef: NgbModalRef;
  private attachImagesModalRef: NgbModalRef;
  private draftMail: Mail;

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

  onFilesSelected(files: FileList) {
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

  hasContent() {
    return this.editor.nativeElement.innerText.trim() ? true : false;
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
