import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import * as QuillNamespace from 'quill';
import { Subscription } from 'rxjs';
import { timer } from 'rxjs/observable/timer';

const Quill: any = QuillNamespace;

const FontAttributor = Quill.import('attributors/class/font');
FontAttributor.whitelist = [
  'hiragino-sans', 'lato', 'roboto', 'abril-fatface', 'andale-mono', 'arial', 'times-new-roman'
];
Quill.register(FontAttributor, true);

@Component({
    selector: 'app-compose-mail',
    templateUrl: './compose-mail.component.html',
    styleUrls: ['./compose-mail.component.scss', './../mail-sidebar.component.scss']
})
export class ComposeMailComponent implements OnInit, OnChanges {
    @Input() public isComposeVisible: boolean;

    @Output() public onHide = new EventEmitter<boolean>();

    @ViewChild('editor') editor;
    @ViewChild('toolbar') toolbar;

    private quill: any;
    private emailId: number;
    private autoSaveSubscription: Subscription;
    private AUTO_SAVE_DURATION: number = 10000; // duration in milliseconds

    constructor() {
    }

    ngOnInit() {
        this.initializeQuillEditor();
    }

    ngOnChanges(changes: any) {
        if (changes.isComposeVisible) {
            if (changes.isComposeVisible.currentValue === true) {
                this.initializeAutoSave();
            }
            else {
                this.unSubscribeAutoSave();
            }
        }
    }

    initializeQuillEditor() {
        this.quill = new Quill(this.editor.nativeElement, {
            modules: {
                toolbar: this.toolbar.nativeElement
            }
        });
    }

    initializeAutoSave() {
      this.autoSaveSubscription = timer(this.AUTO_SAVE_DURATION, this.AUTO_SAVE_DURATION)
        .subscribe(t => {
            this.updateEmail();
        });
    }

    hideMailComposeModal() {
        this.onHide.emit(true);
        this.emailId = null;
        this.unSubscribeAutoSave();
    }

    private updateEmail() {
        if (this.emailId) {
          // Add API call for updating email
        }
        else {
          this.createEmail();
        }
    }

    private createEmail() {
        // Add API call for creating email. Store returned id to this.emailId
      this.emailId = 10;
    }

    private unSubscribeAutoSave() {
        this.autoSaveSubscription.unsubscribe();
    }
}
