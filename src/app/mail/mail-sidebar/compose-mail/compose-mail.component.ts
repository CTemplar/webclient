import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { MatKeyboardComponent, MatKeyboardRef, MatKeyboardService } from 'ngx7-material-keyboard';
import * as QuillNamespace from 'quill';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';
import { COLORS, ESCAPE_KEYCODE, FONTS, SummarySeparator, VALID_EMAIL_REGEX } from '../../../shared/config';
import { FilenamePipe } from '../../../shared/pipes/filename.pipe';
import { FilesizePipe } from '../../../shared/pipes/filesize.pipe';
import {
  CloseMailbox,
  DeleteAttachment,
  GetEmailContacts,
  GetUsersKeys,
  MoveMail,
  NewDraft,
  SnackErrorPush,
  SnackPush,
  UpdateLocalDraft, UpdatePGPDecryptedContent,
  UploadAttachment,
  UpdateDraftAttachment
} from '../../../store/actions';
import {
  AppState,
  AuthState,
  ComposeMailState,
  Draft,
  EmailContact, SecureContent,
  MailAction,
  MailBoxesState,
  MailState,
  UserState, ContactsState, Settings
} from '../../../store/datatypes';
import { Attachment, EncryptionNonCTemplar, Mail, Mailbox, MailFolderType } from '../../../store/models';
import { MailService, SharedService } from '../../../store/services';
import { DateTimeUtilService } from '../../../store/services/datetime-util.service';
import { OpenPgpService } from '../../../store/services/openpgp.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { getComposeMailShortcuts } from '../../../store/services';

const Quill: any = QuillNamespace;

const FontAttributor = Quill.import('attributors/style/font');
FontAttributor.whitelist = [...FONTS];
Quill.register(FontAttributor, true);

const SizeAttributor = Quill.import('attributors/style/size');
SizeAttributor.whitelist = ['10px', '18px', '32px'];
Quill.register(SizeAttributor, true);
Quill.register(Quill.import('attributors/style/align'), true);
Quill.register(Quill.import('attributors/style/background'), true);
Quill.register(Quill.import('attributors/style/color'), true);

const QuillBlockEmbed = Quill.import('blots/block/embed');

class ImageBlot extends QuillBlockEmbed {
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

class SignatureBlot extends QuillBlockEmbed {
  static create(value) {
    const node: any = super.create(value);
    value = value.replace(/<br>/g, '\n');
    node.innerText = value;
    return node;
  }

  static value(node) {
    return node.innerHTML;
  }
}

SignatureBlot.blotName = 'signature';
SignatureBlot.tagName = 'div';
SignatureBlot.className = 'ctemplar-signature';

Quill.register(SignatureBlot);

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

@Component({
  selector: 'app-compose-mail',
  templateUrl: './compose-mail.component.html',
  styleUrls: ['./compose-mail.component.scss', './../mail-sidebar.component.scss']
})
export class ComposeMailComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() receivers: Array<string>;
  @Input() cc: Array<string>;
  @Input() content: string;
  @Input() messageHistory: string;
  @Input() subject: string;
  @Input() draftMail: Mail;
  @Input() selectedMailbox: Mailbox;
  @Input() parentId: number;
  @Input() showSaveButton: boolean = true;
  @Input() forwardAttachmentsMessageId: number;
  @Input() action: MailAction;
  @Input() action_parent: number;
  @Input() isMailDetailPage: boolean;

  @Output() hide: EventEmitter<void> = new EventEmitter<void>();
  @Output() subjectChanged: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('editor') editor;
  @ViewChild('attachmentHolder') attachmentHolder;
  @ViewChild('toolbar') toolbar;
  @ViewChild('attachImagesModal') attachImagesModal;
  @ViewChild('selfDestructModal') selfDestructModal;
  @ViewChild('delayedDeliveryModal') delayedDeliveryModal;
  @ViewChild('deadManTimerModal') deadManTimerModal;
  @ViewChild('encryptionModal') encryptionModal;
  @ViewChild('insertLinkModal') insertLinkModal;

