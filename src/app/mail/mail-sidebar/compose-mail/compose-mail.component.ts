import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as QuillNamespace from 'quill';

const Quill: any = QuillNamespace;

@Component({
    selector: 'app-compose-mail',
    templateUrl: './compose-mail.component.html',
    styleUrls: ['./compose-mail.component.scss', './../mail-sidebar.component.scss']
})
export class ComposeMailComponent implements OnInit {
    @Input() public isComposeVisible: boolean;

    @Output() public onHide = new EventEmitter<boolean>();

    @ViewChild('editor') editor;
    @ViewChild('toolbar') toolbar;

    private quill: any;

    constructor() {
    }

    ngOnInit() {
        this.initializeQuillEditor();
    }

    initializeQuillEditor() {
        this.quill = new Quill(this.editor.nativeElement, {
            modules: {
                toolbar: this.toolbar.nativeElement
            }
        });
    }

    hideMailComposeModal() {
        this.onHide.emit(true);
    }
}
