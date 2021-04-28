import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Attachment, Mail, MailFolderType } from '../../../store/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AppState, UserState } from '../../../store/datatypes';
import { Store } from '@ngrx/store';
import { LOADING_IMAGE } from '../../../store/services';

@UntilDestroy()
@Component({
  selector: 'app-mail-detail-body',
  templateUrl: './mail-detail-body.component.html',
  styleUrls: ['./mail-detail-body.component.scss']
})
export class MailDetailBodyComponent implements OnInit {

  /**
   * Input Section
   */
  @Input() isShowTrashRelatedChildren: boolean;

  @Input() mailFolder: MailFolderType;

  @Input() mail: Mail;

  @Input() mailExpandedStatus: boolean;

  @Input() decryptedContents: string;

  @Input() decryptedContentsPlain: string;

  @Input() disableMoveTo: boolean;

  @Input() plainTextViewState: boolean;

  @Input() isDecryptingError: boolean;

  @Input() isDecrypting: boolean;

  @Input() isPasswordEncrypted: boolean;

  @Input() decryptedAttachments: any;

  @Input() errorMessageForDecryptingWithPassword: string;

  @Input() isParentHeader: boolean;

  @Input() isLastChild?: boolean;

  @Input() unsubscribeLink: string;


  /**
   * Output Section
   */
  @Output() onForward = new EventEmitter();

  @Output() onReply = new EventEmitter();

  @Output() onReplyAll = new EventEmitter();

  @Output() onCancelSend = new EventEmitter();

  @Output() onPrint = new EventEmitter();

  @Output() onDelete = new EventEmitter();

  @Output() onDeleteForAll = new EventEmitter();

  @Output() showIncomingHeaders = new EventEmitter();

  @Output() downloadAllAttachments = new EventEmitter();

  @Output() scrollToReplyAction = new EventEmitter();

  @Output() onMarkAsSpam = new EventEmitter();

  @Output() onSwitchHtmlPlainTextMode = new EventEmitter();

  @Output() decryptAttachment = new EventEmitter<Attachment>();

  @Output() decryptWithPassword = new EventEmitter<string>();

  @Output() onClickHeader = new EventEmitter();

  @Output() onToggleStarred = new EventEmitter();


  /**
   * Local Variables Section
   */
  mailFolderTypes = MailFolderType;

  disableExternalImages: boolean;

  loadingImage = LOADING_IMAGE;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    /**
     * Get user settings
     */
    this.store
      .select(state => state.user)
      .pipe(untilDestroyed(this))
      .subscribe((user: UserState) => {
        this.disableExternalImages = user?.settings?.is_disable_loading_images;
      });
  }
}
