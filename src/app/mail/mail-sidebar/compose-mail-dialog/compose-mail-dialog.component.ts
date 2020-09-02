import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Mail } from '../../../store/models';
import { ComposeMailComponent } from '../compose-mail/compose-mail.component';
import { AppState, MailAction } from '../../../store/datatypes';
import { Store } from '@ngrx/store';
import { SetIsComposerPopUp } from '../../../store/actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-compose-mail-dialog',
  templateUrl: './compose-mail-dialog.component.html',
  styleUrls: ['./compose-mail-dialog.component.scss', './../mail-sidebar.component.scss']
})
export class ComposeMailDialogComponent implements OnInit, AfterViewInit {
  @Input() public isComposeVisible: boolean;
  @Input() public draft: Mail;
  @Input() action: MailAction;
  @Input() parentId: number;
  @Input() public isFullScreen: boolean;
  @Input() public receivers: Array<string>;

  @Output() public hide = new EventEmitter<boolean>();
  @Output() public minimize = new EventEmitter<boolean>();
  @Output() public fullScreen = new EventEmitter<boolean>();

  @ViewChild(ComposeMailComponent) composeMail: ComposeMailComponent;
  @ViewChild('input') input: ElementRef;

  private confirmModalRef: NgbModalRef;
  isMinimized: boolean;
  mailSubject = '';
  isPopupClosed: boolean;

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    if (this.draft) {
      this.mailSubject = this.draft.subject;
    }
    /**
     * Hide dialog when reply
     */
    this.store.select(state => state).pipe(untilDestroyed(this))
      .subscribe((appState: AppState) => {
        this.isPopupClosed = appState.mail.isComposerPopUp;
        if (this.isPopupClosed !== undefined && !this.isPopupClosed && this.action === MailAction.REPLY && this.composeMail !== undefined) {
          this.onHide();
        }
      });
  }

  ngAfterViewInit(): void {
    if (this.mailSubject && this.action) {
      if (this.action === MailAction.REPLY) {
        this.mailSubject = 'Reply: ' + this.mailSubject;
      }
    }
    this.cdr.detectChanges();
  }

  onClose() {
    if (this.action === MailAction.REPLY) {
      setTimeout(res => {
        this.store.dispatch(new SetIsComposerPopUp(
          false
        ));
      }, 2000);
    }
    /**
     * Save draft when close compose dialog
     */
    if (this.composeMail.hasData()) {
      this.saveInDrafts();
    } else if (this.composeMail.draftMail) {
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
    this.store.dispatch(new SetIsComposerPopUp(false));
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
