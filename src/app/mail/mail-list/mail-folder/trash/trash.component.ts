import { Component, OnInit, Input } from '@angular/core';
import { MailListComponent } from '../../mail-list.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store/datatypes';
import { ActivatedRoute } from '@angular/router';
import {Mail, MailFolderType} from '../../../../store/models';


@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.scss']
})
export class TrashComponent extends MailListComponent implements OnInit {

  @Input() mails: Mail[];

  constructor( public store: Store<AppState>,
    public route: ActivatedRoute) {
    super(store, route);
  }

  ngOnInit() {
    this.getMails(MailFolderType.TRASH);
  }
}
