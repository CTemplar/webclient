import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as parseEmail from 'email-addresses';
import * as QuillNamespace from 'quill';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as xss from 'xss';

import { COLORS, FONTS, SummarySeparator } from '../../../shared/config';
import {
  CloseMailbox,
  DeleteAttachment,
  GetEmailContacts,
  GetUsersKeys,
  MoveMail,
  NewDraft,
  SetIsComposerPopUp,
  SnackErrorPush,
  SnackPush,
  UpdateDraftAttachment,
  UpdateLocalDraft,
  UpdatePGPDecryptedContent,
  UploadAttachment,
} from '../../../store/actions';
import { FilenamePipe } from '../../../shared/pipes/filename.pipe';
import { FilesizePipe } from '../../../shared/pipes/filesize.pipe';
import { EmailFormatPipe } from '../../../shared/pipes/email-formatting.pipe';
import {
  AppState,
  AuthState,
  ComposeMailState,
  ContactsState,
  Draft,
  GlobalPublicKey,
  MailAction,
  MailBoxesState,
  MailState,
  SecureContent,
  Settings,
  UserState,
} from '../../../store/datatypes';
import { Attachment, EncryptionNonCTemplar, Mail, Mailbox, MailFolderType } from '../../../store/models';
import { MailService, SharedService } from '../../../store/services';
import { DateTimeUtilService } from '../../../store/services/datetime-util.service';
import { OpenPgpService } from '../../../store/services/openpgp.service';

const Quill: any = QuillNamespace;
const BlockEmbed = Quill.import('blots/block/embed');
class keepHTML extends BlockEmbed {
  static create(node) {
    return node;
  }
  static value(node) {
    return node;
  }
}
keepHTML.blotName = 'keepHTML';
keepHTML.className = 'keepHTML';
// keepHTML.tagName = 'div';

Quill.register(keepHTML);
/**
 * Add custom fonts, sizes, styles to quill
 */
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
const Inline = Quill.import('blots/inline');
const Delta = Quill.import('delta');

/**
 * Define Custom Image Blot to store meta-data in Quill Editor
 */
class ImageBlot extends QuillBlockEmbed {
  // Converts the HTML tag to image blot
  static create(value) {
    const node: any = super.create(value);
    if (value.url) {
      node.setAttribute('src', value.url);
    } else {
      node.setAttribute('src', value);
    }
    if (value) {
      node.setAttribute('data-content-id', value.content_id);
    }
    return node;
  }

  // Converts the image blot to HTML tag
  static value(node) {
    return {
      content_id: node.getAttribute('data-content-id'),
      url: node.getAttribute('src'),
    };
  }
}

ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';

Quill.register(ImageBlot);

/**
 * Custom Signature Blot to add custom html signature to Quill Editor
 */
class SignatureBlot extends QuillBlockEmbed {
  // Converts the HTML tag to text version
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

/**
 * Custom Inline Blot to Quill Editor
 */
class OriginalBlot extends Inline {
  // add custom class to node
  static create(value) {
    const node = super.create();
    node.setAttribute('class', 'originalblock');
    return node;
  }

  static value(node) {
    return node.innerHTML;
  }
}

OriginalBlot.blotName = 'originalblock';
OriginalBlot.tagName = 'div';
OriginalBlot.className = 'originalblock';

Quill.register(OriginalBlot);

export class PasswordValidation {
  static MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value; // to get value in password input tag
    const confirmPassword = AC.get('confirmPwd').value; // to get value in confirm password input tag
    if (password !== confirmPassword) {
      AC.get('confirmPwd').setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }
}

@UntilDestroy()
@Component({
  selector: 'app-compose-mail',
  templateUrl: './compose-mail.component.html',
  styleUrls: ['./compose-mail.component.scss', './../mail-sidebar.component.scss'],
})
export class ComposeMailComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() receivers: Array<string>;

  @Input() cc: Array<string>;

  @Input() content = '';

  @Input() subject: string;

  @Input() draftMail: Mail;

  @Input() selectedMailbox: Mailbox;

  @Input() parentId: number;

  @Input() showSaveButton = true;

  @Input() forwardAttachmentsMessageId: number;

  @Input() action: MailAction;

  @Input() action_parent: number;

  @Input() isMailDetailPage: boolean;

  @Input() isFullScreen: boolean;

  @Input() isPopupOpen: boolean;

  @Input() isReplyInPopup: boolean;

  @Output() hide: EventEmitter<void> = new EventEmitter<void>();

  @Output() subjectChanged: EventEmitter<string> = new EventEmitter<string>();

  @Output() popUpChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('editor', { read: ElementRef, static: false }) editor;

  @ViewChild('attachmentHolder') attachmentHolder;

  @ViewChild('toolbar') toolbar;

  @ViewChild('attachImagesModal') attachImagesModal;

  @ViewChild('selfDestructModal') selfDestructModal;

  @ViewChild('delayedDeliveryModal') delayedDeliveryModal;

  @ViewChild('receiverInput') receiverInputRange: ElementRef;

  @ViewChild('ccReceiverInput') ccReceiverInputRange: ElementRef;

  @ViewChild('bccReceiverInput') bccReceiverInputRange: ElementRef;

  @ViewChild('deadManTimerModal') deadManTimerModal;

  @ViewChild('encryptionModal') encryptionModal;

  @ViewChild('insertLinkModal') insertLinkModal;

  @ViewChild('confirmationModal') confirmationModal;

  @ViewChild('closeConfirmationModal') closeConfirmationModal;

  confirmModalRef: NgbModalRef;

  closeConfirmModalRef: NgbModalRef;

  draftId: number;

  usersKeys: Map<string, GlobalPublicKey> = new Map();

  colors = COLORS;

  fonts = FONTS;

  mailData: any = {};

  inputTextValue = '';

  ccInputTextValue = '';

  bccInputTextValue = '';

  night_mode: boolean;

  options: any = {};

  selfDestruct: any = {};

  delayedDelivery: any = {};

  deadManTimer: any = {};

  attachments: Attachment[] = [];

