import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import * as Parchment from 'parchment';
import * as QuillNamespace from 'quill';
import { Observable } from 'rxjs/Observable';
import { COLORS } from '../../shared/config';
import { Attachment, Mail } from '../../store/models';

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

@TakeUntilDestroy()
@Component({
  selector: 'app-reply-secure-message',
  templateUrl: './reply-secure-message.component.html',
  styleUrls: ['./reply-secure-message.component.scss']
})
export class ReplySecureMessageComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  @Input() sourceMessage: Mail;

  @Output() cancel: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('editor') editor;
  @ViewChild('toolbar') toolbar;

  colors = COLORS;
  attachments: Attachment[] = [];
  inProgress: boolean;

  private quill: any;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initializeQuillEditor();
  }

  ngOnDestroy(): void {
  }

  initializeQuillEditor() {
    this.quill = new Quill(this.editor.nativeElement, {
      modules: {
        toolbar: this.toolbar.nativeElement
      }
    });
  }

  sendEmail() {

  }

  onCancel() {
    this.cancel.emit(true);
  }

  private hasData() {
    // using >1 because there is always a blank line represented by ‘\n’ (quill docs)
    return this.quill.getLength() > 1;
  }

}