  draftId: number;
  colors = COLORS;
  fonts = FONTS;
  mailData: any = {};
  options: any = {};
  selfDestruct: any = {};
  delayedDelivery: any = {};
  deadManTimer: any = {};
  attachments: Attachment[] = [];
  isKeyboardOpened: boolean;
  encryptForm: FormGroup;
  contacts: EmailContact[];
  datePickerMinDate: NgbDateStruct;
  valueChanged$: Subject<any> = new Subject<any>();
  inProgress: boolean;
  isLoaded: boolean;
  showEncryptFormErrors: boolean;
  isTrialPrimeFeaturesAvailable: boolean = false;
  mailBoxesState: MailBoxesState;
  isUploadingAttachment: boolean;
  isDownloadingAttachmentCounter: number = 0;
  insertLinkData: any = {};
  settings: Settings;
  mailAction = MailAction;

  private isMailSent = false;
  private isSavedInDraft = false;

  private quill: any;
  private autoSaveSubscription: Subscription;
  private DEBOUNCE_DURATION: number = 5000; // duration in milliseconds
  private attachImagesModalRef: NgbModalRef;
  private selfDestructModalRef: NgbModalRef;
  private delayedDeliveryModalRef: NgbModalRef;
  private deadManTimerModalRef: NgbModalRef;
  private encryptionModalRef: NgbModalRef;
  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;
  private defaultLocale: string = 'US International';

  private draft: Draft;
  private attachmentsQueue: Array<Attachment> = [];
  private downloadingAttachments: any = {};
  private inlineAttachmentContentIds: Array<string> = [];
  private isSignatureAdded: boolean;
  private isAuthenticated: boolean;
  public userState: UserState;
  private decryptedContent: string;
  private encryptionData: any = {};
  private loadContacts: boolean = true;
  private contactsState: ContactsState;
  shortcuts: ShortcutInput[] = [];