  isKeyboardOpened: boolean;

  isSelfDestruction: boolean;

  encryptForm: FormGroup;

  contacts: any = [];

  datePickerMinDate: NgbDateStruct;

  valueChanged$: Subject<any> = new Subject<any>();

  inProgress: boolean;

  isProcessingAttachments: boolean;

  isLoaded: boolean;

  showEncryptFormErrors: boolean;

  isTrialPrimeFeaturesAvailable = false;

  mailBoxesState: MailBoxesState;

  isUploadingAttachment: boolean;

  isDownloadingAttachmentCounter = 0;

  insertLinkData: any = {};

  settings: Settings;

  mailAction = MailAction;

  isPasted = false;

  ccIsPasted = false;

  bccIsPasted = false;

  private isMailSent = false;

  private isSavedInDraft = false;

  private quill: any;

  private autoSaveSubscription: Subscription;

  private attachImagesModalRef: NgbModalRef;

  private selfDestructModalRef: NgbModalRef;

  private delayedDeliveryModalRef: NgbModalRef;

  private deadManTimerModalRef: NgbModalRef;

  private encryptionModalRef: NgbModalRef;

  private defaultLocale = 'US International';

  private draft: Draft;

  private attachmentsQueue: Array<Attachment> = [];

  private downloadingAttachments: any = {};

  private inlineAttachmentContentIds: Array<string> = [];

  private isSignatureAdded = false;

  private isAuthenticated: boolean;

  private saveDraftOnLogout: boolean;

  public userState: UserState = new UserState();

  private decryptedContent: string;

  private encryptionData: any = {};

  private loadContacts = true;

  private contactsState: ContactsState;

  private oldMailbox: Mailbox;

  isPreparingToSendEmail: boolean = false;

  constructor(
    private modalService: NgbModal,
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private openPgpService: OpenPgpService,
    private mailService: MailService,
    private sharedService: SharedService,
    private dateTimeUtilService: DateTimeUtilService,
    private filesizePipe: FilesizePipe,
    private filenamePipe: FilenamePipe,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.encryptForm = this.formBuilder.group(
      {
        password: ['', [Validators.required]],
        confirmPwd: ['', [Validators.required]],
        passwordHint: [''],
        days: [5, [Validators.required, Validators.min(0), Validators.max(5)]],
        hours: [0, [Validators.required, Validators.min(0), Validators.max(24)]],
      },
      {
        validator: PasswordValidation.MatchPassword,
      },
    );

    this.resetMailData();
    this.initializeDraft();
    /**
     * Get current Compose state from Store and
     * Encrypt attachments of compose mail
     */
    this.store
      .select((state: AppState) => state.composeMail)
      .pipe(untilDestroyed(this))
      .subscribe((response: ComposeMailState) => {
        const draft = response.drafts[this.draftId];
        if (draft) {
          this.draftMail = draft.draft;
          this.inProgress = draft.inProgress;
          if (draft.isProcessingAttachments !== undefined) {
            this.isProcessingAttachments = draft.isProcessingAttachments;
            if (!this.isProcessingAttachments && this.closeConfirmModalRef) {
              this.closeConfirmModalRef.dismiss();
            }
          }
          if (draft.draft && draft.draft.id && this.attachmentsQueue.length > 0) {
            // when open draft mail with attachments
            this.attachmentsQueue.forEach(attachment => {
              attachment.message = draft.draft.id;
              this.encryptAttachment(attachment);
            });
            this.attachmentsQueue = [];
          }
          if (!this.inProgress) {
            this.handleAttachment(draft);
          }
        }
        this.draft = draft;
        this.usersKeys = response.usersKeys;
      });

    /**
     * Get user's information from store.
     */
    this.store
      .select((state: AppState) => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.userState = user;
        this.settings = user.settings;
        this.night_mode = this.settings.is_night_mode;
        // Set html/plain version from user's settings.
        if (this.draftMail && this.draftMail.is_html === null) {
          this.draftMail.is_html = !this.settings.is_html_disabled;
        }
        if (user.settings.is_contacts_encrypted) {
          this.contacts = [];
        }
      });

    /**
     * Get user's contacts from store.
     */
    this.store
      .select((state: AppState) => state.contacts)
      .pipe(untilDestroyed(this))
      .subscribe((contactsState: ContactsState) => {
        this.contacts = [];
        if (contactsState.emailContacts === undefined) {
          contactsState.contacts.forEach(x => {
            this.contacts.push({
              name: x.name,
              email: x.email,
              display: EmailFormatPipe.transformToFormattedEmail(x.email, x.name),
            });
          });
        } else {
          contactsState.emailContacts.forEach(x => {
            this.contacts.push({
              name: x.name,
              email: x.email,
              display: EmailFormatPipe.transformToFormattedEmail(x.email, x.name),
            });
          });
        }
        this.contactsState = contactsState;
        this.loadEmailContacts();
      });

    /**
     * Get user's current authentication status
     */
    this.store
      .select((state: AppState) => state.auth)
      .pipe(untilDestroyed(this))
      .subscribe((authState: AuthState) => {
        this.isAuthenticated = authState.isAuthenticated;
        this.saveDraftOnLogout = authState.saveDraftOnLogout;
        if (authState.saveDraftOnLogout) {
          this.updateEmail();
        } // save draft before logout
        this.loadEmailContacts();
      });

    /**
     * Get user's mailbox information
     */
    this.store
      .select(state => state.mailboxes)
      .pipe(untilDestroyed(this))
      .subscribe((mailBoxesState: MailBoxesState) => {
        if (!this.selectedMailbox) {
          if (this.draftMail && this.draftMail.mailbox) {
            this.selectedMailbox = mailBoxesState.mailboxes.find(mailbox => mailbox.id === this.draftMail.mailbox);
          } else if (mailBoxesState.currentMailbox) {
            this.selectedMailbox = mailBoxesState.currentMailbox;
            this.updateSignature();
          }
        }
        if (
          this.selectedMailbox &&
          mailBoxesState.currentMailbox &&
          this.selectedMailbox.id === mailBoxesState.currentMailbox.id
        ) {
          this.selectedMailbox = mailBoxesState.currentMailbox;
        }
        this.mailBoxesState = mailBoxesState;
      });

