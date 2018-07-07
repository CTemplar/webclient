import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatKeyboardComponent, MatKeyboardRef, MatKeyboardService } from '@ngx-material-keyboard/core';
import * as QuillNamespace from 'quill';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { timer } from 'rxjs/observable/timer';
import { COLORS } from '../../../shared/config';
import { CreateMail, DeleteMail } from '../../../store/actions';
import { Store } from '@ngrx/store';
import { AppState, MailState, UserState } from '../../../store/datatypes';
import { Mail, Mailbox } from '../../../store/models';
import { OpenPgpService } from '../../../store/services/openpgp.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';

const Quill: any = QuillNamespace;

const FontAttributor = Quill.import('attributors/class/font');
FontAttributor.whitelist = [
  'hiragino-sans', 'lato', 'roboto', 'abril-fatface', 'andale-mono', 'arial', 'times-new-roman'
];
Quill.register(FontAttributor, true);
Quill.register(Quill.import('attributors/style/align'), true);
Quill.register(Quill.import('attributors/style/background'), true);
Quill.register(Quill.import('attributors/style/color'), true);
Quill.register(Quill.import('attributors/style/font'), true);
Quill.register(Quill.import('attributors/style/size'), true);

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value; // to get value in input tag
    const confirmPassword = AC.get('confirmPwd').value; // to get value in input tag
    if (password !== confirmPassword) {
      AC.get('confirmPwd').setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }
}

@TakeUntilDestroy()
@Component({
  selector: 'app-compose-mail',
  templateUrl: './compose-mail.component.html',
  styleUrls: ['./compose-mail.component.scss', './../mail-sidebar.component.scss']
})
export class ComposeMailComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  @Input() public isComposeVisible: boolean;

  @Output() public onHide = new EventEmitter<boolean>();

  @ViewChild('editor') editor;
  @ViewChild('toolbar') toolbar;
  @ViewChild('attachImagesModal') attachImagesModal;
  @ViewChild('selfDestructModal') selfDestructModal;
  @ViewChild('encryptionModal') encryptionModal;

  colors = COLORS;
  mailData: any = {};
  options: any = {};
  selfDestructDateTime: any = {};
  attachments: Array<any> = [];
  isKeyboardOpened: boolean;
  mailbox: Mailbox;
  encryptForm: FormGroup;

  private quill: any;
  private autoSaveSubscription: Subscription;
  private AUTO_SAVE_DURATION: number = 10000; // duration in milliseconds
  private confirmModalRef: NgbModalRef;
  private attachImagesModalRef: NgbModalRef;
  private selfDestructModalRef: NgbModalRef;
  private encryptionModalRef: NgbModalRef;
  private draftMail: Mail;
  private signature: string;
  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;
  private defaultLocale: string = 'US International';

  readonly destroyed$: Observable<boolean>;

  constructor(private modalService: NgbModal,
              private store: Store<AppState>,
              private formBuilder: FormBuilder,
              private openPgpService: OpenPgpService,
              private _keyboardService: MatKeyboardService) {

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
      } else {
        this.unSubscribeAutoSave();
      }
    }
  }

  ngOnInit() {
    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailboxes) => {
        if (mailboxes.mailboxes[0]) {
          this.mailbox = mailboxes.mailboxes[0];
        }
      });
    this.store.select(state => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.signature = user.settings.signature;
      });

    const now = new Date();
    this.selfDestructDateTime.minDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDay() + 1
    };

    this.encryptForm = this.formBuilder.group({
      'password': ['', [Validators.required]],
      'confirmPwd': ['', [Validators.required]],
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  ngOnDestroy(): void {
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
      } else {
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
    if (this.hasData()) {
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
    this.quill.insertText(index, this.signature);
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

  toggleOSK() {
    if (this._keyboardService.isOpened) {
      this.closeOSK();
    }
    else {
      this._keyboardRef = this._keyboardService.open(this.defaultLocale, {});
      this.isKeyboardOpened = true;
    }
  }

  closeOSK() {
    if (this._keyboardRef) {
      this._keyboardRef.dismiss();
      this.isKeyboardOpened = false;
    }
  }

  hasData() {
    // using >1 because there is always a blank line represented by ‘\n’ (quill docs)
    return this.quill.getLength() > 1 ||
      this.mailData.receiver || this.mailData.cc || this.mailData.bcc || this.mailData.subject;
  }

  getFileSize(file: File): string {
    let size = file.size;
    if (size < 1000) {
      return `${size} B`;
    } else {
      size = +(size / 1000).toFixed(2);
      if (size < 1000) {
        return `${size} KB`;
      } else {
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

  private async updateEmail() {
    if (!this.draftMail) {
      this.draftMail = { content: null, mailbox: this.mailbox.id, folder: 'draft' };
    }
    if (this.hasData()) {
      // TODO: using comma separator until these inputs are replaced with tag-input plugin
      this.draftMail.receiver = this.mailData.receiver ? this.mailData.receiver.split(',') : [];
      this.draftMail.cc = this.mailData.cc ? this.mailData.cc.split(',') : [];
      this.draftMail.bcc = this.mailData.bcc ? this.mailData.bcc.split(',') : [];
      this.draftMail.subject = this.mailData.subject;
      this.draftMail.content = await this.openPgpService.makeEncrypt(this.editor.nativeElement.firstChild.innerHTML);
      this.store.dispatch(new CreateMail({ ...this.draftMail }));
    }
  }

  private hideMailComposeModal() {
    this.mailData = {};
    this.options = {};
    this.quill.setText('');
    this.draftMail = null;
    this.unSubscribeAutoSave();
    this.onHide.emit(true);
  }

  private unSubscribeAutoSave() {
    if (this.autoSaveSubscription) {
      this.autoSaveSubscription.unsubscribe();
    }
    if (this.confirmModalRef) {
      this.confirmModalRef.close();
    }
  }

  private messageEncrypt() {
    if (this.encryptForm.valid) {
      this.openPgpService.generateKey(this.encryptForm.value.password);
      this.openPgpService.makeEncrypt(this.editor.nativeElement.firstChild.innerHTML).then(() => {
        // TODO: api call for message encryption
        // this.openPgpService.makeDecrypt(this.openPgpService.encrypted);
      } );
    }
    // this.openPgpService.makeDecrypt(this.openPgpService.encrypted);

  }
}
