import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { MatKeyboardComponent, MatKeyboardRef, MatKeyboardService } from '@ngx-material-keyboard/core';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import * as QuillNamespace from 'quill';
import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { COLORS, ESCAPE_KEYCODE } from '../../../shared/config';
import { CloseMailbox, CreateMail, DeleteMail, UpdateLocalDraft } from '../../../store/actions';
import { AppState, Contact, MailState, UserState } from '../../../store/datatypes';
import { Mail, Mailbox } from '../../../store/models';
import { DateTimeUtilService } from '../../../store/services/datetime-util.service';
import { OpenPgpService } from '../../../store/services/openpgp.service';

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
  @ViewChild('delayedDeliveryModal') delayedDeliveryModal;
  @ViewChild('deadManTimerModal') deadManTimerModal;
  @ViewChild('encryptionModal') encryptionModal;

  colors = COLORS;
  mailData: any = {};
  options: any = {};
  selfDestruct: any = {};
  delayedDelivery: any = {};
  deadManTimer: any = {};
  attachments: Array<any> = [];
  isKeyboardOpened: boolean;
  mailbox: Mailbox;
  encryptForm: FormGroup;
  contacts: Contact[];
  datePickerMinDate: NgbDateStruct;
  valueChanged$: Subject<any> = new Subject<any>();
  inProgress: boolean;
  draftMail: Mail;

  private quill: any;
  private autoSaveSubscription: Subscription;
  private DEBOUNCE_DURATION: number = 5000; // duration in milliseconds
  private confirmModalRef: NgbModalRef;
  private attachImagesModalRef: NgbModalRef;
  private selfDestructModalRef: NgbModalRef;
  private delayedDeliveryModalRef: NgbModalRef;
  private deadManTimerModalRef: NgbModalRef;
  private encryptionModalRef: NgbModalRef;
  private signature: string;
  private _keyboardRef: MatKeyboardRef<MatKeyboardComponent>;
  private defaultLocale: string = 'US International';

  readonly destroyed$: Observable<boolean>;
  private shouldSave: boolean;
  private mailState: MailState;

  constructor(private modalService: NgbModal,
              private store: Store<AppState>,
              private formBuilder: FormBuilder,
              private openPgpService: OpenPgpService,
              private _keyboardService: MatKeyboardService,
              private dateTimeUtilService: DateTimeUtilService) {

    this.store.select((state: AppState) => state.mail)
      .subscribe((response: MailState) => {
        this.draftMail = response.draft;
        if (this.inProgress && !response.inProgress && !this.isComposeVisible) {
          this.store.dispatch(new CloseMailbox());
        }
        this.inProgress = response.inProgress;
        if (this.shouldSave && this.mailState && this.mailState.isPGPInProgress && !response.isPGPInProgress && response.draft) {
          response.draft.content = response.encryptedContent;
          this.shouldSave = false;
          this.store.dispatch(new CreateMail({ ...response.draft }));
          this.inProgress = true;
        }
        this.mailState = response;
      });

    this.store.select((state: AppState) => state.user).takeUntil(this.destroyed$)
      .subscribe((user: UserState) => {
        this.contacts = user.contact;
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
    this.datePickerMinDate = {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate()
    };

    this.resetMailData();

    this.encryptForm = this.formBuilder.group({
      'password': ['', [Validators.required]],
      'confirmPwd': ['', [Validators.required]],
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new CloseMailbox());
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
    } else if (this.draftMail && this.draftMail.id) {
      this.discardEmail();
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
    if (this.selfDestruct.value) {
      // reset to previous confirmed value
      this.selfDestruct = { ...this.selfDestruct, ...this.dateTimeUtilService.getNgbDateTimeStructsFromDateTimeStr(this.selfDestruct.value) };
    }
    else {
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
      this.delayedDelivery = { ...this.delayedDelivery, ...this.dateTimeUtilService.getNgbDateTimeStructsFromDateTimeStr(this.delayedDelivery.value) };
    }
    else {
      this.resetDelayedDeliveryValues();
    }
    this.delayedDeliveryModalRef = this.modalService.open(this.delayedDeliveryModal, {
      centered: true,
      windowClass: 'modal-sm users-action-modal'
    });
  }

  openDeadManTimerModal() {
    if (this.deadManTimer.value) {
      // reset to previous confirmed value
      this.deadManTimer = { ...this.deadManTimer, ...this.dateTimeUtilService.getNgbDateTimeStructsFromDateTimeStr(this.deadManTimer.value) };
    }
    else {
      this.resetDeadManTimerValues();
    }
    this.deadManTimerModalRef = this.modalService.open(this.deadManTimerModal, {
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

  setSelfDestructValue() {
    if (this.selfDestruct.date && this.selfDestruct.time) {
      this.selfDestruct.value = this.dateTimeUtilService.createDateTimeStrFromNgbDateTimeStruct(this.selfDestruct.date, this.selfDestruct.time);
      this.closeSelfDestructModal();
      this.valueChanged$.next(this.selfDestruct.value);
    }
  }

  clearSelfDestructValue() {
    this.resetSelfDestructValues();
    this.closeSelfDestructModal();
    this.valueChanged$.next(this.selfDestruct.value);
  }

  setDelayedDeliveryValue() {
    if (this.delayedDelivery.date && this.delayedDelivery.time) {
      this.delayedDelivery.value = this.dateTimeUtilService.createDateTimeStrFromNgbDateTimeStruct(this.delayedDelivery.date, this.delayedDelivery.time);
      this.closeDelayedDeliveryModal();
      this.valueChanged$.next(this.delayedDelivery.value);
    }
  }

  clearDelayedDeliveryValue() {
    this.resetDelayedDeliveryValues();
    this.closeDelayedDeliveryModal();
    this.valueChanged$.next(this.delayedDelivery.value);
  }

  setDeadManTimerValue() {
    if (this.deadManTimer.date && this.deadManTimer.time) {
      this.deadManTimer.value = this.dateTimeUtilService.createDateTimeStrFromNgbDateTimeStruct(this.deadManTimer.date, this.deadManTimer.time);
      this.closeDeadManTimerModal();
      this.valueChanged$.next(this.deadManTimer.value);
    }
  }

  clearDeadManTimerValue() {
    this.resetDeadManTimerValues();
    this.closeDeadManTimerModal();
    this.valueChanged$.next(this.deadManTimer.value);
  }

  hasData() {
    // using >1 because there is always a blank line represented by ‘\n’ (quill docs)
    return this.quill.getLength() > 1 ||
      this.mailData.receiver.length > 0 || this.mailData.cc.length > 0 || this.mailData.bcc.length > 0 || this.mailData.subject;
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

  private updateEmail() {
    if (!this.draftMail) {
      this.draftMail = { content: null, mailbox: this.mailbox.id, folder: 'draft' };
    }
    this.draftMail.receiver = this.mailData.receiver.map(receiver => receiver.display);
    this.draftMail.cc = this.mailData.cc.map(cc => cc.display);
    this.draftMail.bcc = this.mailData.bcc.map(bcc => bcc.display);
    this.draftMail.subject = this.mailData.subject;
    this.draftMail.destruct_date = this.selfDestruct.value || null;
    this.draftMail.delayed_delivery = this.delayedDelivery.value || null;
    this.draftMail.dead_man_timer = this.deadManTimer.value || null;
    this.draftMail.content = this.editor.nativeElement.firstChild.innerHTML;
    this.store.dispatch(new UpdateLocalDraft({ ...this.draftMail }));
    this.openPgpService.encrypt(this.draftMail.content);
    this.shouldSave = true;
  }

  private hideMailComposeModal() {
    this.unSubscribeAutoSave();
    this.options = {};
    this.attachments = [];
    this.quill.setText('');
    this.resetMailData();
    this.clearSelfDestructValue();
    this.clearDelayedDeliveryValue();
    this.clearDeadManTimerValue();
    this.onHide.emit(true);
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
    if (this.confirmModalRef) {
      this.confirmModalRef.close();
    }
  }

  private resetMailData() {
    this.mailData = {
      receiver: [],
      cc: [],
      bcc: [],
      subject: ''
    };
  }

  private resetSelfDestructValues() {
    this.selfDestruct.value = null;
    this.selfDestruct.date = null;
    this.selfDestruct.time = {
      hour: 0,
      minute: 0,
      second: 0
    };
  }

  private resetDelayedDeliveryValues() {
    this.delayedDelivery.value = null;
    this.delayedDelivery.date = null;
    this.delayedDelivery.time = {
      hour: 0,
      minute: 0,
      second: 0
    };
  }

  private resetDeadManTimerValues() {
    this.deadManTimer.value = null;
    this.deadManTimer.date = null;
    this.deadManTimer.time = {
      hour: 0,
      minute: 0,
      second: 0
    };
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === ESCAPE_KEYCODE) {
      this.closeOSK();
    }
  }
}