  constructor(private modalService: NgbModal,
              private store: Store<AppState>,
              private formBuilder: FormBuilder,
              private openPgpService: OpenPgpService,
              private mailService: MailService,
              private sharedService: SharedService,
              private _keyboardService: MatKeyboardService,
              private dateTimeUtilService: DateTimeUtilService,
              private filesizePipe: FilesizePipe,
              private filenamePipe: FilenamePipe,
              private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.encryptForm = this.formBuilder.group({
      'password': ['', [Validators.required]],
      'confirmPwd': ['', [Validators.required]],
      'passwordHint': [''],
      'days': [5, [Validators.required, Validators.min(0), Validators.max(5)]],
      'hours': [0, [Validators.required, Validators.min(0), Validators.max(24)]]
    }, {
      validator: PasswordValidation.MatchPassword
    });

    this.resetMailData();
    this.initializeDraft();
    this.initializeAutoSave();

    this.store.select((state: AppState) => state.composeMail).pipe(untilDestroyed(this))
      .subscribe((response: ComposeMailState) => {
        const draft = response.drafts[this.draftId];
        if (draft) {
          this.draftMail = draft.draft;
          this.inProgress = draft.inProgress;
          if (draft.draft) {
            if (draft.draft.id && this.attachmentsQueue.length > 0) {
              this.attachmentsQueue.forEach(attachment => {
                attachment.message = draft.draft.id;
                this.encryptAttachment(attachment);
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

    this.store.select((state: AppState) => state.user).pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        // this.isTrialPrimeFeaturesAvailable = this.dateTimeUtilService.getDiffToCurrentDateTime(user.joinedDate, 'days') < 14;
        this.userState = user;
        this.settings = user.settings;
        if (user.settings.is_contacts_encrypted) {
          this.contacts = [];
        }
      });

    this.store.select((state: AppState) => state.contacts).pipe(untilDestroyed(this))
      .subscribe((contactsState: ContactsState) => {
        this.contacts = contactsState.emailContacts;
        this.contactsState = contactsState;
        this.loadEmailContacts();
      });

    this.store.select((state: AppState) => state.auth).pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        this.isAuthenticated = authState.isAuthenticated;
        this.loadEmailContacts();
      });

    this.store.select(state => state.mailboxes).pipe(untilDestroyed(this))
      .subscribe((mailBoxesState: MailBoxesState) => {
        if (!this.selectedMailbox) {
          if (this.draftMail && this.draftMail.mailbox) {
            this.selectedMailbox = mailBoxesState.mailboxes.find(mailbox => mailbox.id === this.draftMail.mailbox);
          } else if (mailBoxesState.currentMailbox) {
            this.selectedMailbox = mailBoxesState.currentMailbox;
            this.updateSignature();
          }
        }
        if (this.selectedMailbox && mailBoxesState.currentMailbox && this.selectedMailbox.id === mailBoxesState.currentMailbox.id) {
          this.selectedMailbox = mailBoxesState.currentMailbox;
          this.updateSignature();
        }
        this.mailBoxesState = mailBoxesState;
      });

    this.store.select(state => state.mail).pipe(untilDestroyed(this))
      .subscribe((mailState: MailState) => {
        if (this.draftMail && !this.decryptedContent) {
          const decryptedContent = mailState.decryptedContents[this.draftMail.id];
          if (decryptedContent && !decryptedContent.inProgress && decryptedContent.content) {
            this.decryptedContent = decryptedContent.content;
            if (this.draftMail.is_subject_encrypted) {
              this.subject = decryptedContent.subject;
              this.mailData.subject = decryptedContent.subject;
            }
            this.addDecryptedContent();
          }
        }
      });

    const now = new Date();
    this.datePickerMinDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate()
    };
  }

  ngAfterViewInit() {
    if (!this.settings.is_html_disabled) {
      this.initializeQuillEditor();
    } else {
      let content = this.mailData.content ? this.mailData.content : '';
      if (this.content) {
        content += this.getPlainText(this.content);
      }
      if (this.messageHistory) {
        content += '\n' + this.getPlainText(this.messageHistory);
      }
      if (content) {
        setTimeout(() => {
          this.mailData.content = content;
        }, 300);
      }
    }

    if (this.forwardAttachmentsMessageId) {
      if (this.editor) {
        this.updateEmail();
      } else {
        setTimeout(() => {
          this.updateEmail();
        }, 1000);
      }
    }
    this.shortcuts = getComposeMailShortcuts(this);
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.selectedMailbox.email && !this.isMailSent && !this.isSavedInDraft) {
      this.saveInDrafts();
      this.isSavedInDraft = true;
    }
    if (this.isAuthenticated) {
      this.store.dispatch(new CloseMailbox(this.draft));
    }
  }

  onSubjectChange(subject: any) {
    this.subjectChanged.emit(subject);
  }

  private getPlainText(html: string) {
    if (!(/<\/?[a-z][\s\S]*>/i.test(html))) {
      return html;
    }
    const element = document.createElement('div');
    element.innerHTML = html.replace(/<div>/g, '<br><div>').replace(/<p>/g, '<br><p>')
      .replace(/<br>/g, '\n').replace(/<\/br>/g, '\n');
    return element.innerText;
  }

  loadEmailContacts() {
    if (this.isAuthenticated && this.loadContacts && !this.contacts && this.contactsState && !this.contactsState.loaded &&
      !this.contactsState.inProgress && !this.userState.settings.is_contacts_encrypted) {
      this.loadContacts = false;
      this.store.dispatch(new GetEmailContacts());
    }
  }

  initializeDraft() {
    this.draftId = Date.now();

    if (this.draftMail && this.draftMail.content) {
      this.openPgpService.decrypt(this.draftMail.mailbox, this.draftMail.id, new SecureContent(this.draftMail));
      this.isSignatureAdded = true;
      this.inlineAttachmentContentIds = this.draftMail.attachments
        .filter((attachment: Attachment) => attachment.is_inline)
        .map(attachment => attachment.content_id);
    }

    this.encryptionData = {};
    if (this.draftMail && this.draftMail.encryption) {
      this.encryptionData.password = this.draftMail.encryption.password;
      this.encryptionData.password_hint = this.draftMail.encryption.password_hint;
      this.encryptionData.expiryHours = this.draftMail.encryption.expiry_hours;
    }

    const draft: Draft = {
      id: this.draftId,
      draft: this.draftMail,
      inProgress: false,
      attachments: this.draftMail ? this.draftMail.attachments.map(attachment => {
        attachment.progress = 100;
        attachment.name = this.filenamePipe.transform(attachment.document);
        attachment.draftId = this.draftId;
        attachment.attachmentId = performance.now() + Math.floor(Math.random() * 1000);
        return attachment;
      }) : [],
      usersKeys: null
    };
    this.store.dispatch(new NewDraft({ ...draft }));
    this.decryptAttachments(draft.attachments);
  }

  decryptAttachments(attachments: Array<Attachment>) {
    attachments.forEach(attachment => {
      // TODO: Do we need to download attachment even if its not encrypted?
      if (!attachment.decryptedDocument && !this.downloadingAttachments[attachment.id]) {
        this.downloadingAttachments[attachment.id] = true;
        this.isDownloadingAttachmentCounter++;
        this.mailService.getAttachment(attachment).pipe(untilDestroyed(this))
          .pipe(finalize(() => {
            this.isDownloadingAttachmentCounter--;
          }))
          .subscribe(response => {
              const uint8Array = this.sharedService.base64ToUint8Array(response.data);
              if (attachment.is_encrypted) {
                const fileInfo = { attachment, type: response.file_type };
                this.openPgpService.decryptAttachment(this.draftMail.mailbox, uint8Array, fileInfo)
                  .subscribe(decryptedAttachment => {
                    this.store.dispatch(new UpdateDraftAttachment({
                      draftId: this.draftId,
                      attachment: { ...decryptedAttachment }
                    }));
                  });
              } else {
                const newDocument = new File(
                  [uint8Array.buffer.slice(uint8Array.byteOffset, uint8Array.byteLength + uint8Array.byteOffset)],
                  attachment.name,
                  { type: response.file_type }
                );
                const newAttachment: Attachment = { ...attachment, decryptedDocument: newDocument };
                this.store.dispatch(new UpdateDraftAttachment({
                  draftId: this.draftId,
                  attachment: { ...newAttachment }
                }));

              }
            },
            error => console.log(error));
      }
    });
  }

  initializeQuillEditor() {
    this.quill = new Quill(this.editor.nativeElement, {
      modules: {
        toolbar: this.toolbar.nativeElement
      },
      clipboard: {
        matchVisual: false
      },
    });
    this.quill.clipboard.addMatcher(Node.TEXT_NODE, (node, delta) => {
      const regex = /https?:\/\/[^\s]+/g;
      if (typeof (node.data) !== 'string') {
        return;
      }
      const matches = node.data.match(regex);

      if (matches && matches.length > 0) {
        const ops = [];
        let str = node.data;
        matches.forEach((match) => {
          const split = str.split(match);
          const beforeLink = split.shift();
          ops.push({ insert: beforeLink });
          ops.push({ insert: match, attributes: { link: match } });
          str = split.join(match);
        });
        ops.push({ insert: str });
        delta.ops = ops;
      }
      return delta;
    });

    this.quill.format('font', this.userState.settings.default_font);
    this.quill.getModule('toolbar').addHandler('image', () => {
      this.quillImageHandler();
    });

    this.quill.on('text-change', (delta, oldDelta, source) => {
      this.valueChanged$.next();
    });

    if (this.content) {
      this.content = this.formatContent(this.content);
      this.quill.clipboard.dangerouslyPasteHTML(0, this.content);
    }

    this.updateSignature();

    if (this.messageHistory) {
      this.messageHistory = this.formatContent(this.messageHistory);
      const index = this.quill.getLength();
      this.quill.insertText(index, '\n', 'silent');
      this.quill.clipboard.dangerouslyPasteHTML(index + 1, this.messageHistory);
    }

    setTimeout(() => {
      this.quill.setSelection(0, 0, 'silent');
    }, 100);
  }

  private formatContent(content: string) {
    return this.settings.is_html_disabled ? content.replace(/\n/g, '<br>') : content;
  }

  insertLink(text: string, link: string) {
    this.insertLinkData.modalRef.close();
    if (!/^https?:\/\//i.test(link)) {
      link = 'http://' + link;
    }
    this.quill.focus();
    this.quill.updateContents([
      { retain: this.quill.getSelection().index || this.quill.getLength() },
      {
        // An image link
        insert: text,
        attributes: {
          link: link,
          target: '_blank'
        }
      }
    ]);
  }

  openInsertLinkModal() {
    this.insertLinkData = {};
    this.insertLinkData.modalRef = this.modalService.open(this.insertLinkModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
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

  onFromChanged(mailbox: Mailbox) {
    this.selectedMailbox = mailbox;
    this.updateSignature();
    this.valueChanged$.next(this.selectedMailbox);
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
        // TODO: add error notification for invalid file type here
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
    if (this.checkAttachmentSizeLimit(file)) {
      this.attachmentHolder.nativeElement.scrollIntoView({ behavior: 'smooth' });
      const attachment: Attachment = {
        draftId: this.draftId,
        document: file,
        decryptedDocument: file,
        name: file.name,
        size: this.filesizePipe.transform(file.size),
        attachmentId: performance.now() + Math.floor(Math.random() * 1000),
        message: this.draftMail.id,
        is_inline: isInline,
        is_encrypted: !isInline,
        inProgress: false
      };
      this.attachments.push(attachment);
      if (!this.draftMail.id) {
        this.attachmentsQueue.push(attachment);
      } else {
        this.encryptAttachment(attachment);
      }
    }
  }

  checkAttachmentSizeLimit(file: File): boolean {
    const attachmentLimitInMBs = this.settings.attachment_size_limit / (1024 * 1024);
    if (file.size > this.settings.attachment_size_limit) {
      this.store.dispatch(new SnackErrorPush({
        message: this.settings.attachment_size_error || `Maximum allowed file size is ${attachmentLimitInMBs}MB.`
      }));
      return false;
    }
    return true;
  }

  encryptAttachment(attachment: Attachment) {
    if (attachment.is_inline) {
      this.store.dispatch(new UploadAttachment({ ...attachment }));
    } else {
      this.openPgpService.encryptAttachment(this.selectedMailbox.id, attachment.decryptedDocument, attachment);
    }
  }

  handleAttachment(draft: Draft) {
    // usage Object.assign to create new copy and avoid storing reference of draft.attachments
    this.attachments = Object.assign([], draft.attachments);
    this.decryptAttachments(this.attachments);
    this.isUploadingAttachment = false;
    // TODO: remove this if its not required anymore due to change in handling of inline attachments?
    this.attachments.forEach(attachment => {
      if (attachment.is_inline && attachment.progress === 100 && !attachment.isRemoved &&
        attachment.content_id && (!attachment.is_encrypted || attachment.decryptedDocument) &&
        !this.inlineAttachmentContentIds.includes(attachment.content_id)) {
        this.inlineAttachmentContentIds.push(attachment.content_id);
        if (!attachment.is_forwarded) {
          this.embedImageInQuill(attachment.document, attachment.content_id);
        }
      }
      if (attachment.progress < 100 && !attachment.isRemoved) {
        this.isUploadingAttachment = true;
      }
    });
  }

  onAttachImageURL(url: string) {
    this.embedImageInQuill(url);
    this.attachImagesModalRef.dismiss();
  }

  saveInDrafts() {
    if (this.isSavedInDraft) {     // if email already saved in ngOnDestroy.
      return;
    }
    this.isSavedInDraft = true;
    this.updateEmail();
    this.hide.emit();
    this.resetValues();
  }

  discardEmail() {
    this.isSavedInDraft = true;
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
    if (this.inProgress || this.draft.isSaving) {
      // If saving is in progress, then wait to send.
      setTimeout(() => {
        this.sendEmail();
      }, 100);
      return;
    }

    if (!this.selectedMailbox.is_enabled) {
      this.store.dispatch(new SnackPush({ message: 'Selected email address is disabled. Please select a different email address.' }));
      return;
    }
    const receivers: string[] = [
      ...this.mailData.receiver.map(receiver => receiver.display),
      ...this.mailData.cc.map(cc => cc.display),
      ...this.mailData.bcc.map(bcc => bcc.display)
    ];
    if (receivers.length === 0) {
      this.store.dispatch(new SnackErrorPush({ message: 'Please enter receiver email.' }));
      return false;
    }
    const validEmailRegex = new RegExp(VALID_EMAIL_REGEX);
    const invalidAddress = receivers.find(receiver => !validEmailRegex.test(receiver));
    if (invalidAddress) {
      this.store.dispatch(new SnackErrorPush({ message: `"${invalidAddress}" is not valid email address.` }));
      return;
    }
    if (this.encryptionData.password) {
      this.openPgpService.generateEmailSshKeys(this.encryptionData.password, this.draftId);
    }
    this.isMailSent = true;
    this.setMailData(true, false);
    this.inProgress = true;
    this.store.dispatch(new GetUsersKeys({
      draftId: this.draftId, emails: receivers,
      draft: {
        ...this.draft, isMailDetailPage: this.isMailDetailPage, isSaving: false,
        shouldSave: false, shouldSend: true, draft: { ...this.draftMail }
      }
    }));
    this.store.dispatch(new SnackPush({ message: 'Sending mail...', duration: 120000 }));
    this.resetValues();
    this.hide.emit();
  }

  removeAttachment(attachment: Attachment) {
    if (!attachment.isRemoved) {
      attachment.isRemoved = true;
      this.store.dispatch(new DeleteAttachment(attachment));
    }
  }

  updateSignature() {
    if (this.settings.is_html_disabled) {
      if (!this.isSignatureAdded) {
        this.isSignatureAdded = true;
        this.mailData.content = this.mailData.content ? this.mailData.content : ' ';
        if (this.selectedMailbox.signature) {
          this.mailData.content += `\n ${this.getPlainText(this.selectedMailbox.signature)}`;
        }
      }
      return;
    }
    if (this.quill && this.selectedMailbox) {
      if (!this.isSignatureAdded && this.selectedMailbox.signature) {
        const index = this.quill.getLength();
        this.quill.insertText(index, '\n', 'silent');
        const signature = this.selectedMailbox.signature.replace(/\n/g, '<br>');
        this.quill.clipboard.dangerouslyPasteHTML(index + 1, signature || '', 'silent');
        this.isSignatureAdded = true;
      }
    }
  }

  addDecryptedContent() {
    if (this.settings.is_html_disabled && this.decryptedContent) {
      this.mailData.content = this.decryptedContent;
      return;
    }
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
    this.encryptForm.controls['password'].setValue(this.encryptionData.password || '');
    this.encryptForm.controls['passwordHint'].setValue(this.encryptionData.password_hint || '');
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
    const value = this.encryptForm.value;
    const expiryHours = value.hours + (value.days * 24);
    if (this.encryptForm.valid && expiryHours > 0 && expiryHours <= 120) {
      this.encryptionData = {
        expiryHours,
        password: value.password,
        passwordHint: value.passwordHint,
      };
      this.valueChanged$.next(true);
      this.closeEncryptionModal();
    }
  }

  clearEncryption() {
    this.encryptForm.reset();
    this.encryptionData = {};
    this.valueChanged$.next(true);
    this.closeEncryptionModal();
  }

  hasData() {
    // using >1 because there is always a blank line represented by ‘\n’ (quill docs)
    return (this.settings.is_html_disabled ? this.mailData.content.length > 1 : this.quill.getLength() > 1) ||
      this.mailData.receiver.length > 0 || this.mailData.cc.length > 0 || this.mailData.bcc.length > 0 || this.mailData.subject;
  }

  private embedImageInQuill(source: string, contentId?: string) {
    if (source && this.quill) {
      const selection = this.quill.getSelection();
      const index = selection ? selection.index : this.quill.getLength();
      this.quill.insertEmbed(index, 'image', {
        url: source,
        content_id: contentId
      });
      this.quill.setSelection(index + 1);
    }
  }

  private updateEmail() {
    this.inProgress = true;
    this.setMailData(false, true);
    this.openPgpService.encrypt(this.draftMail.mailbox, this.draftId, new SecureContent(this.draftMail));
  }

  setMailData(shouldSend: boolean, shouldSave: boolean) {
    if (!this.draftMail) {
      this.draftMail = { content: null, folder: 'draft' };
    }

    this.draft.isSaving = shouldSave;

    this.draftMail.mailbox = this.selectedMailbox ? this.selectedMailbox.id : null;
    this.draftMail.sender = this.selectedMailbox.email;
    this.draftMail.receiver = this.mailData.receiver.map(receiver => receiver.display);
    this.draftMail.cc = this.mailData.cc.map(cc => cc.display);
    this.draftMail.bcc = this.mailData.bcc.map(bcc => bcc.display);
    this.draftMail.subject = this.mailData.subject;
    this.draftMail.destruct_date = this.selfDestruct.value || null;
    this.draftMail.delayed_delivery = this.delayedDelivery.value || null;
    this.draftMail.dead_man_duration = this.deadManTimer.value || null;
    this.draftMail.is_subject_encrypted = this.userState.settings.is_subject_encrypted;
    this.draftMail.is_html = !this.settings.is_html_disabled;
    if (!this.settings.is_html_disabled) {
      this.draftMail.content = this.editor.nativeElement.firstChild.innerHTML;
      const tokens = this.draftMail.content.split(`<p>${SummarySeparator}</p>`);
      if (tokens.length > 1) {
        tokens[0] += `</br><span class="gmail_quote ctemplar_quote">`;
        tokens[tokens.length - 1] += `</span>`;
        this.draftMail.content = tokens.join(`<p>${SummarySeparator}</p>`);
      }
      if (!shouldSave) {
        this.draftMail.content = this.draftMail.content.replace('class="ctemplar-signature"', '');
      }

      if (shouldSend) {
        this.draftMail.content = this.draftMail.content.replace(new RegExp('<p>', 'g'), '<div>');
        this.draftMail.content = this.draftMail.content.replace(new RegExp('</p>', 'g'), '</div>');
      }
    } else {
      this.draftMail.content = this.mailData.content;
    }
    this.draftMail.send = shouldSend;

    if (this.action) {
      this.draftMail.last_action = this.action;
      this.draftMail.last_action_parent_id = this.action_parent;
    }

    if (this.forwardAttachmentsMessageId) {
      this.draftMail.forward_attachments_of_message = this.forwardAttachmentsMessageId;
      this.forwardAttachmentsMessageId = null;
    }
    if (this.parentId) {
      this.draftMail.parent = this.parentId;
    }
    if (this.encryptionData.password) {
      this.draftMail.encryption = this.draftMail.encryption || new EncryptionNonCTemplar();
      this.draftMail.encryption.password = this.encryptionData.password;
      this.draftMail.encryption.password_hint = this.encryptionData.passwordHint;
      this.draftMail.encryption.expiry_hours = this.encryptionData.expiryHours;
    } else if (this.draftMail.encryption) {
      this.draftMail.encryption = new EncryptionNonCTemplar();
    }

    this.checkInlineAttachments();
    if (!shouldSend) {
      this.store.dispatch(new UpdateLocalDraft({
        ...this.draft, isMailDetailPage: this.isMailDetailPage,
        shouldSave, shouldSend, draft: { ...this.draftMail }
      }));
    } else {
      this.store.dispatch(new UpdatePGPDecryptedContent({
        id: this.draftMail.id,
        isPGPInProgress: false,
        decryptedContent: { content: this.draftMail.content, subject: this.draftMail.subject }
      }));
    }
  }

  checkInlineAttachments() {
    if (this.settings.is_html_disabled) {
      return;
    }
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
    if (this.quill) {
      this.quill.setText('');
    }
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
    this.resetSelfDestructValues();
    this.resetDelayedDeliveryValues();
    this.resetDeadManTimerValues();
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
      subject: (this.draftMail && this.draftMail.is_subject_encrypted) ? '' :
        (this.subject ? this.subject : this.draftMail ? this.draftMail.subject : '')
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
    this.selfDestruct.meridian = true;
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
    this.delayedDelivery.meridian = true;
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

  onFilesDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.onFilesSelected(event.dataTransfer.files);
  }

  onAddingReceiver(tag: any, data: any[]) {
    if (tag.value && tag.value.split(',').length > 1) {
      const emails = [];
      data.forEach(item => {
        if (item.value === tag.value) {
          const tokens = tag.value.split(',');
          emails.push(...tokens.map(token => {
              token = token.trim();
              return ({ value: token, display: token, email: token, name: token });
            })
          );
        } else {
          emails.push(item);
        }
      });
      data.splice(0, this.mailData.receiver.length);
      data.push(...emails);
    }
    this.valueChanged$.next(data);
  }
}
