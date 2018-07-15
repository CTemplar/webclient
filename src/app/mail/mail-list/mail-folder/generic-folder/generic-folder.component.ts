import { Component, Input, OnInit } from '@angular/core';
import { MailListComponent } from '../../mail-list.component';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { AppState } from '../../../../store/datatypes';
import { Mail } from '../../../../store/models';

@Component({
  selector: 'app-generic-folder',
  templateUrl: './generic-folder.component.html',
  styleUrls: ['./generic-folder.component.scss']
})
export class GenericFolderComponent extends MailListComponent implements OnInit {
  @Input() mails: Mail[];

  constructor(public store: Store<AppState>,
              public route: ActivatedRoute) {
    super(store, route);
  }

  ngOnInit() {
  }

}
