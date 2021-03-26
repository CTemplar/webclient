import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as QuillNamespace from 'quill';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { COLORS, FONTS } from '../../shared/config';
import { GetSecureMessageUserKeys, SendSecureMessageReply } from '../../store/actions';
import { AppState, SecureMessageState } from '../../store/datatypes';
import { Attachment, Mail } from '../../store/models';
import { OpenPgpService } from '../../store/services';

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
  static create(value: any) {
    const node: any = super.create(value);
    node.setAttribute('src', value.url);
    if (value.content_id) {
      node.setAttribute('data-content-id', value.content_id);
    }
    return node;
  }

  static value(node: any) {
    return {
      content_id: node.getAttribute('data-content-id'),
      url: node.getAttribute('src'),
    };
  }
}

ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';

Quill.register(ImageBlot);

@UntilDestroy()
@Component({
  selector: 'app-reply-secure-message',
  templateUrl: './reply-secure-message.component.html',
  styleUrls: ['./reply-secure-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReplySecureMessageComponent implements OnInit, AfterViewInit {
  @Input() sourceMessage: Mail;

  @Input() hash: string;

  @Input() secret: string;

  @Input() senderId: string;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() replySuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('editor') editor: any;

  @ViewChild('toolbar') toolbar: any;

  colors = COLORS;

  fonts = FONTS;

  attachments: Attachment[] = [];

  inProgress: boolean;

  private message: Mail;

  private quill: any;

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

  ngAfterViewInit() {
    this.initializeQuillEditor();
  }

  initializeQuillEditor() {
    this.quill = new Quill(this.editor.nativeElement, {
      modules: {
        toolbar: this.toolbar.nativeElement,
      },
    });
  }

  onSend() {
    if (this.hasData()) {
      this.message = {
        receiver: [this.sourceMessage.sender],
        subject: this.sourceMessage.subject,
        content: this.editor.nativeElement.firstChild.innerHTML,
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
    // using >1 because there is always a blank line represented by ‘\n’ (quill docs)
    return this.quill.getLength() > 1;
  }
}
