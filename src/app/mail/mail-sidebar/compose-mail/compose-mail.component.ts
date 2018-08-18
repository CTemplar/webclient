import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { MatKeyboardComponent, MatKeyboardRef, MatKeyboardService } from '@ngx-material-keyboard/core';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import * as Parchment from 'parchment';
import * as QuillNamespace from 'quill';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { COLORS, ESCAPE_KEYCODE } from '../../../shared/config';
import { FilenamePipe } from '../../../shared/pipes/filename.pipe';
import { FilesizePipe } from '../../../shared/pipes/filesize.pipe';
import {
  CloseMailbox,
  DeleteAttachment,
  GetUsersKeys,
  MoveMail,
  NewDraft,
  SendMail,
  SnackErrorPush,
  UpdateLocalDraft,
  UploadAttachment
} from '../../../store/actions';
import { AppState, AuthState, ComposeMailState, Contact, Draft, MailBoxesState, MailState, UserState } from '../../../store/datatypes';
import { Attachment, Mail, Mailbox, MailFolderType } from '../../../store/models';
import { DateTimeUtilService } from '../../../store/services/datetime-util.service';
import { OpenPgpService } from '../../../store/services/openpgp.service';

const Quill: any = QuillNamespace;

const FontAttributor = Quill.import('attributors/style/font');
FontAttributor.whitelist = [
  'hiragino-sans', 'lato', 'roboto', 'abril-fatface', 'andale-mono', 'arial', 'times-new-roman'
];
Quill.register(FontAttributor, true);

const SizeAttributor = Quill.import('attributors/style/size');
SizeAttributor.whitelist = ['10px', '18px', '32px'];
Quill.register(SizeAttributor, true);
Quill.register(Quill.import('attributors/style/align'), true);
Quill.register(Quill.import('attributors/style/background'), true);
Quill.register(Quill.import('attributors/style/color'), true);

const QuillBlockEmbed = Quill.import('blots/block/embed');

class BlockEmbed extends Parchment.default.Embed {
}

BlockEmbed.prototype = QuillBlockEmbed.prototype;

class ImageBlot extends BlockEmbed {
  static create(value) {
    const node: any = super.create(value);
    node.setAttribute('src', value.url);
    if (value.content_id) {
      node.setAttribute('data-content-id', value.content_id);
    }
    return node;
  }

  static value(node) {
    return {
      content_id: node.getAttribute('data-content-id'),
      url: node.getAttribute('src')
    };
  }
}

ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';