    /**
     * Get mail status and
     * add decrypted content if content is not decrypted
     */
    this.store
      .select(state => state.mail)
      .pipe(untilDestroyed(this))
      .subscribe((mailState: MailState) => {
        if (this.draftMail && !this.decryptedContent) {
          const decryptedContent = mailState.decryptedContents[this.draftMail.id];
          if (decryptedContent && !decryptedContent.inProgress && decryptedContent.content) {
            this.decryptedContent = decryptedContent.content;
            if (this.draftMail.is_subject_encrypted) {
              this.subject = decryptedContent.subject;
              this.subjectChanged.emit(this.subject);
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
      day: now.getDate(),
    };

    this.isSelfDestructionEnable(); // check self destruction is possible or not
    this.initializeAutoSave(); // start auto save function
  }

  onPaste($event) {
    this.isPasted = true;
  }

  ccOnPaste($event) {
    this.ccIsPasted = true;
  }

  bccOnPaste($event) {
    this.bccIsPasted = true;
  }

  onRemoveReceive() {
    this.valueChanged$.next(this.mailData.receiver);
    this.isSelfDestructionEnable();
  }

  onRemoveCc() {
    this.valueChanged$.next(this.mailData.cc);
    this.isSelfDestructionEnable();
  }

  onRemoveBcc() {
    this.valueChanged$.next(this.mailData.bcc);
    this.isSelfDestructionEnable();
  }

  updateInputTextValue(value) {
    // add tag if pasted item is valid email
    if (this.isPasted && this.validateEmail(value)) {
      this.mailData.receiver.push({
        display: value,
        value,
        email: value,
      });
      this.inputTextValue = '';
      this.isPasted = false;
      if (!this.usersKeys.has(value) || (!this.usersKeys.get(value).key && !this.usersKeys.get(value).isFetching)) {
        this.store.dispatch(
          new GetUsersKeys({
            emails: [value],
          }),
        );
      }
    }
  }

  ccUpdateInputTextValue(value) {
    // add tag if pasted item is valid email
    if (this.ccIsPasted && this.validateEmail(value)) {
      this.mailData.cc.push({
        display: value,
        value,
        email: value,
      });
      this.ccInputTextValue = '';
      this.ccIsPasted = false;
      if (!this.usersKeys.has(value) || (!this.usersKeys.get(value).key && !this.usersKeys.get(value).isFetching)) {
        this.store.dispatch(
          new GetUsersKeys({
            emails: [value],
          }),
        );
      }
    }
  }

  bccUpdateInputTextValue(value) {
    // add tag if pasted item is valid email
    if (this.bccIsPasted && this.validateEmail(value)) {
      this.mailData.bcc.push({
        display: value,
        value,
        email: value,
      });
      this.bccInputTextValue = '';
      this.bccIsPasted = false;
      if (!this.usersKeys.has(value) || (!this.usersKeys.get(value).key && !this.usersKeys.get(value).isFetching)) {
        this.store.dispatch(
          new GetUsersKeys({
            emails: [value],
          }),
        );
      }
    }
  }

  validateEmail(email) {
    const re = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\dA-Za-z\-]+\.)+[A-Za-z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  onTagEdited($event) {
    this.mailData.receiver[$event.index] = { display: $event.display, value: $event.value, email: $event.value };
    this.isSelfDestructionEnable();
  }

  ccOnTagEdited($event) {
    this.mailData.cc[$event.index] = { display: $event.display, value: $event.value, email: $event.value };
    this.isSelfDestructionEnable();
  }

  bccOnTagEdited($event) {
    this.mailData.bcc[$event.index] = { display: $event.display, value: $event.value, email: $event.value };
    this.isSelfDestructionEnable();
  }

  onClick($event) {
    this.receiverInputRange.nativeElement.querySelector('input[type="text"]').focus();
  }

  onCcClick($event) {
    this.ccReceiverInputRange.nativeElement.querySelector('input[type="text"]').focus();
  }

  onBccClick($event) {
    this.bccReceiverInputRange.nativeElement.querySelector('input[type="text"]').focus();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngAfterViewInit() {
    this.initializeComposeMail();
    if (this.forwardAttachmentsMessageId) {
      if (this.editor) {
        this.updateEmail();
      } else {
        setTimeout(() => {
          this.updateEmail();
        }, 1000);
      }
    }
    this.cdr.detectChanges();
  }

  initializeComposeMail() {
    if (this.draftMail.is_html === null || this.draftMail.is_html) {
      if (this.editor) {
        this.initializeQuillEditor();
      }
    } else {
      // display mail content and change from html to text if html version
      let content = this.mailData.content ? this.mailData.content : '';
      if (this.editor) {
        this.content = this.editor.nativeElement.firstChild.innerHTML;
      }
      this.content = this.content && this.content === '' ? content : this.content;

      if (this.content) {
        content = this.getPlainText(this.content);
      }
      if (content) {
        setTimeout(() => {
          this.mailData.content = content;
          this.updateSignature();
        }, 300);
      }
    }
  }

  setHtmlEditor(value: boolean) {
    this.draftMail.is_html = value;
    if (value) {
      this.cdr.detectChanges();
    }
    this.initializeComposeMail();
    if (!value) {
      this.cdr.detectChanges();
    }
    this.valueChanged$.next();
  }

  openReplyinPopup() {
    this.store.dispatch(new SetIsComposerPopUp(true));
    this.popUpChange.emit({
      receivers: this.receivers,
      draftMail: this.draftMail,
      forwardAttachmentsMessageId: this.forwardAttachmentsMessageId,
      action: this.action,
      parentId: this.parentId,
    });
  }

  ngOnDestroy(): void {
    // save to draft when close compose
    if (this.selectedMailbox.email && !this.isMailSent && !this.isSavedInDraft && !this.saveDraftOnLogout) {
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
    // Change html content to text content by deletng html tags
    if (!/<\/?[a-z][\S\s]*>/i.test(html)) {
      return html;
    }
    const element = document.createElement('div');
    element.innerHTML = html
      .replace(/<br>/g, '')
      .replace(/<\/div>/g, '<br></div>')
      .replace(/<\/p>/g, '<br></p>')
      .replace(/<br>/g, '\n')
      .replace(/<\/br>/g, '\n');
    return element.textContent;
  }

  loadEmailContacts() {
    if (
      this.isAuthenticated &&
      this.loadContacts &&
      !this.contacts &&
      this.contactsState &&
      !this.contactsState.loaded &&
      !this.contactsState.inProgress &&
      !this.userState.settings.is_contacts_encrypted
    ) {
      this.loadContacts = false;
      this.store.dispatch(new GetEmailContacts());
    }
  }

  initializeDraft() {
    // save compose content to draft for the first time
    this.draftId = Date.now();
    if (!this.draftMail) {
      this.draftMail = { is_html: null, content: null, folder: 'draft' };
    } else {
      this.openPgpService.decrypt(this.draftMail.mailbox, this.draftMail.id, new SecureContent(this.draftMail));
      this.isSignatureAdded = true;
      if (this.draftMail.attachments) {
        this.inlineAttachmentContentIds = this.draftMail.attachments
          .filter((attachment: Attachment) => attachment.is_inline)
          .map(attachment => attachment.content_id);
      }
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
      attachments:
        this.draftMail && this.draftMail.attachments
          ? this.draftMail.attachments.map(attachment => {
              attachment.progress = 100;
              attachment.name = this.filenamePipe.transform(attachment.document);
              attachment.draftId = this.draftId;
              attachment.attachmentId = performance.now() + Math.floor(Math.random() * 1000);
              return attachment;
            })
          : [],
      usersKeys: null,
    };

    this.store.dispatch(new NewDraft({ ...draft }));
    this.decryptAttachments(draft.attachments);
  }

  decryptAttachments(attachments: Array<Attachment>) {
    attachments.forEach(attachment => {
      // TODO: Do we need to download attachment even if it is not encrypted?
      if (!attachment.decryptedDocument && !this.downloadingAttachments[attachment.id]) {
        this.downloadingAttachments[attachment.id] = true;
        this.isDownloadingAttachmentCounter++;
        this.mailService
          .getAttachment(attachment)
          .pipe(untilDestroyed(this))
          .pipe(
            finalize(() => {
              this.isDownloadingAttachmentCounter--;
            }),
          )
          .subscribe(
            response => {
              if (attachment.is_encrypted) {
                // if attachment is encrypted, update draft attachment with decrypted attachment
                const fileInfo = { attachment, type: response.file_type };
                this.openPgpService
                  .decryptAttachment(this.draftMail.mailbox, response.data, fileInfo)
                  .subscribe(decryptedAttachment => {
                    this.store.dispatch(
                      new UpdateDraftAttachment({
                        draftId: this.draftId,
                        attachment: { ...decryptedAttachment },
                      }),
                    );
                  });
              } else {
                // if attachment is not encrypted, update draft attachment with decoded attachment
                const uint8Array = this.sharedService.base64ToUint8Array(response.data);
                const newDocument = new File(
                  [uint8Array.buffer.slice(uint8Array.byteOffset, uint8Array.byteLength + uint8Array.byteOffset)],
                  attachment.name,
                  { type: response.file_type },
                );
                const newAttachment: Attachment = { ...attachment, decryptedDocument: newDocument };
                this.store.dispatch(
                  new UpdateDraftAttachment({
                    draftId: this.draftId,
                    attachment: { ...newAttachment },
                  }),
                );
              }
            },
            error => console.log(error),
          );
      }
    });
  }

  initializeQuillEditor() {
    this.quill = new Quill(this.editor.nativeElement, {
      modules: {
        toolbar: this.toolbar.nativeElement,
      },
      clipboard: {
        matchVisual: false,
      },
    });

    if (this.userState.settings.default_font) {
      this.quill.format('font', this.userState.settings.default_font);
    }
    this.quill.getModule('toolbar').addHandler('image', () => {
      this.quillImageHandler();
    });

    this.quill.on('text-change', (delta, oldDelta, source) => {
      this.valueChanged$.next();
    });
    // need to change text to html contents
    if (this.mailData.content) {
      this.content = this.mailData.content ? this.mailData.content.replace(/\n/g, '<br>') : this.content;
      this.quill.clipboard.dangerouslyPasteHTML(0, this.content);
    } else if (this.content) {
      this.content = this.formatContent(this.content);
      const allowedTags = [
        'a',
        'b',
        'br',
        'div',
        'font',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'hr',
        'img',
        'label',
        'li',
        'ol',
        'p',
        'span',
        'strong',
        'table',
        'td',
        'th',
        'tr',
        'u',
        'ul',
        'i',
        'blockquote',
      ];
      // @ts-ignore
      let xssValue = xss(this.content, {
        onTag: (tag, html, options) => {
          if (!options.isClosing && allowedTags.includes(tag.toLowerCase())) {
            let htmlAttributes = '';
            const reg = /\s/;
            const match = reg.exec(html);
            const i = match ? match.index : -1;
            if (i !== -1) {
              htmlAttributes = html.slice(i + 1, -1).trim();
            }
            let attributesHtml = xss.parseAttr(htmlAttributes, (attributeName, attributeValue) => {
              if (attributeName === 'class') {
                attributeValue = attributeValue.replace('gmail_quote', '');
              }
              return `${attributeName}="${attributeValue}"`;
            });
            let outputHtml = `<${tag}`;
            if (attributesHtml) {
              outputHtml += ` ${attributesHtml}`;
            }
            outputHtml += '>';
            return outputHtml;
          } else {
            return html;
          }
        },
      });
      this.quill.clipboard.dangerouslyPasteHTML(
        0,
        `<div class="keepHTML" style="white-space: normal;">${xssValue}</div>`,
      );
    }

    this.updateSignature();

    setTimeout(() => {
      this.quill.setSelection(0, 0, 'silent');
    }, 100);
  }

  private formatContent(content: string) {
    // convert text content to html content
    return !this.draftMail.is_html ? content.replace(/\n/g, '<br>') : content;
  }

  insertLink(text: string, link: string) {
    // add content with link based on https or http to quill
    this.insertLinkData.modalRef.close();
    if (!/^https?:\/\//i.test(link)) {
      link = `http://${link}`;
    }
    this.quill.focus();
    this.quill.updateContents(
      new Delta().retain(this.quill.getSelection().index).insert(text, { link, target: '_blank' }),
    );
  }

  openInsertLinkModal() {
    this.insertLinkData = {};
    this.insertLinkData.modalRef = this.modalService.open(this.insertLinkModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal',
    });
  }

  initializeAutoSave() {
    if (this.settings.autosave_duration !== 'none') {
      this.autoSaveSubscription = this.valueChanged$
        .pipe(
          debounceTime(Number(this.settings.autosave_duration)), // get autosave interval from user's settings
        )
        .subscribe(data => {
          if (!this.draft.isSaving) {
            this.updateEmail();
          }
        });
    }
  }

  quillImageHandler() {
    this.attachImagesModalRef = this.modalService.open(this.attachImagesModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal',
    });
  }

  onFromChanged(mailbox: Mailbox, oldMailbox: Mailbox) {
    // when user change current mailbox on From field of Compose window
    if (oldMailbox === mailbox) {
      return;
    }
    this.selectedMailbox = mailbox;
    this.oldMailbox = oldMailbox;
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
        const FR = new FileReader();
        FR.addEventListener('load', function (e) {
          document.querySelector('.ql-editor p').innerHTML += `<img src=${e.target.result} alt="image" />`;
        });
        FR.readAsDataURL(file);
      } else {
        // TODO: add error notification for invalid file type here
      }
    }
  }

  onFilesSelected(files: FileList) {
    this.isProcessingAttachments = true;
    if ((!this.draftMail || !this.draftMail.id) && !this.draft.isSaving) {
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
        inProgress: false,
        actual_size: file.size,
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
    // there is limit size of attachment from user's settings
    const attachmentLimitInMBs = this.settings.attachment_size_limit / (1024 * 1024);
    if (file.size > this.settings.attachment_size_limit) {
      this.store.dispatch(
        new SnackErrorPush({
          message: this.settings.attachment_size_error || `Maximum allowed file size is ${attachmentLimitInMBs}MB.`,
        }),
      );
      return false;
    }
    return true;
  }

  encryptAttachment(attachment: Attachment) {
    if (attachment.is_inline) {
      this.store.dispatch(new UploadAttachment({ ...attachment }));
    } else {
      this.openPgpService.encryptAttachment(this.selectedMailbox.id, attachment);
    }
  }

  handleAttachment(draft: Draft) {
    // usage Object.assign to create new copy and avoid storing reference of draft.attachments
    this.attachments = Object.assign([], draft.attachments);
    this.decryptAttachments(this.attachments);
    this.isUploadingAttachment = false;
    // TODO: remove this if its not required anymore due to change in handling of inline attachments?
    this.attachments.forEach(attachment => {
      if (
        attachment.is_inline &&
        attachment.progress === 100 &&
        !attachment.isRemoved &&
        attachment.content_id &&
        (!attachment.is_encrypted || attachment.decryptedDocument) &&
        !this.inlineAttachmentContentIds.includes(attachment.content_id)
      ) {
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
    if (this.inProgress || this.draft.isSaving || this.isProcessingAttachments) {
      // If saving is in progress, then wait to send.
      setTimeout(() => {
        this.saveInDrafts();
      }, 100);
      return;
    }
    if (this.isSavedInDraft) {
      // if email already saved in ngOnDestroy.
      return;
    }
    this.isSavedInDraft = true;
    this.updateEmail();
    this.hide.emit();
    this.resetValues();
  }

  closeCompose() {
    if (this.isProcessingAttachments) {
      this.closeConfirmModalRef = this.modalService.open(this.closeConfirmationModal, {
        centered: true,
        windowClass: 'modal-sm users-action-modal',
      });
    } else {
      this.saveInDrafts();
    }
  }

  closeComposeConfirm() {
    if (this.closeConfirmModalRef) {
      this.closeConfirmModalRef.dismiss();
    }
    if (this.isProcessingAttachments) {
      const attachments = this.attachments;
      for (let i = 0; i < attachments.length; i++) {
        if (attachments[i].inProgress) {
          this.removeAttachment(attachments[i]);
        }
      }
    }
    this.saveInDrafts();
  }

  discardEmail() {
    if (this.inProgress || this.draft.isSaving || this.isProcessingAttachments) {
      // If saving is in progress, then wait to send.
      setTimeout(() => {
        this.discardEmail();
      }, 100);
      return;
    }
    this.isSavedInDraft = true;
    if (this.draftMail && this.draftMail.id) {
      this.store.dispatch(
        new MoveMail({
          ids: this.draftMail.id,
          folder: MailFolderType.TRASH,
          sourceFolder: MailFolderType.DRAFT,
          mail: this.draftMail,
          allowUndo: true,
        }),
      );
    }
    this.hide.emit();
    this.resetValues();
  }

  isSelfDestructionEnable() {
    this.isSelfDestruction = false;
    const receivers: string[] = [
      ...this.mailData.receiver.map(receiver => receiver.email),
      ...this.mailData.cc.map(cc => cc.email),
      ...this.mailData.bcc.map(bcc => bcc.email),
    ];
    receivers.forEach(receiver => {
      const getDomain = receiver.substring(receiver.indexOf('@') + 1, receiver.length);
      if (getDomain === 'ctemplar.com') {
        this.isSelfDestruction = true;
      }
    });
    if (!this.isSelfDestruction && this.selfDestruct.date) {
      this.clearSelfDestructValue();
    }
  }

  addHyperLink() {
    var regex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.com|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    this.quill.focus();
    var contents = this.quill.getText();
    var filtered = contents.trim().split(/\s+/);
    for (let i = 0; i < filtered.length; i++) {
      var match = filtered[i].match(regex);
      if (match !== null) {
        var url = match[0];
        var hyperLink = url;
        if (!/^https?:\/\//i.test(url)) {
          hyperLink = `http://${url}`;
        }
        var position = contents.indexOf(url);
        this.quill.updateContents(
          new Delta().retain(position).delete(url.length).insert(url, { link: hyperLink, target: '_blank' }),
        );
      }
    }
  }

  /**
   * Check exceptions and validations of subject and receiver before send mail
   */
  sendEmailCheck() {
    if (this.isPreparingToSendEmail) return;
    if (!this.selectedMailbox.is_enabled) {
      this.store.dispatch(
        new SnackPush({ message: 'Selected email address is disabled. Please select a different email address.' }),
      );
      return;
    }
    const receivers: string[] = [
      ...this.mailData.receiver.map(receiver => receiver.email),
      ...this.mailData.cc.map(cc => cc.email),
      ...this.mailData.bcc.map(bcc => bcc.email),
    ];
    if (receivers.length === 0) {
      this.store.dispatch(new SnackErrorPush({ message: 'Please enter receiver email.' }));
      return;
    }
    const invalidAddress = receivers.find(receiver => !this.rfcStandardValidateEmail(receiver));
    if (invalidAddress) {
      this.store.dispatch(new SnackErrorPush({ message: `"${invalidAddress}" is not valid email address.` }));
      return;
    }
    this.isPreparingToSendEmail = true;
    if (this.inProgress || this.draft.isSaving || this.isProcessingAttachments) {
      // If saving is in progress, then wait to send.
      setTimeout(() => {
        this.isPreparingToSendEmail = false;
        this.sendEmailCheck();
      }, 100);
      return;
    }
    if (receivers.some(receiver => this.usersKeys.has(receiver) && this.usersKeys.get(receiver).isFetching)) {
      // If fetching for user key, wait to send
      setTimeout(() => {
        this.isPreparingToSendEmail = false;
        this.sendEmailCheck();
      }, 100);
      return;
    }
    if (
      this.mailData.subject === '' &&
      ((this.draftMail.is_html &&
        this.getPlainText(this.editor.nativeElement.firstChild.innerHTML).replace(/ /g, '').replace(/\n/g, '')
          .length === 0) ||
        (!this.draftMail.is_html && this.mailData.content.replace(/ /g, '').replace(/\n/g, '').length === 0))
    ) {
      // show message to confirm without subject and content
      this.confirmModalRef = this.modalService.open(this.confirmationModal, {
        centered: true,
        windowClass: 'modal-sm users-action-modal',
      });
    } else {
      if (this.draftMail.is_html) {
        this.addHyperLink();
      }
      this.sendEmail();
    }
  }

  sendEmail() {
    if (this.confirmModalRef) {
      this.confirmModalRef.dismiss();
    }
    let receivers: string[] = [
      ...this.mailData.receiver.map(receiver => receiver.display),
      ...this.mailData.cc.map(cc => cc.display),
      ...this.mailData.bcc.map(bcc => bcc.display),
    ];
    receivers = receivers.filter(
      email => !this.usersKeys.has(email) || (!this.usersKeys.get(email).key && !this.usersKeys.get(email).isFetching),
    );
    if (this.encryptionData.password) {
      this.openPgpService.generateEmailSshKeys(this.encryptionData.password, this.draftId);
    }
    this.isMailSent = true;
    this.setMailData(true, false);
    this.inProgress = true;
    this.store.dispatch(
      new GetUsersKeys({
        draftId: this.draftId,
        emails: receivers,
        draft: {
          ...this.draft,
          isMailDetailPage: this.isMailDetailPage,
          isSaving: false,
          shouldSave: false,
          shouldSend: true,
          draft: { ...this.draftMail },
        },
      }),
    );
    const message = this.delayedDelivery.value || this.deadManTimer.value ? 'Scheduling mail...' : 'Sending mail...';

    this.store.dispatch(new SnackPush({ message, duration: 120000 }));
    this.resetValues();
    this.hide.emit();
  }

  removeAttachment(attachment: Attachment) {
    if (!attachment.isRemoved) {
      attachment.isRemoved = true;
      this.store.dispatch(new DeleteAttachment(attachment));
    }
  }

  /**
   * Add signature on content of Compose message
   */
  updateSignature() {
    if (!this.isSignatureAdded) {
      if (this.settings && !this.draftMail.is_html) {
        // add plaintext signature and return if plain text mode
        this.isSignatureAdded = true;
        this.mailData.content = this.mailData.content ? this.mailData.content : ' ';
        if (this.selectedMailbox.signature) {
          this.mailData.content = `\n\n${this.getPlainText(this.selectedMailbox.signature)}${this.mailData.content}`;
        }
        return;
      }
      /**
       * add html signature if html version
       */
      let content: string;
      let oldSig: string;
      let newSig: string;
      if (this.quill && this.quill.container) {
        content = this.quill.container.innerHTML || '';
        content = content.replace(/\n\n/g, '<br>');
      }
      if (this.quill && this.quill.container) {
        if (this.oldMailbox && this.oldMailbox.signature) {
          // update signature from old to new if signature is updated
          oldSig = this.oldMailbox.signature.slice(0, Math.max(0, this.oldMailbox.signature.length));
          if (this.selectedMailbox.signature) {
            newSig = this.selectedMailbox.signature.slice(0, Math.max(0, this.selectedMailbox.signature.length));
            content = content.replace(new RegExp(`${oldSig}$`), newSig);
          } else {
            content = content.replace(new RegExp(`${oldSig}$`), '');
          }
          this.quill.clipboard.dangerouslyPasteHTML(content);
        } else if (this.selectedMailbox.signature) {
          // add two lines and signature after message content with html format
          newSig = this.selectedMailbox.signature.slice(0, Math.max(0, this.selectedMailbox.signature.length));
          content = `<br><br>${newSig}` + content;
          this.isSignatureAdded = true;
          this.quill.clipboard.dangerouslyPasteHTML(content);
        } else if (this.quill && this.selectedMailbox) {
          if (this.selectedMailbox.signature) {
            const index = this.quill.getLength();
            this.quill.insertText(index, '\n', 'silent');
            const signature = this.selectedMailbox.signature.replace(/\n/g, '<br>');
            this.quill.clipboard.dangerouslyPasteHTML(index + 1, signature || '', 'silent');
            this.isSignatureAdded = true;
          }
        }
      }
    }
  }

  addDecryptedContent() {
    if (!this.draftMail.is_html) {
      this.mailData.content = this.decryptedContent;
      return;
    }
    if (this.quill) {
      this.quill.setText('');
      this.quill.clipboard.dangerouslyPasteHTML(0, this.decryptedContent, 'silent');
    }
  }

  openSelfDestructModal() {
    if (this.selfDestruct.value) {
      // reset to previous confirmed value
      this.selfDestruct = {
        ...this.selfDestruct,
        ...this.dateTimeUtilService.getNgbDateTimeStructsFromDateTimeStr(this.selfDestruct.value),
      };
    } else {
      this.resetSelfDestructValues();
    }
    this.selfDestructModalRef = this.modalService.open(this.selfDestructModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal',
    });
  }

  openDelayedDeliveryModal() {
    if (this.delayedDelivery.value) {
      // reset to previous confirmed value
      this.delayedDelivery = {
        ...this.delayedDelivery,
        ...this.dateTimeUtilService.getNgbDateTimeStructsFromDateTimeStr(this.delayedDelivery.value),
      };
    } else {
      this.resetDelayedDeliveryValues();
    }
    this.delayedDeliveryModalRef = this.modalService.open(this.delayedDeliveryModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal',
    });
  }

  openDeadManTimerModal() {
    if (!this.deadManTimer.value) {
      this.resetDeadManTimerValues();
    }
    this.deadManTimerModalRef = this.modalService.open(this.deadManTimerModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal',
    });
  }

  openEncryptionModal() {
    this.encryptForm.controls.password.setValue(this.encryptionData.password || '');
    this.encryptForm.controls.passwordHint.setValue(this.encryptionData.password_hint || '');
    this.encryptionModalRef = this.modalService.open(this.encryptionModal, {
      centered: true,
      windowClass: 'modal-md users-action-modal',
    });
  }

  closeEncryptionModal() {
    this.encryptionModalRef.dismiss();
  }

  setSelfDestructValue() {
    this.selfDestruct.error = null;
    if (this.selfDestruct.date && this.selfDestruct.time) {
      const dateTimeString = this.dateTimeUtilService.createDateTimeStrFromNgbDateTimeStruct(
        this.selfDestruct.date,
        this.selfDestruct.time,
      );
      if (this.dateTimeUtilService.isDateTimeInPast(dateTimeString)) {
        this.selfDestruct.error = 'Selected datetime is in past.';
      } else {
        this.selfDestruct.value = dateTimeString;
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
      const dateTimeString = this.dateTimeUtilService.createDateTimeStrFromNgbDateTimeStruct(
        this.delayedDelivery.date,
        this.delayedDelivery.time,
      );
      if (this.dateTimeUtilService.isDateTimeInPast(dateTimeString)) {
        this.delayedDelivery.error = 'Selected datetime is in past.';
      } else {
        this.delayedDelivery.value = dateTimeString;
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
      !this.deadManTimer.days || isNaN(this.deadManTimer.days) || this.deadManTimer.days < 0
        ? 0
        : Math.floor(this.deadManTimer.days);
    this.deadManTimer.hours =
      !this.deadManTimer.hours || isNaN(this.deadManTimer.hours) || this.deadManTimer.hours < 0
        ? 0
        : Math.floor(this.deadManTimer.hours);
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
    // Set password and expire date for message to non-ctemplar users
    this.showEncryptFormErrors = true;
    const { value } = this.encryptForm;
    const expiryHours = value.hours + value.days * 24;
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
  }

  hasData() {
    // using >1 because there is always a blank line represented by ‘\n’ (quill docs)
    return (
      (!this.draftMail.is_html ? this.mailData.content.length > 1 : this.quill.getLength() > 1) ||
      this.mailData.receiver.length > 0 ||
      this.mailData.cc.length > 0 ||
      this.mailData.bcc.length > 0 ||
      this.mailData.subject
    );
  }

  private embedImageInQuill(source: string, contentId?: string) {
    if (source && this.quill) {
      const selection = this.quill.getSelection();
      const index = selection ? selection.index : this.quill.getLength();
      if (contentId === undefined) {
        this.quill.insertEmbed(index, 'image', source);
      } else {
        this.quill.insertEmbed(index, 'image', {
          url: source,
          content_id: contentId,
        });
      }
      this.quill.setSelection(index + 1);
    }
  }

  private updateEmail() {
    this.inProgress = true;
    this.setMailData(false, true);
    this.openPgpService.encrypt(this.draftMail.mailbox, this.draftId, new SecureContent(this.draftMail));
  }

  /**
   * Handle all compose contents and save to draft or send according to shouldSend and shouldSave
   */
  setMailData(shouldSend: boolean, shouldSave: boolean) {
    if (!this.draftMail) {
      this.draftMail = { is_html: null, content: null, folder: 'draft' };
    }

    this.draft.isSaving = shouldSave;

    this.draftMail.mailbox = this.selectedMailbox ? this.selectedMailbox.id : null;
    this.draftMail.sender = this.selectedMailbox.email;
    this.draftMail.receiver = this.mailData.receiver.map(receiver =>
      EmailFormatPipe.transformToFormattedEmail(receiver.email, receiver.name),
    );
    this.draftMail.receiver = this.draftMail.receiver.filter(receiver => this.rfcStandardValidateEmail(receiver));
    this.draftMail.cc = this.mailData.cc.map(cc => EmailFormatPipe.transformToFormattedEmail(cc.email, cc.name));
    this.draftMail.cc = this.draftMail.cc.filter(receiver => this.rfcStandardValidateEmail(receiver));
    this.draftMail.bcc = this.mailData.bcc.map(bcc => EmailFormatPipe.transformToFormattedEmail(bcc.email, bcc.name));
    this.draftMail.bcc = this.draftMail.bcc.filter(receiver => this.rfcStandardValidateEmail(receiver));
    this.draftMail.subject = this.mailData.subject;
    this.draftMail.destruct_date = this.selfDestruct.value || null;
    this.draftMail.delayed_delivery = this.delayedDelivery.value || null;
    this.draftMail.dead_man_duration = this.deadManTimer.value || null;
    this.draftMail.is_subject_encrypted = true;
    let tokens;
    if (this.draftMail.is_html) {
      // if html version, convert text to html format with html tags
      if (this.editor.nativeElement.firstChild !== null) {
        this.draftMail.content = this.editor.nativeElement.firstChild.innerHTML;
        tokens = this.draftMail.content.split(`<p>${SummarySeparator}</p>`);
      }
      if (tokens && tokens.length > 1) {
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
      // if text version, don't convert content
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
      this.store.dispatch(
        new UpdateLocalDraft({
          ...this.draft,
          isMailDetailPage: this.isMailDetailPage,
          shouldSave,
          shouldSend,
          draft: { ...this.draftMail },
        }),
      );
    } else {
      if (this.draftMail.subject !== this.subject) {
        this.draftMail.parent = null;
      }
      this.store.dispatch(
        new UpdatePGPDecryptedContent({
          id: this.draftMail.id,
          isPGPInProgress: false,
          decryptedContent: { content: this.draftMail.content, subject: this.draftMail.subject },
        }),
      );
    }
  }

  checkInlineAttachments() {
    if (!this.draftMail.is_html) {
      return;
    }
    const contents = this.quill.getContents().ops;
    const currentAttachments = [];
    contents.forEach(item => {
      if (item.insert && item.insert.image && item.insert.image.content_id) {
        currentAttachments.push(item.insert.image.content_id);
      }
    });
    // inline attachments don't have attachment id
    this.inlineAttachmentContentIds = this.inlineAttachmentContentIds.filter(contentId => {
      if (!currentAttachments.includes(contentId)) {
        const attachmentToRemove = this.attachments.find(attachment => attachment.content_id === contentId);
        if (attachmentToRemove) {
          this.removeAttachment(attachmentToRemove);
        }
        return false;
      }
      return true;
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
      receiver: this.receivers
        ? this.receivers.map(receiver => ({ display: receiver, value: receiver, email: receiver }))
        : this.draftMail && this.draftMail.receiver
        ? this.draftMail.receiver.map(receiver => ({ display: receiver, value: receiver, email: receiver }))
        : [],
      cc: this.cc
        ? this.cc.map(address => ({ display: address, value: address, email: address }))
        : this.draftMail && this.draftMail.cc
        ? this.draftMail.cc.map(receiver => ({ display: receiver, value: receiver, email: receiver }))
        : [],
      bcc:
        this.draftMail && this.draftMail.bcc
          ? this.draftMail.bcc.map(receiver => ({ display: receiver, value: receiver, email: receiver }))
          : [],
      subject:
        this.draftMail && this.draftMail.is_subject_encrypted
          ? ''
          : this.subject
          ? this.subject
          : this.draftMail
          ? this.draftMail.subject
          : '',
      content: '',
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
      second: 0,
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
      second: 0,
    };
    this.delayedDelivery.meridian = true;
    this.delayedDelivery.error = null;
  }

  private resetDeadManTimerValues() {
    this.deadManTimer.value = null;
    this.deadManTimer.days = 0;
    this.deadManTimer.hours = 0;
  }

  onFilesDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    this.onFilesSelected(event.dataTransfer.files);
  }

  onAddingReceiver(tag: any, data: any[]) {
    // convert tag values to custom format with value, display, email, name
    data.forEach(item => {
      if (item.email) {
        item.display = item.email;
      } else if (item.value) {
        // TODO
        // should be updated for support group mailbox
        // in that case, the below line should be updated for cast into ParsedGroup as well
        const parsedEmail = parseEmail.parseOneAddress(item.value) as parseEmail.ParsedMailbox;
        if (parsedEmail) {
          item.name = parsedEmail.name || parsedEmail.local || '';
          item.value = parsedEmail.address || item.value;
          item.email = parsedEmail.address || item.value;
        } else {
          item.email = item.name = item.value;
        }
      }
    });
    if (tag.value && tag.value.split(',').length > 1) {
      const emails = [];
      data.forEach(item => {
        if (item.value === tag.value) {
          const tokens = tag.value.split(',');
          emails.push(
            ...tokens.map(token => {
              token = token.trim();
              return { value: token, display: token, email: token, name: token };
            }),
          );
        } else {
          emails.push(item);
        }
      });
      data.splice(0, this.mailData.receiver.length);
      data.push(...emails);
    }
    const receiversForKey = data
      .filter(
        receiver =>
          !this.usersKeys.has(receiver.email) ||
          (!this.usersKeys.get(receiver.email).key && !this.usersKeys.get(receiver.email).isFetching),
      )
      .map(receiver => receiver.email);

    if (receiversForKey.length > 0) {
      this.store.dispatch(
        new GetUsersKeys({
          emails: receiversForKey,
        }),
      );
    }
    this.valueChanged$.next(data);
    this.isSelfDestructionEnable();
  }

  getUserKeyFetchingStatus(email: string): boolean {
    if (!this.usersKeys.has(email)) {
      this.store.dispatch(
        new GetUsersKeys({
          emails: [email],
        }),
      );
    }
    return !this.usersKeys.has(email) || (this.usersKeys.has(email) && this.usersKeys.get(email).isFetching);
  }

  rfcStandardValidateEmail(address: string): boolean {
    return !!parseEmail.parseOneAddress(address);
  }
}
