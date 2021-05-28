import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import * as DecoupledEditor from '../../../assets/js/ckeditor-build/ckeditor';
import { GetSecureMessageUserKeys, SendSecureMessageReply } from '../../store/actions';
import { AppState, SecureMessageState } from '../../store/datatypes';
import { Attachment, Mail } from '../../store/models';
import { OpenPgpService } from '../../store/services';


@UntilDestroy()
@Component({
  selector: 'app-reply-secure-message',
  templateUrl: './reply-secure-message.component.html',
  styleUrls: ['./reply-secure-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReplySecureMessageComponent implements OnInit {

  public DecoupledEditor = DecoupledEditor;

  composerEditorInstance: any;

  @Input() sourceMessage: Mail;

  @Input() hash: string;

  @Input() secret: string;

  @Input() senderId: string;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() replySuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('composerEditorElementRef', { read: ElementRef, static: false }) composerEditorElementRef: any;

  @ViewChild('toolbar') toolbar: any;

  attachments: Attachment[] = [];

  inProgress: boolean;

  private message: Mail;

  private secureMessageState: SecureMessageState;

  constructor(private store: Store<AppState>, private openPgpService: OpenPgpService) {}

  ngOnInit() {
    this.store
      .select(state => state.secureMessage)
      .pipe(untilDestroyed(this))
      .subscribe((state: SecureMessageState) => {
        this.inProgress = state.inProgress || state.isEncryptionInProgress;
        if (this.secureMessageState) {
          if (this.secureMessageState.getUserKeyInProgress && !state.getUserKeyInProgress) {
            const keys = [
              ...state.usersKeys
                .filter(item => this.message.receiver.includes(item.email) && item.is_enabled)
                .map(item => item.public_key),
            ];
            this.openPgpService.encryptSecureMessageContent(this.message.content, keys);
          } else if (this.secureMessageState.isEncryptionInProgress && !state.isEncryptionInProgress) {
            this.message.content = state.encryptedContent;
            this.store.dispatch(
              new SendSecureMessageReply({ hash: this.hash, secret: this.secret, message: this.message }),
            );
          } else if (this.secureMessageState.inProgress && !state.inProgress) {
            if (!state.errorMessage) {
              this.replySuccess.emit(true);
            }
          }
        }
        this.secureMessageState = state;
      });
  }

  onEditorReady(editor: any) {
    if (!this.composerEditorInstance) {
      this.composerEditorInstance =
        this.composerEditorElementRef?.nativeElement?.querySelector('.ck-editor__editable')?.ckeditorInstance;
    }
    const toolbarContainer = this.toolbar.nativeElement;
    toolbarContainer.append(editor.ui.view.toolbar.element);
    editor.editing.view.focus();
  }

  onSend() {
    if (this.hasData()) {
      this.message = {
        receiver: [this.sourceMessage.sender],
        subject: this.sourceMessage.subject,
        content: this.composerEditorInstance?.getData(),
        sender: this.senderId,
        parent: this.sourceMessage.id,
      };
      this.store.dispatch(new GetSecureMessageUserKeys({ hash: this.hash, secret: this.secret }));
    }
  }

  onCancel() {
    this.cancel.emit(true);
  }

  private hasData() {
    return this.composerEditorInstance?.model?.hasContent(this.composerEditorInstance?.model.document.getRoot());
  }
}