Quill.register(ImageBlot);

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
export class ComposeMailComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() receivers: Array<string>;
  @Input() cc: Array<string>;
  @Input() content: string;
  @Input() draftMail: Mail;

  @Output() hide: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('editor') editor;
  @ViewChild('toolbar') toolbar;
  @ViewChild('attachImagesModal') attachImagesModal;
  @ViewChild('selfDestructModal') selfDestructModal;
  @ViewChild('delayedDeliveryModal') delayedDeliveryModal;
  @ViewChild('deadManTimerModal') deadManTimerModal;
  @ViewChild('encryptionModal') encryptionModal;

  draftId: number;
  colors = COLORS;
  mailData: any = {};
  options: any = {};
  selfDestruct: any = {};
  delayedDelivery: any = {};
  deadManTimer: any = {};
  attachments: Attachment[] = [];
  isKeyboardOpened: boolean;
  mailbox: Mailbox;
  encryptForm: FormGroup;
  contacts: Contact[];
  datePickerMinDate: NgbDateStruct;
  valueChanged$: Subject<any> = new Subject<any>();
  inProgress: boolean;
  isLoaded: boolean;
  showEncryptFormErrors: boolean;

  private quill: any;
  private autoSaveSubscription: Subscription;
  private DEBOUNCE_DURATION: number = 5000; // duration in milliseconds
  private attachImagesModalRef: NgbModalRef;
  private selfDestructModalRef: NgbModalRef;
  private delayedDeliveryModalRef: NgbModalRef;
  private deadManTimerModalRef: NgbModalRef;
  private encryptionModalRef: NgbModalRef;
  private signature: string;
  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;
  private defaultLocale: string = 'US International';

  readonly destroyed$: Observable<boolean>;
  private draft: Draft;
  private attachmentsQueue: Array<Attachment> = [];
  private inlineAttachmentContentIds: Array<string> = [];
  private mailBoxesState: MailBoxesState;
  private isSignatureAdded: boolean;
  private isAuthenticated: boolean;
  public userState: UserState;
  private decryptedContent: string;

  constructor(private modalService: NgbModal,
              private store: Store<AppState>,
              private formBuilder: FormBuilder,
              private openPgpService: OpenPgpService,
              private _keyboardService: MatKeyboardService,
              private dateTimeUtilService: DateTimeUtilService,
              private filesizePipe: FilesizePipe,
              private filenamePipe: FilenamePipe) {

  }

  ngOnInit() {
    this.initializeDraft();
    this.initializeAutoSave();
    this.resetMailData();

    this.store.select((state: AppState) => state.composeMail).takeUntil(this.destroyed$)
      .subscribe((response: ComposeMailState) => {
        const draft = response.drafts[this.draftId];
        if (draft) {
          this.draftMail = draft.draft;
          this.inProgress = draft.inProgress;
          if (draft.draft) {
            if (draft.draft.id && this.attachmentsQueue.length > 0) {
              this.attachmentsQueue.forEach(attachment => {
                attachment.message = draft.draft.id;
                this.store.dispatch(new UploadAttachment({ ...attachment }));
              });
              this.attachmentsQueue = [];
            }
          }
          if (!this.inProgress) {
            this.handleAttachment(draft);
          }
        }

        this.draft = draft;
      });

    this.store.select((state: AppState) => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.contacts = user.contact;
        this.userState = user;
        this.signature = user.settings.signature;
        this.addSignature();
      });

    this.store.select((state: AppState) => state.auth).takeUntil(this.destroyed$)
      .subscribe((authState: AuthState) => {
        this.isAuthenticated = authState.isAuthenticated;
      });

    this.store.select(state => state.mailboxes).takeUntil(this.destroyed$)
      .subscribe((mailBoxesState: MailBoxesState) => {
        if (mailBoxesState.mailboxes[0]) {
          this.mailbox = mailBoxesState.mailboxes[0];
        }
        this.mailBoxesState = mailBoxesState;
      });

    if (this.draftMail) {
      this.store.select(state => state.mail).takeUntil(this.destroyed$)
        .subscribe((mailState: MailState) => {
          if (!this.decryptedContent) {
            const decryptedContent = mailState.decryptedContents[this.draftMail.id];
            if (decryptedContent && !decryptedContent.inProgress && decryptedContent.content) {
              this.decryptedContent = decryptedContent.content;
              this.addDecryptedContent();
            }
          }
        });
    }

    const now = new Date();
    this.datePickerMinDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate()
    };

    this.encryptForm = this.formBuilder.group({
      'password': ['', [Validators.required]],
      'confirmPwd': ['', [Validators.required]],
      'passwordHint': ['', [Validators.required]]
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  ngAfterViewInit() {
    this.initializeQuillEditor();
  }

  ngOnDestroy(): void {
    if (this.isAuthenticated) {
      this.store.dispatch(new CloseMailbox(this.draft));
    }
  }

  initializeDraft() {
    this.draftId = Date.now();

    if (this.draftMail && this.draftMail.content) {
      this.openPgpService.decrypt(this.draftMail.id, this.draftMail.content);
      this.isSignatureAdded = true;
      this.inlineAttachmentContentIds = this.draftMail.attachments
        .filter((attachment: Attachment) => attachment.is_inline)
        .map(attachment => attachment.content_id);
    }

    if (this.draftMail && this.draftMail.encryption && this.draftMail.encryption.password) {
      this.encryptForm.controls['password'].setValue(this.draftMail.encryption.password);
      this.encryptForm.controls['passwordHint'].setValue(this.draftMail.encryption.password_hint);
    }

    const draft: Draft = {
      id: this.draftId,
      draft: this.draftMail,
      inProgress: false,
      attachments: this.draftMail ? this.draftMail.attachments.map(attachment => {
        attachment.progress = 100;
        attachment.name = this.filenamePipe.transform(attachment.document);
        attachment.draftId = this.draftId;
        attachment.attachmentId = performance.now();
        return attachment;
      }) : [],
      usersKeys: []
    };
    this.store.dispatch(new NewDraft({ ...draft }));
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

    this.quill.on('text-change', (delta, oldDelta, source) => {
      this.valueChanged$.next();
    });

    if (this.content) {
      this.quill.clipboard.dangerouslyPasteHTML(0, this.content);
    }

    this.addSignature();
  }

  initializeAutoSave() {
    this.autoSaveSubscription = this.valueChanged$
      .pipe(
        debounceTime(this.DEBOUNCE_DURATION)
      )
      .subscribe(data => {
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
    if (!this.draftMail || !this.draftMail.id) {
      this.updateEmail();
    }
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (/^image\//.test(file.type)) {
        this.uploadAttachment(file, true);
      } else {
        // TODO: add error notification here
      }
    }
  }

  onFilesSelected(files: FileList) {
    if (!this.draftMail || !this.draftMail.id) {
      this.updateEmail();
    }
    for (let i = 0; i < files.length; i++) {
      const file: File = files.item(i);
      this.uploadAttachment(file, false);
    }
  }

  uploadAttachment(file: File, isInline = false) {
    const sizeInMBs = file.size / (1024 * 1024);

    if (this.userState.isPrime && sizeInMBs > 25) {
      this.store.dispatch(new SnackErrorPush({ message: 'Maximum allowed file size is 25MB.' }));
    } else if (!this.userState.isPrime && sizeInMBs > 10) {
      this.store.dispatch(new SnackErrorPush({ message: 'Maximum allowed file size is 10MB.' }));
    } else {
      const attachment: Attachment = {
        draftId: this.draftId,
        document: file,
        name: file.name,
        size: this.filesizePipe.transform(file.size),
        attachmentId: performance.now(),
        message: this.draftMail.id,
        is_inline: isInline,
        inProgress: false
      };
      this.attachments.push(attachment);
      if (!this.draftMail.id) {
        this.attachmentsQueue.push(attachment);
      } else {
        this.store.dispatch(new UploadAttachment({ ...attachment }));
      }
    }
  }

  handleAttachment(draft: Draft) {
    // usage Object.assign to create new copy and avoid storing reference of draft.attachments
    this.attachments = Object.assign([], draft.attachments);
    this.attachments.forEach(attachment => {
      if (attachment.is_inline && attachment.progress === 100 && !attachment.isRemoved &&
        attachment.content_id && !this.inlineAttachmentContentIds.includes(attachment.content_id)) {
        this.inlineAttachmentContentIds.push(attachment.content_id);
        this.embedImageInQuill(attachment.document, attachment.content_id);
      }
    });
  }

  onAttachImageURL(url: string) {
    this.embedImageInQuill(url);
    this.attachImagesModalRef.dismiss();
  }

  saveInDrafts() {
    this.updateEmail();
    this.hide.emit();
    this.resetValues();
  }

  discardEmail() {
    if (this.draftMail && this.draftMail.id) {
      this.store.dispatch(new MoveMail({
        ids: this.draftMail.id,
        folder: MailFolderType.TRASH,
        sourceFolder: MailFolderType.DRAFT,
        mail: this.draftMail,
        allowUndo: true
      }));
    }
    this.hide.emit();
    this.resetValues();
  }

  sendEmail() {
    if (this.userState.isPrime) {
      if (this.mailData.receiver.length > 20) {
        this.store.dispatch(new SnackErrorPush({ message: 'Maximum 20 "TO" addresses are allowed.' }));
        return;
      } else if (this.mailData.cc.length > 20) {
        this.store.dispatch(new SnackErrorPush({ message: 'Maximum 20 "CC" addresses are allowed.' }));
        return;
      } else if (this.mailData.bcc.length > 20) {
        this.store.dispatch(new SnackErrorPush({ message: 'Maximum 20 "BCC" addresses are allowed.' }));
        return;
      }
    } else {
      if (this.mailData.receiver.length > 5) {
        this.store.dispatch(new SnackErrorPush({ message: 'Maximum 5 "TO" addresses are allowed.' }));
        return;
      } else if (this.mailData.cc.length > 5) {
        this.store.dispatch(new SnackErrorPush({ message: 'Maximum 5 "CC" addresses are allowed.' }));
        return;
      } else if (this.mailData.bcc.length > 5) {
        this.store.dispatch(new SnackErrorPush({ message: 'Maximum 5 "BCC" addresses are allowed.' }));
        return;
      }
    }
    const receivers: string[] = [
      ...this.mailData.receiver.map(receiver => receiver.display),
      ...this.mailData.cc.map(cc => cc.display),
      ...this.mailData.bcc.map(bcc => bcc.display)
    ];
    if (receivers.length === 0) {
      return false;
    }
    if (receivers.filter(item => item.toLowerCase().indexOf('@ctemplar.com') === -1).length === 0) {
      this.setMailData(true, false, true);
      this.store.dispatch(new GetUsersKeys({ draftId: this.draft.id, emails: receivers.join(',') }));
    } else {
      this.setMailData(false, false);
      this.store.dispatch(new SendMail({ ...this.draft, draft: { ...this.draftMail } }));
    }
    this.resetValues();
    this.hide.emit();
  }

  removeAttachment(attachment: Attachment) {
    this.store.dispatch(new DeleteAttachment(attachment));
  }

  addSignature() {
    if (this.quill && this.signature && !this.isSignatureAdded) {
      const index = this.quill.getLength();
      this.quill.insertText(index, '\n' + this.signature, 'silent');
      this.isSignatureAdded = true;
    }
  }

  addDecryptedContent() {
    if (this.quill && this.decryptedContent) {
      this.quill.setText('');
      this.quill.clipboard.dangerouslyPasteHTML(0, this.decryptedContent, 'silent');
    }
  }

  openSelfDestructModal() {
    if (this.selfDestruct.value) {
      // reset to previous confirmed value
      this.selfDestruct = {
        ...this.selfDestruct,
        ...this.dateTimeUtilService.getNgbDateTimeStructsFromDateTimeStr(this.selfDestruct.value)
      };
    } else {
      this.resetSelfDestructValues();
    }
    this.selfDestructModalRef = this.modalService.open(this.selfDestructModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
  }

  openDelayedDeliveryModal() {
    if (this.delayedDelivery.value) {
      // reset to previous confirmed value
      this.delayedDelivery = {
        ...this.delayedDelivery,
        ...this.dateTimeUtilService.getNgbDateTimeStructsFromDateTimeStr(this.delayedDelivery.value)
      };
    } else {
      this.resetDelayedDeliveryValues();
    }
    this.delayedDeliveryModalRef = this.modalService.open(this.delayedDeliveryModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
  }

  openDeadManTimerModal() {
    if (!this.deadManTimer.value) {
      this.resetDeadManTimerValues();
    }
    this.deadManTimerModalRef = this.modalService.open(this.deadManTimerModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
  }

  openEncryptionModal() {
    if (this.encryptForm.invalid) {
      this.encryptForm.reset();
      if (this.draftMail && this.draftMail.encryption && this.draftMail.encryption.password) {
        this.encryptForm.controls['password'].setValue(this.draftMail.encryption.password);
        this.encryptForm.controls['passwordHint'].setValue(this.draftMail.encryption.password_hint);
      }
    }
    this.encryptionModalRef = this.modalService.open(this.encryptionModal, {
      centered: true,
      windowClass: 'modal-md users-action-modal'
    });
  }

  closeEncryptionModal() {
    this.encryptionModalRef.dismiss();
  }

  toggleOSK() {
    if (this._keyboardService.isOpened) {
      this.closeOSK();
    } else {
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

  setSelfDestructValue() {
    this.selfDestruct.error = null;
    if (this.selfDestruct.date && this.selfDestruct.time) {
      const dateTimeStr = this.dateTimeUtilService.createDateTimeStrFromNgbDateTimeStruct(this.selfDestruct.date,
        this.selfDestruct.time);
      if (this.dateTimeUtilService.isDateTimeInPast(dateTimeStr)) {
        this.selfDestruct.error = 'Selected datetime is in past.';
      } else {
        this.selfDestruct.value = dateTimeStr;
        this.closeSelfDestructModal();
        this.clearDelayedDeliveryValue();
        this.clearDeadManTimerValue();
        this.valueChanged$.next(this.selfDestruct.value);
      }
    }
  }

  clearSelfDestructValue() {
    this.resetSelfDestructValues();
    this.closeSelfDestructModal();
    this.valueChanged$.next(this.selfDestruct.value);
  }

  setDelayedDeliveryValue() {
    if (this.delayedDelivery.date && this.delayedDelivery.time) {
      const dateTimeStr = this.dateTimeUtilService.createDateTimeStrFromNgbDateTimeStruct(this.delayedDelivery.date,
        this.delayedDelivery.time);
      if (this.dateTimeUtilService.isDateTimeInPast(dateTimeStr)) {
        this.delayedDelivery.error = 'Selected datetime is in past.';
      } else {
        this.delayedDelivery.value = dateTimeStr;
        this.closeDelayedDeliveryModal();
        this.clearSelfDestructValue();
        this.clearDeadManTimerValue();
        this.valueChanged$.next(this.delayedDelivery.value);
      }
    }
  }

  clearDelayedDeliveryValue() {
    this.resetDelayedDeliveryValues();
    this.closeDelayedDeliveryModal();
    this.valueChanged$.next(this.delayedDelivery.value);
  }

  setDeadManTimerValue() {
    this.deadManTimer.days =
      !this.deadManTimer.days || isNaN(this.deadManTimer.days) || this.deadManTimer.days < 0 ? 0 : Math.floor(this.deadManTimer.days);
    this.deadManTimer.hours =
      !this.deadManTimer.hours || isNaN(this.deadManTimer.hours) || this.deadManTimer.hours < 0 ? 0 : Math.floor(this.deadManTimer.hours);
    this.deadManTimer.value = this.deadManTimer.days * 24 + this.deadManTimer.hours;
    this.closeDeadManTimerModal();
    if (this.deadManTimer.value) {
      this.clearSelfDestructValue();
      this.clearDelayedDeliveryValue();
    }
    this.valueChanged$.next(this.deadManTimer.value);
  }

  clearDeadManTimerValue() {
    this.resetDeadManTimerValues();
    this.closeDeadManTimerModal();
    this.valueChanged$.next(this.deadManTimer.value);
  }

  onSubmitEncryption() {
    this.showEncryptFormErrors = true;
    if (this.encryptForm.valid) {
      this.valueChanged$.next(true);
      this.closeEncryptionModal();
    }
  }

  clearEncryption() {
    this.encryptForm.reset();
    this.valueChanged$.next(true);
    this.closeEncryptionModal();
  }

  hasData() {
    // using >1 because there is always a blank line represented by ‘\n’ (quill docs)
    return this.quill.getLength() > 1 ||
      this.mailData.receiver.length > 0 || this.mailData.cc.length > 0 || this.mailData.bcc.length > 0 || this.mailData.subject;
  }

  private embedImageInQuill(url: string, contentId?: string) {
    if (url) {
      const selection = this.quill.getSelection();
      const index = selection ? selection.index : this.quill.getLength();
      this.quill.insertEmbed(index, 'image', {
        url: url,
        content_id: contentId
      });
      this.quill.setSelection(index + 1);
    }
  }

  private updateEmail() {
    this.setMailData(false, true, true);
    this.openPgpService.encrypt(this.draftId, this.draftMail.content);
  }

  setMailData(shouldSend: boolean, shouldSave: boolean, isEncrypted: boolean = false) {
    if (!this.draftMail) {
      this.draftMail = { content: null, mailbox: this.mailbox.id, folder: 'draft' };
    }
    this.draftMail.receiver = this.mailData.receiver.map(receiver => receiver.display);
    this.draftMail.cc = this.mailData.cc.map(cc => cc.display);
    this.draftMail.bcc = this.mailData.bcc.map(bcc => bcc.display);
    this.draftMail.subject = this.mailData.subject;
    this.draftMail.destruct_date = this.selfDestruct.value || null;
    this.draftMail.delayed_delivery = this.delayedDelivery.value || null;
    this.draftMail.dead_man_duration = this.deadManTimer.value || null;
    this.draftMail.content = this.editor.nativeElement.firstChild.innerHTML;
    this.draftMail.is_encrypted = isEncrypted;
    this.draftMail.password = this.encryptForm.controls['password'].value || null;
    this.draftMail.password_hint = this.encryptForm.controls['passwordHint'].value || null;

    this.checkInlineAttachments();
    this.store.dispatch(new UpdateLocalDraft({ ...this.draft, shouldSave, shouldSend, draft: { ...this.draftMail } }));
  }

  checkInlineAttachments() {
    const contents = this.quill.getContents().ops;
    const currentAttachments = [];
    contents.forEach(item => {
      if (item.insert && item.insert.image && item.insert.image.content_id) {
        currentAttachments.push(item.insert.image.content_id);
      }
    });
    this.inlineAttachmentContentIds = this.inlineAttachmentContentIds.filter(contentId => {
      if (!currentAttachments.includes(contentId)) {
        const attachmentToRemove = this.attachments.find(attachment => attachment.content_id === contentId);
        if (attachmentToRemove) {
          this.removeAttachment(attachmentToRemove);
        }
        return false;
      } else {
        return true;
      }
    });
  }

  private resetValues() {
    this.unSubscribeAutoSave();
    this.options = {};
    this.attachments = [];
    this.quill.setText('');
    this.resetMailData();
    this.clearSelfDestructValue();
    this.clearDelayedDeliveryValue();
    this.clearDeadManTimerValue();
  }

  private closeSelfDestructModal() {
    if (this.selfDestructModalRef) {
      this.selfDestructModalRef.dismiss();
    }
  }

  private closeDelayedDeliveryModal() {
    if (this.delayedDeliveryModalRef) {
      this.delayedDeliveryModalRef.dismiss();
    }
  }

  private closeDeadManTimerModal() {
    if (this.deadManTimerModalRef) {
      this.deadManTimerModalRef.dismiss();
    }
  }

  private unSubscribeAutoSave() {
    if (this.autoSaveSubscription) {
      this.autoSaveSubscription.unsubscribe();
    }
  }

  private resetMailData() {
    this.mailData = {
      receiver: this.receivers ?
        this.receivers.map(receiver => ({ display: receiver, value: receiver })) :
        this.draftMail ?
          this.draftMail.receiver.map(receiver => ({ display: receiver, value: receiver })) :
          [],
      cc: this.cc ? this.cc.map(address => ({ display: address, value: address })) :
        this.draftMail ?
          this.draftMail.cc.map(receiver => ({ display: receiver, value: receiver })) :
          [],
      bcc: this.draftMail ? this.draftMail.bcc.map(receiver => ({ display: receiver, value: receiver })) : [],
      subject: this.draftMail ? this.draftMail.subject : ''
    };
    if (this.mailData.cc.length > 0) {
      this.options.isCcVisible = true;
    }
    if (this.mailData.bcc.length > 0) {
      this.options.isBccVisible = true;
    }
    this.selfDestruct.value = this.draftMail ? this.draftMail.destruct_date : null;
    this.deadManTimer.value = this.draftMail ? this.draftMail.dead_man_duration : null;
    this.delayedDelivery.value = this.draftMail ? this.draftMail.delayed_delivery : null;
    this.isLoaded = true;
  }

  private resetSelfDestructValues() {
    this.selfDestruct.value = null;
    this.selfDestruct.date = null;
    this.selfDestruct.time = {
      hour: 0,
      minute: 0,
      second: 0
    };
    this.selfDestruct.error = null;
  }

  private resetDelayedDeliveryValues() {
    this.delayedDelivery.value = null;
    this.delayedDelivery.date = null;
    this.delayedDelivery.time = {
      hour: 0,
      minute: 0,
      second: 0
    };
    this.delayedDelivery.error = null;
  }

  private resetDeadManTimerValues() {
    this.deadManTimer.value = null;
    this.deadManTimer.days = 0;
    this.deadManTimer.hours = 0;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEYCODE) {
      this.closeOSK();
    }
  }
}
